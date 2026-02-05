import React, { useState, useEffect } from 'react';
import styles from './GameFive.module.css';
import { useTheme } from '../../context/ThemeContext';

const EMOTIONS = [
    { id: 'happy', label: 'Happy', icon: '😀', color: '#ffeaa7' },
    { id: 'sad', label: 'Sad', icon: '😢', color: '#74b9ff' },
    { id: 'surprised', label: 'Surprised', icon: '😲', color: '#fab1a0' },
    { id: 'angry', label: 'Angry', icon: '😠', color: '#ff7675' },
];

const GameFive = ({ onBack }) => {
    const { playSound } = useTheme();
    const [targetEmotion, setTargetEmotion] = useState(null);
    const [options, setOptions] = useState([]);
    const [feedbackState, setFeedbackState] = useState(null); // { id: '...', type: 'success'/'error'}

    useEffect(() => {
        startRound();
    }, []);

    const startRound = () => {
        setFeedbackState(null);
        // Pick 3 random emotions
        const shuffled = [...EMOTIONS].sort(() => Math.random() - 0.5).slice(0, 3);
        setOptions(shuffled);
        // Pick one as target
        const target = shuffled[Math.floor(Math.random() * shuffled.length)];
        setTargetEmotion(target);

        // Announce? (Future accessibility: Text-to-Speech)
    };

    const handleFlowerClick = (emotion) => {
        if (feedbackState?.type === 'success') return; // Preventing clicking after win

        if (emotion.id === targetEmotion.id) {
            playSound('success');
            setFeedbackState({ id: emotion.id, type: 'success' });
            setTimeout(startRound, 2000);
        } else {
            playSound('error');
            setFeedbackState({ id: emotion.id, type: 'error' });
            setTimeout(() => setFeedbackState(null), 500);
        }
    };

    return (
        <div className={styles.gameContainer}>
            <div style={{ padding: '1rem', width: '100%', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
                <button onClick={onBack} style={{ background: 'white', borderRadius: '20px', padding: '0.5rem 1rem', border: 'none' }}>⬅️ Back</button>
            </div>

            <div className={styles.sky}>
                <div className={styles.sun}>☀️</div>
                {targetEmotion && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        color: '#2d3436',
                        fontWeight: 'bold',
                        textShadow: '2px 2px white'
                    }}>
                        Who is <span style={{ color: '#6c5ce7' }}>{targetEmotion.label}</span>?
                    </div>
                )}
            </div>

            <div className={styles.garden}>
                {options.map((emotion, idx) => {
                    const isInteracted = feedbackState?.id === emotion.id;
                    const isSuccess = isInteracted && feedbackState.type === 'success';
                    const isError = isInteracted && feedbackState.type === 'error';

                    return (
                        <div
                            key={emotion.id}
                            className={`${styles.flowerContainer} ${isSuccess ? styles.bloom : ''} ${isError ? styles.shake : ''}`}
                            onClick={() => handleFlowerClick(emotion)}
                        >
                            <div className={styles.flowerHead}>
                                {/* CSS Petals */}
                                <div className={styles.petals}>
                                    {[0, 60, 120, 180, 240, 300].map(deg => (
                                        <div
                                            key={deg}
                                            className={styles.petalShape}
                                            style={{
                                                transform: `rotate(${deg}deg) translate(50px)`,
                                                '--petal-color': emotion.color
                                            }}
                                        />
                                    ))}
                                </div>
                                {/* Face */}
                                <span style={{ zIndex: 2, fontSize: '3.5rem' }}>{emotion.icon}</span>
                            </div>
                            <div className={styles.stem}>
                                <div className={`${styles.leaf} ${styles.left}`}></div>
                                <div className={`${styles.leaf} ${styles.right}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.ground}></div>
        </div>
    );
};

export default GameFive;
