import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

const RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.nostr.band',
    'wss://offchain.pub'
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
    
    // NEW: Track if user is using an extension
    isExtensionLogin = $state(false); 
    
    private secretKeyHex: string | null = null;
    public publicKeyHex: string | null = $state(null);
    private currentSub: any = null;

    constructor() {
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
            const skBytes = generateSecretKey();
            this.secretKeyHex = bytesToHex(skBytes);
            this.publicKeyHex = getPublicKey(skBytes);
            localStorage.setItem('nostr_burner_key', this.secretKeyHex);
        }
    }

    // NEW: Login with NIP-07 Browser Extension (Alby, nos2x)
    public async loginWithExtension() {
        if (typeof window !== 'undefined' && (window as any).nostr) {
            try {
                const pubkey = await (window as any).nostr.getPublicKey();
                this.publicKeyHex = pubkey;
                this.isExtensionLogin = true;
                this.secretKeyHex = null; // Clear burner key from memory
            } catch (err) {
                console.error("User rejected extension login", err);
            }
        } else {
            alert("No Nostr extension found! Please install the Alby or nos2x browser extension to log in.");
        }
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
        if (!this.publicKeyHex) return;
        const hashtag = `p2potc_${fiatTicker.toLowerCase()}`;

        let eventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', hashtag]],
            content: content,
        };

        let signedEvent;

        // NEW: Check if we need to sign via Extension or Burner Key
        if (this.isExtensionLogin && typeof window !== 'undefined' && (window as any).nostr) {
            try {
                signedEvent = await (window as any).nostr.signEvent(eventTemplate);
            } catch(e) {
                console.error("Extension signing failed", e);
                return;
            }
        } else if (this.secretKeyHex) {
            const skBytes = hexToBytes(this.secretKeyHex);
            signedEvent = finalizeEvent(eventTemplate, skBytes);
        } else {
            return;
        }

        try {
            await Promise.any(this.pool.publish(RELAYS, signedEvent));
            const exists = this.messages.find(m => m.id === signedEvent.id);
            if (!exists) {
                this.messages = [signedEvent as NostrMessage, ...this.messages].sort((a, b) => b.created_at - a.created_at);
            }
        } catch (err) {
            console.error("Failed to publish message", err);
        }
    }
}

export const nostrStore = new NostrEngine();