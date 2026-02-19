
// Simple in-memory store that syncs to localStorage
// This avoids frequent writes and performance hits

const STORAGE_KEY = 'math_world_interaction_data';

class InteractionStore {
    constructor() {
        this.events = [];
        this.snapshots = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                this.events = parsed.events || [];
                this.snapshots = parsed.snapshots || [];
            }
        } catch (e) {
            console.error("Failed to load interaction data", e);
        }
    }

    saveToStorage() {
        try {
            const payload = JSON.stringify({
                events: this.events,
                snapshots: this.snapshots
            });
            localStorage.setItem(STORAGE_KEY, payload);
        } catch (e) {
            console.error("Failed to save interaction data", e);
        }
    }

    // Add a new interaction event
    logEvent(eventData) {
        const timestamp = Date.now();
        const event = {
            id: crypto.randomUUID(),
            timestamp,
            ...eventData
        };
        this.events.push(event);

        // Persist periodically or on key events to avoid blocking main thread
        // For this implementation, we'll save immediately for simplicity but 
        // in a real high-perf scenario we might debounce this.
        this.saveToStorage();

        if (process.env.NODE_ENV === 'development') {
            console.log("Interaction Logged:", event);
        }
    }

    // Save a base64 snapshot
    saveSnapshot(context, base64Image) {
        const snapshot = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            context, // e.g., { world, level, type: 'success' | 'failure' }
            image: base64Image // Base64 string
        };

        // Limit snapshots to prevent localStorage quota exceeded
        if (this.snapshots.length > 20) {
            this.snapshots.shift(); // Remove oldest
        }

        this.snapshots.push(snapshot);
        this.saveToStorage();
    }

    getEvents() {
        return this.events;
    }

    getSnapshots() {
        return this.snapshots;
    }

    clear() {
        this.events = [];
        this.snapshots = [];
        localStorage.removeItem(STORAGE_KEY);
    }
}

export const interactionStore = new InteractionStore();
