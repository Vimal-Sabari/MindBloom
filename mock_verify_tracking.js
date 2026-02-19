
// Mock Browser Environment
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

global.localStorage = localStorageMock;
const mockCrypto = { randomUUID: () => Math.random().toString(36).substring(2) };
global.window = {
    addEventListener: () => { },
    removeEventListener: () => { }
};

// --- Load Modules (Simulated) ---
// Since we are in a simple script, we'll paste the store logic here for testing
// to avoid complex module loading issues in this temporary script.

// 1. Store Logic
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
            console.error("Failed to load", e);
        }
    }
    saveToStorage() {
        const payload = JSON.stringify({ events: this.events, snapshots: this.snapshots });
        localStorage.setItem(STORAGE_KEY, payload);
    }
    logEvent(eventData) {
        const timestamp = Date.now();
        // Use our local mockCrypto instead of global.crypto
        const event = { id: mockCrypto.randomUUID(), timestamp, ...eventData };
        this.events.push(event);
        this.saveToStorage();
    }
    saveSnapshot(context, base64Image) {
        const snapshot = {
            id: mockCrypto.randomUUID(),
            timestamp: Date.now(),
            context,
            image: base64Image
        };
        this.snapshots.push(snapshot);
        this.saveToStorage();
    }
}
const store = new InteractionStore();

// 2. Simulate User Interaction
console.log("Starting Verification...");

// Scenario: User starts Question 1
console.log("User enters Question 1");
const sessionData = {
    world: 'spacelab',
    level: 1,
    questionId: 101,
    startTime: Date.now(),
    hoverDurations: { 'option-5': 500, 'option-3': 1200 }, // User hovered on wrong then right
    clickSequence: [{ target: 'option-3', timestamp: Date.now() }], // User clicked correct
    attempts: 1,
    wasCorrect: true
};

store.logEvent({ type: 'ANSWER_ATTEMPT', payload: sessionData });

// Scenario: Snapshot on Success
console.log("Triggering Snapshot...");
store.saveSnapshot(
    { world: 'spacelab', level: 1, questionId: 101, type: 'success' },
    "data:image/png;base64,fake-image-data"
);


// 3. Verify Data
const savedData = localStorage.getItem(STORAGE_KEY);
console.log("\n--- LocalStorage Content ---");
console.log(savedData ? "Data found!" : "NO DATA FOUND");

if (savedData) {
    const parsed = JSON.parse(savedData);
    console.log(`Events Logged: ${parsed.events.length}`);
    console.log(`Snapshots Saved: ${parsed.snapshots.length}`);

    if (parsed.events.length > 0 && parsed.events[0].payload.world === 'spacelab') {
        console.log("✅ Event Data Logic: PASSED");
    } else {
        console.log("❌ Event Data Logic: FAILED");
    }

    if (parsed.snapshots.length > 0 && parsed.snapshots[0].image === "data:image/png;base64,fake-image-data") {
        console.log("✅ Snapshot Logic: PASSED");
    } else {
        console.log("❌ Snapshot Logic: FAILED");
    }
}
