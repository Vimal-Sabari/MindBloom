import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './MoonBalanceGame.module.css';
import confetti from 'canvas-confetti';

const MoonBalanceGame = () => {
    const navigate = useNavigate();
    const { playSound } = useTheme();
    const [leftCount, setLeftCount] = useState(0);
    const [rightCount, setRightCount] = useState(0);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("Which side has more?");
    const [scaleState, setScaleState] = useState('balanced'); // 'balanced', 'left-heavy', 'right-heavy'
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        setIsAnimating(false);
        setScaleState('balanced');
        setMessage("Which moon has more crystals?");

        // Generate numbers between 1 and 10
        const left = Math.floor(Math.random() * 10) + 1;
        const right = Math.floor(Math.random() * 10) + 1;

        // Ensure they aren't always equal, but sometimes are
        setLeftCount(left);
        setRightCount(right);
    };

    const handleGuess = (operator) => {
        if (isAnimating) return;

        let isCorrect = false;
        let correctOperator = '';

        if (leftCount > rightCount) {
            correctOperator = '>';
        } else if (leftCount < rightCount) {
            correctOperator = '<';
        } else {
            correctOperator = '=';
        }

        if (operator === correctOperator) {
            isCorrect = true;
        }

        // Animate the scale to the TRUTH regardless of guess
        setIsAnimating(true);
        if (leftCount > rightCount) setScaleState('left-heavy');
        else if (rightCount > leftCount) setScaleState('right-heavy');
        else setScaleState('balanced');

        if (isCorrect) {
            playSound('success'); // Assuming context has this, or fail silently
            setMessage("Correct! 🎉");
            setScore(prev => prev + 1);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#fbbf24', '#c084fc', '#38bdf8']
            });
            setTimeout(startNewRound, 2500);
        } else {
            playSound('error');
            setMessage("Not quite! Look closely at the scale...");
            setTimeout(() => {
                setIsAnimating(false);
                setScaleState('balanced'); // Reset to give another chance or just show the truth?
                // For learning, maybe better to keep showing the truth and start new round? 
                // Let's settle specifically on: Show truth -> New Round (no penalty, just no score inc?)
                // Or try again? Let's do try again for positive reinforcement but reset scale so they can guess again.
                setMessage("Try again! counting the crystals.");
            }, 2000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/')}>
                    ⬅ Menu
                </button>
                <div className={styles.scoreBoard}>
                    Score: {score} 🌟
                </div>
            </div>

            <h2 className={styles.instruction}>{message}</h2>

            <div className={styles.gameArea}>
                {/* Balance Scale */}
                <div className={styles.balanceContainer}>
                    <div className={`${styles.balanceBeam} ${styles[scaleState]}`}>
                        {/* Left Pan */}
                        <div className={styles.panContainerLeft}>
                            <div className={styles.string}></div>
                            <div className={styles.pan}>
                                <div className={styles.moon}>
                                    {Array.from({ length: leftCount }).map((_, i) => (
                                        <span key={i} className={styles.crystal}>💎</span>
                                    ))}
                                </div>
                                <div className={styles.countLabel}>{leftCount}</div>
                            </div>
                        </div>

                        {/* Right Pan */}
                        <div className={styles.panContainerRight}>
                            <div className={styles.string}></div>
                            <div className={styles.pan}>
                                <div className={styles.moon}>
                                    {Array.from({ length: rightCount }).map((_, i) => (
                                        <span key={i} className={styles.crystal}>💎</span>
                                    ))}
                                </div>
                                <div className={styles.countLabel}>{rightCount}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.balanceBase}></div>
                </div>

                {/* Controls */}
                <div className={styles.controls}>
                    <button
                        className={styles.controlBtn}
                        onClick={() => handleGuess('>')}
                        disabled={isAnimating}
                    >
                        Left is More
                        <span className={styles.btnIcon}>&gt;</span>
                    </button>
                    <button
                        className={styles.controlBtn}
                        onClick={() => handleGuess('=')}
                        disabled={isAnimating}
                    >
                        Equal
                        <span className={styles.btnIcon}>=</span>
                    </button>
                    <button
                        className={styles.controlBtn}
                        onClick={() => handleGuess('<')}
                        disabled={isAnimating}
                    >
                        Right is More
                        <span className={styles.btnIcon}>&lt;</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoonBalanceGame;
