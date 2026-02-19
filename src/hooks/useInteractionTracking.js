import { useEffect, useRef, useCallback, useContext } from 'react';
import { interactionStore } from '../utils/interactionStore';
import { CaptureContext } from '../components/ScreenCaptureWrapper';

export const useInteractionTracking = ({ world, level = 1, questionId }) => {
    const onStartCapture = useContext(CaptureContext);

    // Refs for mutable state to avoid re-renders
    const startTimeResponse = useRef(Date.now());
    const firstInteractionTime = useRef(null);
    const hoverDurations = useRef({}); // { elementId: totalDuration }
    const hoverStartTimes = useRef({}); // { elementId: startTime }
    const clickSequence = useRef([]);
    const attempts = useRef(0);
    const keystrokes = useRef([]);

    // Track mouse movement (throttled)
    useEffect(() => {
        let lastLogged = 0;
        const THROTTLE_MS = 100;

        const handleMouseMove = (e) => {
            // Only log if 100ms passed
            const now = Date.now();
            if (now - lastLogged > THROTTLE_MS) {
                // In a real heatmap scenario, we'd store coordinates.
                // For now, we can just acknowledge activity or store simplified path if needed.
                // To keep it lightweight, we won't store every coordinate in the store 
                // unless explicitly required for heatmap reconstruction.
                // We will just verify the user is active.
                if (!firstInteractionTime.current) {
                    firstInteractionTime.current = now;
                }
                lastLogged = now;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Track keystrokes
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!firstInteractionTime.current) {
                firstInteractionTime.current = Date.now();
            }
            // Store simple key representation
            keystrokes.current.push({
                key: e.key,
                timestamp: Date.now()
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Reset tracking when question changes
    useEffect(() => {
        startTimeResponse.current = Date.now();
        firstInteractionTime.current = null;
        hoverDurations.current = {};
        clickSequence.current = [];
        attempts.current = 0;
        keystrokes.current = [];
        hoverStartTimes.current = {};
    }, [world, level, questionId]);


    // --- Public Methods to be used by components ---

    const trackHoverStart = useCallback((elementId) => {
        hoverStartTimes.current[elementId] = Date.now();
        if (!firstInteractionTime.current) {
            firstInteractionTime.current = Date.now();
        }
    }, []);

    const trackHoverEnd = useCallback((elementId) => {
        const start = hoverStartTimes.current[elementId];
        if (start) {
            const duration = Date.now() - start;
            hoverDurations.current[elementId] = (hoverDurations.current[elementId] || 0) + duration;
            delete hoverStartTimes.current[elementId];
        }
    }, []);

    const trackClick = useCallback((elementId) => {
        clickSequence.current.push({
            target: elementId,
            timestamp: Date.now()
        });
        if (!firstInteractionTime.current) {
            firstInteractionTime.current = Date.now();
        }
    }, []);

    const markAttempt = useCallback((isCorrect) => {
        attempts.current += 1;

        // Log the full interaction session for this question attempt
        const sessionData = {
            world,
            level,
            questionId,
            wasCorrect: isCorrect,
            startTime: startTimeResponse.current,
            endTime: Date.now(),
            processingTimeMs: Date.now() - startTimeResponse.current,
            firstInteractionMs: firstInteractionTime.current ? (firstInteractionTime.current - startTimeResponse.current) : null,
            totalAttempts: attempts.current,
            hoverDurations: hoverDurations.current,
            clickSequence: clickSequence.current,
            keystrokes: keystrokes.current
        };

        interactionStore.logEvent({
            type: 'ANSWER_ATTEMPT',
            payload: sessionData
        });
    }, [world, level, questionId]);

    const triggerSnapshot = useCallback((type) => {
        if (onStartCapture) {
            // react-screen-capture's onStartCapture usually triggers the UI overlay.
            // If we want silent capture, we might need to mock this or accept the UI limitation.
            // For now, we trigger it as requested.
            onStartCapture();
            // Note: The actual saving happens in the ScreenCaptureWrapper's callback which we can't easily pass context into from here 
            // without more complex plumbing. 
            // A better way: The wrapper should probably expose a "registerCallback" or similar if we want to tie 
            // the resulting image back to THIS specific event context (like "success" vs "failure").
            // For simplicity in this "plug-and-play" scope, we might just letting the wrapper save the last capture
            // or use a global entry for the "pending capture context".
            interactionStore.logEvent({ type: 'SNAPSHOT_TRIGGERED', context: { world, level, questionId, type } });
        }
    }, [onStartCapture, world, level, questionId]);

    return {
        trackHoverStart,
        trackHoverEnd,
        trackClick,
        markAttempt,
        triggerSnapshot
    };
};
