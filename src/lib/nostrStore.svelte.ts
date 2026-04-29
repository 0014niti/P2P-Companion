import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// Global Relays
const RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.primal.net'
];

// Pool is completely outside the Svelte Class to prevent Proxy infection
const pool = new SimplePool();

export interface NostrMessage {
    id: string;
    pubkey: string;
    content: string;
    created_at: number;
    username: string;
}

class NostrEngine {
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

        // 🌟 THE FIX: Complete Proxy Annihilation
        // We stringify and re-parse the arrays to guarantee 100% pure JSON objects
        const rawFilters = [{ kinds: [1], '#t': [hashtag], limit: 100 }];
        const safeFilters = JSON.parse(JSON.stringify(rawFilters));
        const safeRelays = JSON.parse(JSON.stringify(RELAYS));

        this.currentSub = pool.subscribeMany(
            safeRelays,
            safeFilters,
            {
                // We point to a separate function to prevent Svelte from proxying the callback context
                onevent: (event: any) => this.handleIncomingEvent(event),
                oneose: () => { this.isConnected = true; }
            }
        );
    }

    // Isolated Event Handler
    private handleIncomingEvent(event: any) {
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

            // Safely update Svelte state
            this.messages = [...this.messages, newMessage].sort((a, b) => b.created_at - a.created_at);
        }
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
            const safeRelays = JSON.parse(JSON.stringify(RELAYS));
            const pubs = pool.publish(safeRelays, signedEvent);
            const results = await Promise.allSettled(pubs);
            
            let successCount = 0;
            results.forEach((res) => {
                if (res.status === 'fulfilled') successCount++;
            });

            if (successCount === 0) {
                console.warn("❌ All relays rejected the message.");
            } else {
                console.log(`✅ Message accepted by ${successCount} relays!`);
            }

            // Manually trigger the event handler to instantly show it on the sender's screen
            this.handleIncomingEvent(signedEvent);

        } catch (err) {
            console.error("Failed to publish message:", err);
        }
    }
}

export const nostrStore = new NostrEngine();
