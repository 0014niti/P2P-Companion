import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// 🌟 FIX 1: Better, highly permissive relays that do not block new users
const RELAYS = [
    'wss://relay.primal.net',
    'wss://relay.snort.social',
    'wss://nostr.mom',
    'wss://nos.lol'
];

export interface NostrMessage {
    id: string;
    pubkey: string;
    content: string;
    created_at: number;
    username: string; // We will attach the username here
}

class NostrEngine {
    pool = new SimplePool();
    messages = $state<NostrMessage[]>([]);
    isConnected = $state(false);
    
    // 🌟 FIX 2: Simple Username State instead of complicated Web3 Extensions
    username = $state<string | null>(null); 
    
    private secretKeyHex: string | null = null;
    public publicKeyHex: string | null = $state(null);
    private currentSub: any = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.initializeKeys();
        }
    }

    private initializeKeys() {
        // Load Username if they already "logged in"
        this.username = localStorage.getItem('otc_username');

        const storedKey = localStorage.getItem('nostr_burner_key');
        if (storedKey) {
            this.secretKeyHex = storedKey;
            const skBytes = hexToBytes(storedKey);
            this.publicKeyHex = getPublicKey(skBytes);
        } else {
            const skBytes = generateSecretKey();
            this.secretKeyHex = bytesToHex(skBytes);
            this.publicKeyHex = getPublicKey(skBytes);
            localStorage.setItem('nostr_burner_key', this.secretKeyHex);
        }
    }

    // Call this from the UI to "Login"
    public setUsername(name: string) {
        this.username = name;
        localStorage.setItem('otc_username', name);
    }

    public subscribeToChannel(fiatTicker: string) {
        const hashtag = `p2potc_${fiatTicker.toLowerCase()}`;
        
        if (this.currentSub) {
            this.currentSub.close();
            this.messages = [];
        }

        this.currentSub = this.pool.subscribeMany(
            RELAYS,
            [
                {
                    kinds: [1], 
                    '#t': [hashtag], 
                    limit: 50 
                }
            ],
            {
                onevent: (event) => {
                    const exists = this.messages.find(m => m.id === event.id);
                    if (!exists) {
                        // Extract our custom Username from the message content
                        let parsedName = "Anon";
                        let parsedContent = event.content;
                        
                        if (event.content.includes(':|:')) {
                            const parts = event.content.split(':|:');
                            parsedName = parts[0];
                            parsedContent = parts.slice(1).join(':|:');
                        }

                        const newMessage: NostrMessage = {
                            id: event.id,
                            pubkey: event.pubkey,
                            created_at: event.created_at,
                            username: parsedName,
                            content: parsedContent
                        };

                        this.messages = [...this.messages, newMessage].sort((a, b) => b.created_at - a.created_at);
                        if (this.messages.length > 100) this.messages = this.messages.slice(0, 100);
                    }
                },
                oneose: () => {
                    this.isConnected = true;
                }
            }
        );
    }

    public async sendMessage(content: string, fiatTicker: string) {
        if (!this.secretKeyHex) return;
        const hashtag = `p2potc_${fiatTicker.toLowerCase()}`;
        const skBytes = hexToBytes(this.secretKeyHex);

        // 🌟 Embed the username into the message string safely
        const safeName = this.username || "Anon";
        const finalContent = `${safeName}:|:${content}`;

        let eventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', hashtag]],
            content: finalContent,
        };

        const signedEvent = finalizeEvent(eventTemplate, skBytes);

        try {
            // 🌟 FIX 3: Force the relays to accept the publish request
            const pubs = this.pool.publish(RELAYS, signedEvent);
            await Promise.allSettled(pubs); // Wait for relays to process
            
            const exists = this.messages.find(m => m.id === signedEvent.id);
            if (!exists) {
                const newMessage: NostrMessage = {
                    id: signedEvent.id,
                    pubkey: signedEvent.pubkey,
                    created_at: signedEvent.created_at,
                    username: safeName,
                    content: content
                };
                this.messages = [newMessage, ...this.messages].sort((a, b) => b.created_at - a.created_at);
            }
        } catch (err) {
            console.error("Failed to publish message", err);
        }
    }
}

export const nostrStore = new NostrEngine();