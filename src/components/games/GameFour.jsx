import React, { useState, useEffect } from 'react';
import styles from './GameFour.module.css';
import { useTheme } from '../../context/ThemeContext';

// Define the Giraffe
const GIRAFFE_PARTS = [
    { id: 'body', type: 'oval', width: 120, height: 80, x: -20, y: 50, color: '#f1c40f', name: 'Body' },
    { id: 'neck', type: 'rect', width: 40, height: 120, x: 20, y: -50, color: '#f39c12', name: 'Neck' },
    { id: 'head', type: 'circle', width: 60, height: 60, x: 10, y: -100, color: '#e67e22', name: 'Head' },
    { id: 'leg1', type: 'rect', width: 15, height: 80, x: -40, y: 100, color: '#d35400', name: 'Leg' },
    { id: 'leg2', type: 'rect', width: 15, height: 80, x: 0, y: 100, color: '#d35400', name: 'Leg' },
];

const GameFour = ({ onBack }) => {
    const { playSound } = useTheme();
    const [placedParts, setPlacedParts] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    const handlePieceClick = (pieceId) => {
        if (placedParts.includes(pieceId)) return;
        setSelectedPiece(pieceId === selectedPiece ? null : pieceId);
        playSound('click'); // Generic click
    };

    const handleTargetClick = (targetId) => {
        if (!selectedPiece) return;

        // Check match (Simple ID match for now, could be type based)
        // To make it easier/more fun, let's say if the TYPES vary (e.g. circle vs rect), enforce strictness. 
        // If multiple legs, any leg piece fits any leg slot?
        // For simplicity: Strict ID match in this basic version, or Type match.
        // Let's do Type match for better UX.

        const targetPart = GIRAFFE_PARTS.find(p => p.id === targetId);
        const selectedPart = GIRAFFE_PARTS.find(p => p.id === selectedPiece);

        if (targetPart.type === selectedPart.type) {
            // Allow general match if "Leg" etc
            if (placedParts.includes(targetId)) return; // Already filled

            playSound('success');
            setPlacedParts(prev => [...prev, targetId]);
            setSelectedPiece(null);

            // Check win
            if (placedParts.length + 1 === GIRAFFE_PARTS.length) {
                setIsComplete(true);
                playSound('celebration');
            }
        } else {
            playSound('error');
        }
    };

    // Filter out parts that are already placed from the sidebar
    // But wait, if we have 2 legs, we need 2 leg pieces available.
    // Simplification: The sidebar shows the *Specific* pieces needed.
    const availablePieces = GIRAFFE_PARTS.filter(p => !placedParts.includes(p.id));

    return (
        <div className={styles.gameContainer}>
            <div className={styles.header}>
                <button onClick={onBack} style={{ background: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '1.2rem' }}>⬅️ Back</button>
                <h2>Shape Safari Builder</h2>
                <div style={{ width: '80px' }}></div>
            </div>

            <div className={styles.playArea}>
                {/* Silhouette Area */}
                <div className={styles.silhouetteArea}>
                    <div style={{ position: 'relative', width: '300px', height: '400px' }} className={isComplete ? styles.animalComplete : ''}>
                        {GIRAFFE_PARTS.map(part => (
                            <div
                                key={part.id}
                                className={`${styles.target} ${styles[part.type]} ${placedParts.includes(part.id) ? styles.filled : ''}`}
                                style={{
                                    width: `${part.width}px`,
                                    height: `${part.height}px`,
                                    top: `calc(50% + ${part.y}px)`,
                                    left: `calc(50% + ${part.x}px)`,
                                    backgroundColor: placedParts.includes(part.id) ? part.color : undefined,
                                }}
                                onClick={() => handleTargetClick(part.id)}
                            >
                                {/* Optional Hint Icon? */}
                            </div>
                        ))}
                        {isComplete && <div style={{ position: 'absolute', top: '-50px', width: '100%', textAlign: 'center', fontSize: '3rem' }}>🦁 Roar!</div>}
                    </div>
                </div>

                {/* Sidebar Pieces */}
                <div className={styles.piecesArea}>
                    {!isComplete && availablePieces.map(part => (
                        <div
                            key={part.id}
                            className={`${styles.sidebarPiece} ${styles[part.type]} ${selectedPiece === part.id ? styles.selected : ''}`}
                            style={{
                                width: `${part.width}px`,
                                height: `${part.height}px`,
                                backgroundColor: part.color,
                                position: 'relative', /* Reset from absolute logic above */
                                margin: '10px'
                            }}
                            onClick={() => handlePieceClick(part.id)}
                        >
                        </div>
                    ))}
                    {isComplete && <div style={{ textAlign: 'center', width: '100%', fontSize: '1.5rem' }}>Great Job!</div>}
                </div>
            </div>
            <p style={{ textAlign: 'center', opacity: 0.7, paddingBottom: '1rem' }}>
                Tap a colored shape, then tap where it belongs on the animal!
            </p>
        </div>
    );
};

export default GameFour;
