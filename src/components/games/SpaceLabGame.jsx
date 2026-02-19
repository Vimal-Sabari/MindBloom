import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './SpaceLabGame.module.css';
import confetti from 'canvas-confetti';
import ScreenCaptureWrapper from '../ScreenCaptureWrapper';
import { useInteractionTracking } from '../../hooks/useInteractionTracking';

const SpaceLabGameContent = () => {
    const navigate = useNavigate();
    const { playSound } = useTheme();

    // Tracking Setup
    const [questionId, setQuestionId] = useState(1);
    const {
        trackHoverStart,
        trackHoverEnd,
        trackClick,
        markAttempt,
        triggerSnapshot
    } = useInteractionTracking({
        world: 'spacelab',
        level: 1,
        questionId
    });

    const [equation, setEquation] = useState({ left: 0, right: 0, operator: '+', answer: 0, missing: 'answer' });
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("Solve the equation to launch the rocket!");
    const [isAnimating, setIsAnimating] = useState(false);
    const [rocketState, setRocketState] = useState('');

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
        setRocketState('');
        setMessage("Solve the equation!");
        setQuestionId(prev => prev + 1); // Increment for tracking distinction

        const n1 = Math.floor(Math.random() * 10) + 1; // 1-10
        const n2 = Math.floor(Math.random() * 10) + 1; // 1-10
        const answer = n1 + n2;

        // Randomly decide if we hide the answer or one of the operands
        // For simplicity for kids, let's start with missing answer mostly
        const mode = Math.random() > 0.7 ? 'operand' : 'answer';

        if (mode === 'answer') {
            setEquation({ left: n1, right: n2, operator: '+', answer: answer, missing: 'answer' });
            setOptions(generateOptions(answer));
        } else {
            // Missing operand: ? + n2 = answer OR n1 + ? = answer
            if (Math.random() > 0.5) {
                setEquation({ left: '?', right: n2, operator: '+', answer: answer, missing: 'left', correct: n1 });
                setOptions(generateOptions(n1));
            } else {
                setEquation({ left: n1, right: '?', operator: '+', answer: answer, missing: 'right', correct: n2 });
                setOptions(generateOptions(n2));
            }
        }
    };

    const handleAnswer = (val) => {
        if (isAnimating) return;
        trackClick(`option-${val}`);

        let correctVal = 0;
        if (equation.missing === 'answer') correctVal = equation.answer;
        else correctVal = equation.correct;

        if (val === correctVal) {
            setIsAnimating(true);
            playSound('success');
            setMessage("Liftoff! 🚀");
            setRocketState('launch');
            setScore(prev => prev + 1);

            markAttempt(true);
            triggerSnapshot('success');

            // If missing operand, fill it in for visual feedback
            if (equation.missing === 'left') setEquation(prev => ({ ...prev, left: val }));
            if (equation.missing === 'right') setEquation(prev => ({ ...prev, right: val }));
            if (equation.missing === 'answer') setEquation(prev => ({ ...prev })); // Answer already shown in a way if we had a box for it, but here we don't.

            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#ef4444', '#ffffff']
            });
            setTimeout(startNewRound, 2500);
        } else {
            playSound('error');
            setMessage("System Malfunction! Try again.");
            markAttempt(false);
            triggerSnapshot('failure'); // Optional: capture failures too
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => {
                        trackClick('back-button');
                        navigate('/math-worlds');
                    }}
                    onMouseEnter={() => trackHoverStart('back-button')}
                    onMouseLeave={() => trackHoverEnd('back-button')}
                >
                    ⬅ Math Worlds
                </button>
                <div className={styles.scoreBoard}>
                    Score: {score} 🌟
                </div>
            </div>

            <h2 className={styles.instruction}>{message}</h2>

            <div className={styles.gameArea}>
                <div className={styles.equationContainer}>
                    <div className={`${styles.numberBox} ${styles.questionBox}`}>
                        {equation.left === '?' ? '?' : equation.left}
                    </div>

                    <div className={styles.symbol}>+</div>

                    <div className={`${styles.numberBox} ${styles.questionBox}`}>
                        {equation.right === '?' ? '?' : equation.right}
                    </div>

                    <div className={styles.symbol}>=</div>

                    <div className={`${styles.numberBox} ${equation.missing === 'answer' ? styles.questionMark : ''}`}>
                        {equation.missing === 'answer' ? '?' : equation.answer}
                    </div>
                </div>

                <div className={`${styles.rocket} ${styles[rocketState]}`}>🚀</div>

                <div className={styles.optionsGrid}>
                    {options.map((opt, i) => (
                        <button
                            key={i}
                            className={styles.optionBtn}
                            onClick={() => handleAnswer(opt)}
                            disabled={isAnimating}
                            onMouseEnter={() => trackHoverStart(`option-${opt}`)}
                            onMouseLeave={() => trackHoverEnd(`option-${opt}`)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SpaceLabGame = () => {
    return (
        <ScreenCaptureWrapper>
            <SpaceLabGameContent />
        </ScreenCaptureWrapper>
    );
};

export default SpaceLabGame;
