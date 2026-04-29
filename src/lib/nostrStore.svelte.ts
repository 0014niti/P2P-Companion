import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// 🌟 FIX 1: The "Shotgun" Array of Unrestricted Relays
const RELAYS = [
    'wss://relay.damus.io',           // Strict, but massive
    'wss://nos.lol',                  // Usually permissive
    'wss://relay.nostr.band',         // Great for indexing
    'wss://nostr.mom',                // Unrestricted
    'wss://relay.current.fyi',        // Unrestricted
    'wss://relay.primal.net',         // High performance
    'wss://relay.nostr.bg',           // European permissive
    'wss://nostr.bitcoiner.social'    // Cypherpunk permissive
];

export interface NostrMessage {
    id: string;
    pubkey: string;
    content: string;
    created_at: number;
    username: string;
}

class NostrEngine {
    pool = new SimplePool();
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

        this.currentSub = this.pool.subscribeMany(
            RELAYS,
            [
                {
                    kinds: [1], 
                    '#t': [hashtag], 
                    limit: 100 
                }
            ],
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
        console.log("🚀 Attempting to publish event to Nostr...", signedEvent);

        try {
            // 🌟 FIX 2: Wait for all relays to respond and log their answers
            const pubs = this.pool.publish(RELAYS, signedEvent);
            const results = await Promise.allSettled(pubs);
            
            let successCount = 0;
            results.forEach((res, index) => {
                if (res.status === 'rejected') {
                    console.warn(`❌ Relay ${RELAYS[index]} rejected:`, res.reason);
                } else {
                    console.log(`✅ Relay ${RELAYS[index]} accepted!`);
                    successCount++;
                }
            });

            if (successCount === 0) {
                alert("Warning: The Nostr network rejected your message (likely due to spam filters). Try again in a few minutes.");
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
            console.error("Critical failure publishing message:", err);
        }
    }
}

export const nostrStore = new NostrEngine();