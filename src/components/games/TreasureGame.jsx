import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './TreasureGame.module.css';
import confetti from 'canvas-confetti';

const TreasureGame = () => {
    const navigate = useNavigate();
    const { playSound } = useTheme();
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("How many coins are there in total?");
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        startNewRound();
    }, []);

    const generateOptions = (correctAnswer) => {
        const wrong1 = correctAnswer + Math.floor(Math.random() * 3) + 1;
        let wrong2 = correctAnswer - Math.floor(Math.random() * 3) - 1;
        if (wrong2 < 0) wrong2 = correctAnswer + 5;

        let wrong3 = correctAnswer + 10;

        const opts = [correctAnswer, wrong1, wrong2, wrong3];
        // Shuffle
        return opts.sort(() => Math.random() - 0.5);
    };

    const startNewRound = () => {
        setIsAnimating(false);
        setMessage("How many coins in total?");

        const n1 = Math.floor(Math.random() * 10) + 1; // 1-10
        const n2 = Math.floor(Math.random() * 10) + 1; // 1-10

        setNum1(n1);
        setNum2(n2);
        setOptions(generateOptions(n1 + n2));
    };

    const handleAnswer = (answer) => {
        if (isAnimating) return;
        setIsAnimating(true);

        if (answer === num1 + num2) {
            playSound('success');
            setMessage("Rich! You found the treasure! 💎");
            setScore(prev => prev + 10);
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#fbbf24', '#f59e0b', '#d97706']
            });
            setTimeout(startNewRound, 2000);
        } else {
            playSound('error');
            setMessage("Not quite! Count the coins carefully.");
            setTimeout(() => {
                setIsAnimating(false);
            }, 1500);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/math-worlds')}>
                    ⬅ Math Worlds
                </button>
                <div className={styles.scoreBoard}>
                    Gold: {score} 🪙
                </div>
            </div>

            <h2 className={styles.instruction}>{message}</h2>

            <div className={styles.gameArea}>
                <div className={styles.chestContainer}>
                    <div className={styles.chestWrapper}>
                        <div className={styles.chest}>📦</div>
                        <div className={styles.coinCount}>{num1} Coins</div>
                    </div>

                    <div className={styles.plusSign}>+</div>

                    <div className={styles.chestWrapper}>
                        <div className={styles.chest}>📦</div>
                        <div className={styles.coinCount}>{num2} Coins</div>
                    </div>
                </div>

                <div className={styles.optionsGrid}>
                    {options.map((opt, i) => (
                        <button
                            key={i}
                            className={styles.optionBtn}
                            onClick={() => handleAnswer(opt)}
                            disabled={isAnimating}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TreasureGame;
