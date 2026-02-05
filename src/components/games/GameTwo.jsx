import React, { useState, useEffect } from 'react';
import styles from './GameTwo.module.css';
import { useTheme } from '../../context/ThemeContext';

const DINOS = ['🦖', '🦕', '🐊', '🐢'];
const PATTERNS = [
    ['A', 'B', 'A', 'B', 'A', '?'],
    ['A', 'A', 'B', 'B', 'A', '?'],
    ['A', 'B', 'C', 'A', 'B', '?'],
];

const GameTwo = ({ onBack }) => {
    const { playSound } = useTheme();
    const [level, setLevel] = useState(0);
    const [trainState, setTrainState] = useState('entering'); // entering, stationary, leaving
    const [solution, setSolution] = useState(null);
    const [currentPattern, setCurrentPattern] = useState([]);
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'success' or 'error'

    useEffect(() => {
        startLevel(level);
    }, [level]);

    const startLevel = (lvl) => {
        setTrainState('entering');
        setFeedback(null);

        // Select pattern template (cycle through)
        const template = PATTERNS[lvl % PATTERNS.length];

        // Pick 3 random dinos for this level
        const levelDinos = [...DINOS].sort(() => Math.random() - 0.5).slice(0, 3);
        const map = { 'A': levelDinos[0], 'B': levelDinos[1], 'C': levelDinos[2] };

        const newPattern = template.map(char => {
            if (char === '?') return null;
            return map[char];
        });

        const answerChar = template[template.length - 1] === '?' ? template[template.length - 2 === 4 ? 3 : 0] : '🦖'; // Fallback logic, actually need smart logic

        // Determine correct answer based on pattern logic
        // Simple robust logic: re-derive from template
        let correctAnswer = '';
        const lastIndex = template.indexOf('?');
        // If pattern is ABABAB, ? at 5 is 'B'.
        // Logic: Look at the template character at that index if it wasn't ?.
        // Or just manually map:
        // ABABA? -> B
        // AABBA? -> A
        // ABCAB? -> C
        // Let's hardcode the solution derivation for simplicity of these 3 patterns
        if (template[0] === 'A' && template[1] === 'B' && template[2] === 'A') correctAnswer = map['B'];
        if (template[0] === 'A' && template[1] === 'A') correctAnswer = map['A'];
        if (template[2] === 'C') correctAnswer = map['C'];

        setSolution(correctAnswer);
        setCurrentPattern(newPattern);

        // Options: Correct answer + 2 random others
        const wrongOptions = DINOS.filter(d => d !== correctAnswer).slice(0, 2);
        setOptions([correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5));

        setTimeout(() => setTrainState('stationary'), 1000);
    };

    const handleSelectOption = (selectedDino) => {
        if (trainState !== 'stationary') return;

        if (selectedDino === solution) {
            // Success
            playSound('success');
            setFeedback('success');

            // Fill the slot
            const filledPattern = [...currentPattern];
            filledPattern[filledPattern.length - 1] = solution;
            setCurrentPattern(filledPattern);

            setTimeout(() => {
                setTrainState('leaving');
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                }, 1000);
            }, 1000);
        } else {
            // Error
            playSound('error');
            setFeedback('error');
            setTimeout(() => setFeedback(null), 500);
        }
    };

    return (
        <div className={styles.gameContainer}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onBack} style={{ fontSize: '1.5rem', background: 'transparent' }}>⬅️ Back</button>
                <h2 className={styles.title}>Dino Pattern Train</h2>
                <div style={{ width: '60px' }}></div>
            </div>

            <div className={styles.trainTrack}>
                <div className={`${styles.train} ${trainState === 'entering' ? styles.driveIn : ''} ${trainState === 'leaving' ? styles.driveOut : ''}`}>
                    <div className={`${styles.car} ${styles.engine}`}>🚂</div>
                    {currentPattern.map((item, index) => (
                        <div key={index} className={`${styles.car} ${item === null ? styles.emptySlot : ''}`}>
                            <span className={styles.content}>
                                {item === null ? '?' : item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.optionsPool}>
                {trainState === 'stationary' && options.map((dino, idx) => (
                    <div
                        key={idx}
                        className={styles.draggable}
                        onClick={() => handleSelectOption(dino)}
                        style={feedback === 'error' ? { animation: 'shake 0.5s' } : {}}
                    >
                        {dino}
                    </div>
                ))}
            </div>

            <p style={{ marginTop: '2rem', opacity: 0.8 }}>Click the correct Dino to complete the train!</p>
        </div>
    );
};

export default GameTwo;
