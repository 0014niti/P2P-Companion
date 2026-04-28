import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';

// Safe Hex Encoders to avoid dependency build issues
function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// Global public relays (The Decentralized Servers)
const RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.primal.net'
];

export interface NostrMessage {
    id: string;
    pubkey: string;
    content: string;
    created_at: number;
}

class NostrEngine {
    pool = new SimplePool();
    messages = $state<NostrMessage[]>([]);
    isConnected = $state(false);
    
    private secretKeyHex: string | null = null;
    public publicKeyHex: string | null = $state(null);
    private currentSub: any = null;

    constructor() {
        // Only run in browser, prevents Vercel server-side rendering crashes
        if (typeof window !== 'undefined') {
            this.initializeKeys();
        }
    }

    private initializeKeys() {
        const storedKey = localStorage.getItem('nostr_burner_key');
        if (storedKey) {
            this.secretKeyHex = storedKey;
            const skBytes = hexToBytes(storedKey);
            this.publicKeyHex = getPublicKey(skBytes);
        } else {
            // Generate a fresh burner identity instantly
            const skBytes = generateSecretKey();
            this.secretKeyHex = bytesToHex(skBytes);
            this.publicKeyHex = getPublicKey(skBytes);
            localStorage.setItem('nostr_burner_key', this.secretKeyHex);
        }
    }

    // Connect and listen to a specific fiat channel (e.g., #OTC_INR)
    public subscribeToChannel(fiatTicker: string) {
        const hashtag = `OTC_${fiatTicker.toUpperCase()}`;
        
        if (this.currentSub) {
            this.currentSub.close();
            this.messages = [];
        }

        this.currentSub = this.pool.subscribeMany(
            RELAYS,
            [
                {
                    kinds: [1], // 1 = Short Text Note (Standard Chat)
                    '#t': [hashtag], // Filter by our specific app hashtag
                    limit: 50 // Load last 50 messages
                }
            ],
            {
                onevent: (event) => {
                    // Prevent duplicates and sort by newest
                    const exists = this.messages.find(m => m.id === event.id);
                    if (!exists) {
                        this.messages = [...this.messages, event as NostrMessage].sort((a, b) => b.created_at - a.created_at);
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
        const hashtag = `OTC_${fiatTicker.toUpperCase()}`;
        const skBytes = hexToBytes(this.secretKeyHex);

        let eventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', hashtag]],
            content: content,
        };

        // Cryptographically sign the message (proving you own the burner key)
        const signedEvent = finalizeEvent(eventTemplate, skBytes);

        // Publish to relays
        try {
            await Promise.any(this.pool.publish(RELAYS, signedEvent));
            
            // Optimistically add to UI so it feels instantaneous
            const exists = this.messages.find(m => m.id === signedEvent.id);
            if (!exists) {
                this.messages = [signedEvent as NostrMessage, ...this.messages].sort((a, b) => b.created_at - a.created_at);
            }
        } catch (err) {
            console.error("Failed to publish message", err);
        }
    }
}

// Export a singleton instance so the whole app shares the same connection
export const nostrStore = new NostrEngine();