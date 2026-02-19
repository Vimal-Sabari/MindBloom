import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './FarmGame.module.css';
import confetti from 'canvas-confetti';

const FarmGame = () => {
    const navigate = useNavigate();
    const { playSound } = useTheme();
    const [leftCount, setLeftCount] = useState(0);
    const [rightCount, setRightCount] = useState(0);
    const [leftAnimal, setLeftAnimal] = useState('🐄');
    const [rightAnimal, setRightAnimal] = useState('🐖');
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("Which side has more animals?");
    const [isAnimating, setIsAnimating] = useState(false);

    const ANIMALS = ['🐄', '🐖', '🐑', '🐓', '🦆', '🐐'];

    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        setIsAnimating(false);
        setMessage("Which side has more animals?");

        const left = Math.floor(Math.random() * 9) + 1;
        const right = Math.floor(Math.random() * 9) + 1;

        // Ensure they aren't equal too often
        if (left === right && Math.random() > 0.3) {
            setLeftCount(left + 1);
        } else {
            setLeftCount(left);
        }
        setRightCount(right);

        setLeftAnimal(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
        let nextRightAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        while (nextRightAnimal === leftAnimal) {
            nextRightAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        }
        setRightAnimal(nextRightAnimal);
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

        setIsAnimating(true);

        if (isCorrect) {
            playSound('success');
            setMessage("Correct! Great job! 🎉");
            setScore(prev => prev + 1);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#f59e0b', '#3b82f6']
            });
            setTimeout(startNewRound, 2000);
        } else {
            playSound('error');
            setMessage("Oops! Try counting again.");
            setTimeout(() => {
                setIsAnimating(false);
            }, 1000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/math-worlds')}>
                    ⬅ Math Worlds
                </button>
                <div className={styles.scoreBoard}>
                    Score: {score} 🌟
                </div>
            </div>

            <h2 className={styles.instruction}>{message}</h2>

            <div className={styles.gameArea}>
                <div className={styles.farmContainer}>
                    {/* Left Patch */}
                    <div className={styles.farmPatch}>
                        {Array.from({ length: leftCount }).map((_, i) => (
                            <span key={i} className={styles.animal} style={{ animationDelay: `${i * 0.1}s` }}>
                                {leftAnimal}
                            </span>
                        ))}
                    </div>

                    {/* Right Patch */}
                    <div className={styles.farmPatch}>
                        {Array.from({ length: rightCount }).map((_, i) => (
                            <span key={i} className={styles.animal} style={{ animationDelay: `${i * 0.1}s` }}>
                                {rightAnimal}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={styles.controls}>
                    <button className={styles.controlBtn} onClick={() => handleGuess('>')}>
                        Left has More
                    </button>
                    <button className={styles.controlBtn} onClick={() => handleGuess('=')}>
                        Equal
                    </button>
                    <button className={styles.controlBtn} onClick={() => handleGuess('<')}>
                        Right has More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FarmGame;
