import React, { useState } from 'react';
import { ScreenCapture } from 'react-screen-capture';

const ScreenCaptureWrapper = ({ children, onCaptureReady }) => {
    const [screenCapture, setScreenCapture] = useState('');

    const handleScreenCapture = (screenCaptureBase64) => {
        setScreenCapture(screenCaptureBase64);
        // If a callback was provided when triggering the capture, this is where we'd ideally pass it back.
        // However, react-screen-capture's onEndCapture prop just gives the string.
        // We'll expose the *trigger* method via the parent. 
        // NOTE: react-screen-capture usually provides a UI overlay to select an area.
        // For SILENT capture, we might need a different approach or configuration if 
        // this library forces a UI. 
        // If react-screen-capture forces user selection (which it often does), 
        // we might strictly need html2canvas for true "silent" capture.
        // Let's assume for this specific task request we use the library as requested
        // but if it requires interaction, we might need to fallback to html2canvas for "silent" requirements.

        // **CRITICAL UX NOTE**: `react-screen-capture` is typically for USER-initiated screenshots (cropping).
        // If the requirement is AUTOMATIC/SILENT background capture, `html2canvas` is the standard solution.
        // Since the prompt explicitly asked for `react-screen-capture` BUT also said "silent/background",
        // there is a conflict. `react-screen-capture` pops up a selection tool.
        // I will implement this wrapper to satisfy the "Use react-screen-capture" requirement
        // but will expose the state. 

        if (onCaptureReady) {
            onCaptureReady(screenCaptureBase64);
        }
    };

    return (
        <ScreenCapture onEndCapture={handleScreenCapture}>
            {({ onStartCapture }) => (
                // We pass the "onStartCapture" function down so it can be triggered programmatically?
                // Actually, react-screen-capture renders its children with this arg.
                // We can render a hidden trigger or clone element.
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Pass the start capture method down to children if possible, 
                         or expose it via a context/ref if we were rewriting the app structure.
                         Since we can't easily rewrite everything, we'll Clone the child 
                         and inject the capture trigger if it's a single child, 
                         OR we use a Context.
                      */}
                    {/* 
                         Strategy: We will provide a Context so any game inside can grab the capture trigger.
                     */}
                    <CaptureContext.Provider value={onStartCapture}>
                        {children}
                    </CaptureContext.Provider>
                </div>
            )}
        </ScreenCapture>
    );
};

export const CaptureContext = React.createContext(null);

export default ScreenCaptureWrapper;
