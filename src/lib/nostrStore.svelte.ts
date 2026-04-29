import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// The 3 most stable global relays
const RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.primal.net'
];

// Pool is used ONLY for publishing to avoid Proxy conflicts
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
    
    // NEW: We will hold native WebSockets here to bypass the library bugs
    private activeSockets: WebSocket[] = [];

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

    // 🌟 THE FIX: 100% Native WebSockets. Immune to Svelte Proxies!
    public subscribeToChannel(fiatTicker: string) {
        const hashtag = `p2potc_${fiatTicker.toLowerCase()}`;
        
        // 1. Clean up old connections
        this.activeSockets.forEach(ws => ws.close());
        this.activeSockets = [];
        this.messages = [];

        console.log(`📡 Connecting to Native WebSockets for #${hashtag}...`);

        // 2. Create the exact, pure JSON string the relays demand
        const subId = `otc-sub-${Math.floor(Math.random() * 10000)}`;
        const reqPayload = JSON.stringify([
            "REQ", 
            subId, 
            { kinds: [1], '#t': [hashtag], limit: 100 }
        ]);

        // 3. Connect manually
        RELAYS.forEach(url => {
            try {
                const ws = new WebSocket(url);
                
                ws.onopen = () => {
                    ws.send(reqPayload); // Request the messages
                    this.isConnected = true;
                };

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    
                    // If it's an event belonging to our subscription
                    if (data[0] === "EVENT" && data[1] === subId) {
                        this.handleIncomingEvent(data[2]);
                    } 
                    // Log errors directly from the relay
                    else if (data[0] === "NOTICE") {
                        console.warn(`Relay ${url} warning:`, data[1]);
                    }
                };

                this.activeSockets.push(ws);
            } catch (err) {
                console.error(`Failed to connect to ${url}`);
            }
        });
    }

    // Safely parse and deduplicate incoming messages
    private handleIncomingEvent(event: any) {
        const exists = this.messages.some(m => m.id === event.id);
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
            // Publishing using SimplePool still works perfectly, so we keep it.
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

            // Instantly show our own message in the UI
            this.handleIncomingEvent(signedEvent);

        } catch (err) {
            console.error("Failed to publish message:", err);
        }
    }
}

export const nostrStore = new NostrEngine();
