import React, { useState, useEffect } from 'react';
import styles from './GameThree.module.css';
import { useTheme } from '../../context/ThemeContext';

const ITEMS = [
    { id: 1, content: '🐠', type: 'living', name: 'Fish' },
    { id: 2, content: '🦀', type: 'living', name: 'Crab' },
    { id: 3, content: '🐙', type: 'living', name: 'Octopus' },
    { id: 4, content: '🐬', type: 'living', name: 'Dolphin' },
    { id: 5, content: '🦈', type: 'living', name: 'Shark' },
    { id: 6, content: '👢', type: 'non-living', name: 'Boot' },
    { id: 7, content: '⚓', type: 'non-living', name: 'Anchor' },
    { id: 8, content: '🍾', type: 'non-living', name: 'Bottle' },
    { id: 9, content: '🗑️', type: 'non-living', name: 'Trash' },
    { id: 10, content: '💎', type: 'non-living', name: 'Gem' },
];

const GameThree = ({ onBack }) => {
    const { playSound } = useTheme();
    const [currentItem, setCurrentItem] = useState(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        spawnItem();
    }, []);

    const spawnItem = () => {
        const random = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        setCurrentItem({ ...random, key: Math.random() }); // Unique key to force re-render if needed
    };

    const handleSort = (zoneType) => {
        if (!currentItem) return;

        if (currentItem.type === zoneType) {
            playSound('success');
            setFeedback('🎉 Great Job!');
            setScore(s => s + 1);
            setTimeout(() => {
                setFeedback(null);
                spawnItem();
            }, 800);
        } else {
            playSound('error');
            setFeedback('🤔 Try Again');
            setTimeout(() => setFeedback(null), 800);
        }
    };

    return (
        <div className={styles.gameContainer}>
            <div className={styles.header}>
                <button onClick={onBack}>⬅️ Back</button>
                <span style={{ color: 'white', fontSize: '1.5rem' }}>Score: {score}</span>
                <div style={{ width: '60px' }}></div>
            </div>

            <div className={styles.playArea}>
                {/* Living Zone */}
                <div
                    className={`${styles.zone} ${styles.livingZone}`}
                    onClick={() => handleSort('living')}
                >
                    <div className={styles.zoneLabel}>Living Things</div>
                    <div className={styles.zoneIcon}>🌿</div>
                </div>

                {/* Non-Living Zone */}
                <div
                    className={`${styles.zone} ${styles.nonLivingZone}`}
                    onClick={() => handleSort('non-living')}
                >
                    <div className={styles.zoneLabel}>Non-Living Things</div>
                    <div className={styles.zoneIcon}>📦</div>
                </div>
            </div>

            {currentItem && (
                <div className={styles.itemContainer}>
                    <div className={styles.item}>
                        {currentItem.content}
                    </div>
                </div>
            )}

            {feedback && (
                <div className={styles.feedback}>
                    {feedback}
                </div>
            )}

            <div style={{
                position: 'absolute',
                bottom: '20px',
                width: '100%',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.7)',
                pointerEvents: 'none'
            }}>
                Tap the correct side!
            </div>
        </div>
    );
};

export default GameThree;
