import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// Removed snort.social (504 timeout) and kept the 3 most reliable, massive global relays
const RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.primal.net'
];

// 🌟 THE FIX: Move the Nostr Pool OUTSIDE the class! 
// Svelte's $state compiler will completely ignore this, keeping the WebSockets 100% pure.
const pool = new SimplePool();

export interface NostrMessage {
    id: string;
    pubkey: string;
    content: string;
    created_at: number;
    username: string;
}

class NostrEngine {
    // Only the UI data is reactive now
    messages = $state<NostrMessage[]>([]);
    isConnected = $state(false);
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

        console.log(`📡 Connecting to Nostr Relays for #${hashtag}...`);

        // Because pool is outside the class, this filter remains a pure JS object!
        const filter = {
            kinds: [1], 
            '#t': [hashtag], 
            limit: 100 
        };

        this.currentSub = pool.subscribeMany(
            RELAYS,
            [filter],
            {
                onevent: (event) => {
                    const exists = this.messages.find(m => m.id === event.id);
                    if (!exists) {
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

        const safeName = this.username || "Anon";
        const finalContent = `${safeName}:|:${content}`;

        let eventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', hashtag]],
            content: finalContent,
        };

        const signedEvent = finalizeEvent(eventTemplate, skBytes);
        console.log("🚀 Publishing Event...");

        try {
            const pubs = pool.publish(RELAYS, signedEvent);
            const results = await Promise.allSettled(pubs);
            
            let successCount = 0;
            results.forEach((res, index) => {
                if (res.status === 'fulfilled') {
                    successCount++;
                }
            });

            if (successCount === 0) {
                console.warn("❌ All relays rejected the message.");
            } else {
                console.log(`✅ Message accepted by ${successCount} relays!`);
            }

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
            console.error("Failed to publish message:", err);
        }
    }
}

export const nostrStore = new NostrEngine();
