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
    isRestoredAccount = $state(false);
    
    // 🌟 NEW: Unread State Trackers
    unreadGlobal = $state(false);
    unreadPrivate = $state(false);
    private sessionStartTime: number = 0; // To ignore old history

    public secretKeyHex: string | null = $state(null);
    public publicKeyHex: string | null = $state(null);
    private activeSockets: WebSocket[] = [];

    constructor() {
        if (typeof window !== 'undefined') {
            this.initializeKeys();
            // 🌟 NEW: Record exactly when the user opened the app
            this.sessionStartTime = Math.floor(Date.now() / 1000);
        }
    }

    // 🌟 NEW: Methods to clear the badges when the user opens the chat
    public markGlobalRead() { this.unreadGlobal = false; }
    public markPrivateRead() { this.unreadPrivate = false; }

    private initializeKeys() {
        this.username = localStorage.getItem('otc_username');
        const storedKey = localStorage.getItem('nostr_burner_key');
        const keyType = localStorage.getItem('otc_key_type'); 

        if (storedKey) {
            this.secretKeyHex = storedKey;
            const skBytes = hexToBytes(storedKey);
            this.publicKeyHex = getPublicKey(skBytes);
            
            if (keyType === 'restored') {
                this.isRestoredAccount = true;
            }
        } else {
            // Still generate a background burner just so they can passively read the feed
            const skBytes = generateSecretKey();
            this.secretKeyHex = bytesToHex(skBytes);
            this.publicKeyHex = getPublicKey(skBytes);
            localStorage.setItem('nostr_burner_key', this.secretKeyHex);
            localStorage.setItem('otc_key_type', 'burner'); 
        }
    }

    public setUsername(name: string) {
        this.username = name;
        localStorage.setItem('otc_username', name);
    }

    // 🌟 NEW: Official Sign Up
    public createOfficialAccount(name: string) {
        this.setUsername(name);
        localStorage.setItem('otc_key_type', 'restored'); // Locks the account in
        this.isRestoredAccount = true;
    }

    // 🌟 NEW: Official Sign In
    public restoreFromKey(key: string) {
        try {
            const cleanKey = key.trim();
            const skBytes = hexToBytes(cleanKey);
            this.publicKeyHex = getPublicKey(skBytes); 
            this.secretKeyHex = cleanKey;
            
            localStorage.setItem('nostr_burner_key', cleanKey);
            localStorage.setItem('otc_key_type', 'restored'); 
            this.isRestoredAccount = true;
            
            // Clear local username. The engine will auto-recover it from their past messages!
            this.username = null; 
            localStorage.removeItem('otc_username');
            
            // Reconnect to fetch their history
            this.activeSockets.forEach(ws => ws.close());
            return true;
        } catch(e) {
            return false;
        }
    }

    // Completely wipe and start fresh
    public logout() {
        localStorage.removeItem('nostr_burner_key');
        localStorage.removeItem('otc_key_type');
        localStorage.removeItem('otc_username');
        window.location.reload();
    }

    public subscribeToChannel(fiatTicker: string) {
        const hashtag = `p2potc_${fiatTicker.toLowerCase()}`;
        
        this.activeSockets.forEach(ws => ws.close());
        this.activeSockets = [];
        this.messages = [];
        this.dmMessages = [];

        const subId = `otc-sub-${Math.floor(Math.random() * 10000)}`;
        const reqPayload = JSON.stringify([
            "REQ", subId, 
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
            } catch (err) {}
        });
    }

    private async handleIncomingEvent(event: any) {
        // 🌟 NEW: Is this a new message, and is it from someone else?
        const isNew = event.created_at >= this.sessionStartTime;
        const isMine = event.pubkey === this.publicKeyHex;

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

                // 🌟 THE MAGIC TRICK: Auto-Recover Username on New Devices!
                if (event.pubkey === this.publicKeyHex && !this.username && parsedName !== "Anon") {
                    this.setUsername(parsedName);
                }

                const newMessage: NostrMessage = {
                    id: event.id, pubkey: event.pubkey, created_at: event.created_at,
                    username: parsedName, content: parsedContent
                };
                this.messages = [...this.messages, newMessage].sort((a, b) => b.created_at - a.created_at);
                // 🌟 NEW: Trigger Red Dot for Global
                if (isNew && !isMine) {
                    this.unreadGlobal = true;
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
                    // 🌟 NEW: Trigger Green Dot for VIP
                    if (isNew && !isMine) {
                        this.unreadPrivate = true;
                    }
                } catch(e) {}
            }
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
        
        let eventTemplate = { kind: 4, created_at: Math.floor(Date.now() / 1000), tags: [['p', targetPubkey]], content: encryptedContent };
        const signedEvent = finalizeEvent(eventTemplate, skBytes);

        try {
            const safeRelays = JSON.parse(JSON.stringify(RELAYS));
            pool.publish(safeRelays, signedEvent);
            this.handleIncomingEvent(signedEvent); 
        } catch (err) {}
    }
}

export const nostrStore = new NostrEngine();