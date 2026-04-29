import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent, nip04 } from 'nostr-tools';

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

const RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.primal.net'
];

const pool = new SimplePool();

export interface NostrMessage {
    id: string;
    pubkey: string;
    content: string;
    created_at: number;
    username: string;
    targetPubkey?: string;
}

class NostrEngine {
    messages = $state<NostrMessage[]>([]);
    dmMessages = $state<NostrMessage[]>([]);
    isConnected = $state(false);
    username = $state<string | null>(null); 
    
    // 🌟 NEW: Track if they have explicitly logged in
    isRestoredAccount = $state(false);
    
    public secretKeyHex: string | null = $state(null);
    public publicKeyHex: string | null = $state(null);
    private activeSockets: WebSocket[] = [];

    constructor() {
        if (typeof window !== 'undefined') {
            this.initializeKeys();
        }
    }

    private initializeKeys() {
        this.username = localStorage.getItem('otc_username');
        const storedKey = localStorage.getItem('nostr_burner_key');
        const keyType = localStorage.getItem('otc_key_type'); // 🌟 NEW: Check key type

        if (storedKey) {
            this.secretKeyHex = storedKey;
            const skBytes = hexToBytes(storedKey);
            this.publicKeyHex = getPublicKey(skBytes);
            
            // If they previously restored a key, mark them as a verified account
            if (keyType === 'restored') {
                this.isRestoredAccount = true;
            }
        } else {
            const skBytes = generateSecretKey();
            this.secretKeyHex = bytesToHex(skBytes);
            this.publicKeyHex = getPublicKey(skBytes);
            localStorage.setItem('nostr_burner_key', this.secretKeyHex);
            localStorage.setItem('otc_key_type', 'burner'); // Default to burner
        }
    }

    public setUsername(name: string) {
        this.username = name;
        localStorage.setItem('otc_username', name);
    }

    // 🌟 NEW: When they login, upgrade their account status!
    public restoreFromKey(key: string) {
        try {
            const cleanKey = key.trim();
            const skBytes = hexToBytes(cleanKey);
            this.publicKeyHex = getPublicKey(skBytes); 
            this.secretKeyHex = cleanKey;
            
            localStorage.setItem('nostr_burner_key', cleanKey);
            localStorage.setItem('otc_key_type', 'restored'); // Upgrade to restored
            this.isRestoredAccount = true; // Unlock VIP Room
            return true;
        } catch(e) {
            return false;
        }
    }

    public subscribeToChannel(fiatTicker: string) {
        const hashtag = `p2potc_${fiatTicker.toLowerCase()}`;
        
        this.activeSockets.forEach(ws => ws.close());
        this.activeSockets = [];
        this.messages = [];
        this.dmMessages = [];

        console.log(`📡 Connecting to Native WebSockets for #${hashtag} and VIP DMs...`);

        const subId = `otc-sub-${Math.floor(Math.random() * 10000)}`;
        
        const reqPayload = JSON.stringify([
            "REQ", 
            subId, 
            { kinds: [1], '#t': [hashtag], limit: 100 },
            { kinds: [4], '#p': [this.publicKeyHex!], limit: 50 },
            { kinds: [4], authors: [this.publicKeyHex!], limit: 50 }
        ]);

        RELAYS.forEach(url => {
            try {
                const ws = new WebSocket(url);
                ws.onopen = () => { ws.send(reqPayload); this.isConnected = true; };
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data[0] === "EVENT" && data[1] === subId) {
                        this.handleIncomingEvent(data[2]);
                    }
                };
                this.activeSockets.push(ws);
            } catch (err) { console.error(`Failed to connect to ${url}`); }
        });
    }

    private async handleIncomingEvent(event: any) {
        if (event.kind === 1) {
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
                    id: event.id, pubkey: event.pubkey, created_at: event.created_at,
                    username: parsedName, content: parsedContent
                };
                this.messages = [...this.messages, newMessage].sort((a, b) => b.created_at - a.created_at);
            }
        } 
        else if (event.kind === 4) {
            const exists = this.dmMessages.some(m => m.id === event.id);
            if (!exists) {
                try {
                    const isSender = event.pubkey === this.publicKeyHex;
                    const targetPubkey = isSender ? event.tags.find((t: any[]) => t[0] === 'p')[1] : event.pubkey;
                    
                    const skBytes = hexToBytes(this.secretKeyHex!);
                    const decrypted = await nip04.decrypt(skBytes, targetPubkey, event.content);
                    
                    const newMessage: NostrMessage = {
                        id: event.id, pubkey: event.pubkey, created_at: event.created_at,
                        username: isSender ? "You" : "VIP", content: decrypted, targetPubkey: targetPubkey
                    };
                    this.dmMessages = [...this.dmMessages, newMessage].sort((a, b) => a.created_at - b.created_at);
                } catch(e) { console.warn("Failed to decrypt DM"); }
            }
        }
    }

    public async sendMessage(content: string, fiatTicker: string) {
        if (!this.secretKeyHex) return;
        const hashtag = `p2potc_${fiatTicker.toLowerCase()}`;
        const skBytes = hexToBytes(this.secretKeyHex);
        const safeName = this.username || "Anon";
        const finalContent = `${safeName}:|:${content}`;

        let eventTemplate = { kind: 1, created_at: Math.floor(Date.now() / 1000), tags: [['t', hashtag]], content: finalContent };
        const signedEvent = finalizeEvent(eventTemplate, skBytes);
        
        try {
            const safeRelays = JSON.parse(JSON.stringify(RELAYS));
            pool.publish(safeRelays, signedEvent);
            this.handleIncomingEvent(signedEvent);
        } catch (err) {}
    }

    public async sendDM(targetPubkey: string, content: string) {
        if (!this.secretKeyHex) return;
        const skBytes = hexToBytes(this.secretKeyHex);
        
        const encryptedContent = await nip04.encrypt(skBytes, targetPubkey, content);
        
        let eventTemplate = {
            kind: 4,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['p', targetPubkey]],
            content: encryptedContent,
        };
        const signedEvent = finalizeEvent(eventTemplate, skBytes);

        try {
            const safeRelays = JSON.parse(JSON.stringify(RELAYS));
            pool.publish(safeRelays, signedEvent);
            this.handleIncomingEvent(signedEvent); 
        } catch (err) {}
    }
}

export const nostrStore = new NostrEngine();