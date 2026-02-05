import React, { useState, useEffect } from 'react';
import styles from './GameSix.module.css';
import { useTheme } from '../../context/ThemeContext';

const GRID_SIZE = 5;

// Level Config (Starting simple)
const LEVEL_1 = {
    start: { x: 0, y: 0 },
    goal: { x: 4, y: 4 },
    walls: ['1,1', '1,2', '3,3', '2,4'] // "x,y" strings
};

const GameSix = ({ onBack }) => {
    const { playSound } = useTheme();
    const [robotPos, setRobotPos] = useState({ ...LEVEL_1.start });
    const [commands, setCommands] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const getCellContent = (x, y) => {
        const key = `${x},${y}`;
        if (x === robotPos.x && y === robotPos.y) return <span className={styles.robot}>🤖</span>;
        if (x === LEVEL_1.goal.x && y === LEVEL_1.goal.y) return <span className={styles.battery}>🔋</span>;
        if (LEVEL_1.walls.includes(key)) return null; // Wall style handled by class
        return null;
    };

    const getCellClass = (x, y) => {
        const key = `${x},${y}`;
        if (LEVEL_1.walls.includes(key)) return `${styles.cell} ${styles.wall}`;
        return styles.cell;
    };

    const addCommand = (direction) => {
        if (isRunning) return;
        if (commands.length < 10) {
            setCommands([...commands, direction]);
            playSound('click');
        }
    };

    const resetGame = () => {
        setRobotPos({ ...LEVEL_1.start });
        setCommands([]);
        setIsRunning(false);
        setFeedback(null);
    };

    const runSequence = async () => {
        if (commands.length === 0) return;
        setIsRunning(true);
        let currentPos = { ...LEVEL_1.start };
        setRobotPos(currentPos); // Ensure start

        for (let cmd of commands) {
            // Wait for step
            await new Promise(r => setTimeout(r, 600));

            let nextPos = { ...currentPos };
            if (cmd === 'UP') nextPos.y = Math.max(0, currentPos.y - 1);
            if (cmd === 'DOWN') nextPos.y = Math.min(GRID_SIZE - 1, currentPos.y + 1);
            if (cmd === 'LEFT') nextPos.x = Math.max(0, currentPos.x - 1);
            if (cmd === 'RIGHT') nextPos.x = Math.min(GRID_SIZE - 1, currentPos.x + 1);

            // Check collisions
            const key = `${nextPos.x},${nextPos.y}`;
            if (LEVEL_1.walls.includes(key)) {
                playSound('error');
                setFeedback('💥 Ouch! Wall!');
                setIsRunning(false);
                return;
            }

            currentPos = nextPos;
            setRobotPos(currentPos);
            playSound('step');

            // Check Win during move (or at end?)
            if (currentPos.x === LEVEL_1.goal.x && currentPos.y === LEVEL_1.goal.y) {
                playSound('success');
                setFeedback('⚡ Battery Charged!');
                setIsRunning(false);
                return;
            }
        }

        setIsRunning(false);
        if (currentPos.x !== LEVEL_1.goal.x || currentPos.y !== LEVEL_1.goal.y) {
            setFeedback('End of path. Try again?');
        }
    };

    const renderArrow = (cmd) => {
        const map = { UP: '⬆️', DOWN: '⬇️', LEFT: '⬅️', RIGHT: '➡️' };
        return map[cmd];
    };

    return (
        <div className={styles.gameContainer}>
            <div className={styles.header}>
                <button onClick={onBack} className={styles.btnReset} style={{ width: 'auto', padding: '0 20px' }}>⬅️ Back</button>
                <h2>Robot Directions</h2>
                <div style={{ width: '60px' }}></div>
            </div>

            <div className={styles.mainArea}>
                <div className={styles.grid}>
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                        const x = i % GRID_SIZE;
                        const y = Math.floor(i / GRID_SIZE);
                        return (
                            <div key={i} className={getCellClass(x, y)}>
                                {getCellContent(x, y)}
                            </div>
                        );
                    })}
                </div>

                <div className={styles.controlsArea}>
                    <div className={styles.commandDisplay}>
                        {commands.map((cmd, i) => (
                            <div key={i} className={styles.commandIcon}>{renderArrow(cmd)}</div>
                        ))}
                        {commands.length === 0 && <span style={{ opacity: 0.5 }}>Add commands...</span>}
                    </div>

                    <div className={styles.controlPad}>
                        <div style={{ gridColumn: '2' }}>
                            <button disabled={isRunning} onClick={() => addCommand('UP')} className={styles.btn}>⬆️</button>
                        </div>

                        <div style={{ gridColumn: '1', gridRow: '2' }}>
                            <button disabled={isRunning} onClick={() => addCommand('LEFT')} className={styles.btn}>⬅️</button>
                        </div>
                        <div style={{ gridColumn: '3', gridRow: '2' }}>
                            <button disabled={isRunning} onClick={() => addCommand('RIGHT')} className={styles.btn}>➡️</button>
                        </div>

                        <div style={{ gridColumn: '2', gridRow: '3' }}>
                            <button disabled={isRunning} onClick={() => addCommand('DOWN')} className={styles.btn}>⬇️</button>
                        </div>

                        <div style={{ gridColumn: 'span 3', marginTop: '1rem', width: '100%' }}>
                            <button
                                onClick={runSequence}
                                disabled={isRunning || commands.length === 0}
                                className={`${styles.btn} ${styles.btnGo}`}
                            >
                                GO 🟢
                            </button>
                        </div>

                        <div style={{ gridColumn: 'span 3', width: '100%' }}>
                            <button onClick={resetGame} className={`${styles.btn} ${styles.btnReset}`}>
                                Reset 🔄
                            </button>
                        </div>
                    </div>

                    {feedback && <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '1rem' }}>{feedback}</div>}
                </div>
            </div>
        </div>
    );
};

export default GameSix;
