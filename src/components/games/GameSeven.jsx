import React, { useState, useEffect, useRef } from 'react';
import styles from './GameSeven.module.css';
import { useTheme } from '../../context/ThemeContext';

const GameSeven = ({ onBack }) => {
    const { playSound } = useTheme();
    const [bugs, setBugs] = useState([]);
    const [score, setScore] = useState(0);
    const [effects, setEffects] = useState([]); // Visual pop effects

    const containerRef = useRef(null);
    const requestRef = useRef();
    const lastSpawnTime = useRef(0);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(requestRef.current);
    }, []); // Run on mount

    const gameLoop = (time) => {
        // 1. Check spawn (every 1.5 seconds approx)
        if (time - lastSpawnTime.current > 1500) {
            spawnBug();
            lastSpawnTime.current = time;
        }

        // 2. Move bugs (simple JS animation for control)
        setBugs(prevBugs => {
            return prevBugs
                .map(bug => ({
                    ...bug,
                    x: bug.x + bug.vx,
                    y: bug.y + bug.vy
                }))
                .filter(bug => {
                    // Remove if off screen
                    // Assuming screen size roughly, but better to check bounds if possible.
                    // For simplicity: remove if x > 110% or x < -10% etc.
                    return bug.x > -10 && bug.x < 110 && bug.y > -10 && bug.y < 110;
                });
        });

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const spawnBug = () => {
        const isFirefly = Math.random() > 0.3; // 70% Firefly
        const type = isFirefly ? 'firefly' : 'redBug';
        const side = Math.random() > 0.5 ? 'left' : 'right';

        // Position in %
        const startX = side === 'left' ? -10 : 110;
        const startY = Math.random() * 80 + 10; // 10-90% vertical

        // Velocity (slow drift)
        const speed = 0.1 + Math.random() * 0.1; // 0.1 - 0.2 % per frame
        const vx = side === 'left' ? speed : -speed;
        const vy = (Math.random() - 0.5) * 0.05; // slight vertical drift

        const newBug = {
            id: Date.now() + Math.random(),
            type,
            x: startX,
            y: startY,
            vx,
            vy,
            icon: isFirefly ? '✨' : '🐞'
        };

        setBugs(prev => [...prev, newBug]);
    };

    const handleBugClick = (e, bug) => {
        e.stopPropagation();

        if (bug.type === 'firefly') {
            playSound('success');
            setScore(s => s + 1);

            // Visual feedback
            const rect = e.target.getBoundingClientRect();
            addEffect(rect.left, rect.top, '+1');

            // Remove bug
            setBugs(prev => prev.filter(b => b.id !== bug.id));
        } else {
            playSound('error');
            // Wobble logic in CSS if we had persistent refs, but for now simple sound + effect
            const rect = e.target.getBoundingClientRect();
            addEffect(rect.left, rect.top, '❌');
        }
    };

    const addEffect = (x, y, text) => {
        const id = Date.now();
        setEffects(prev => [...prev, { id, x, y, text }]);
        setTimeout(() => {
            setEffects(prev => prev.filter(e => e.id !== id));
        }, 1000);
    };

    return (
        <div className={styles.gameContainer} ref={containerRef}>
            <div className={styles.hud}>
                <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '15px' }}>⬅️ Pause</button>
                <span>Caught: {score}</span>
            </div>

            {/* Decorative Stars */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={styles.star} style={{
                    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 2}px`, height: `${Math.random() * 3 + 2}px`,
                    animationDelay: `${Math.random() * 2}s`
                }} />
            ))}

            {/* Bugs */}
            {bugs.map(bug => (
                <div
                    key={bug.id}
                    className={`${styles.bug} ${bug.type === 'firefly' ? styles.firefly : styles.redBug}`}
                    style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
                    onMouseDown={(e) => handleBugClick(e, bug)}
                >
                    {bug.icon}
                </div>
            ))}

            {/* Effects */}
            {effects.map(effect => (
                <div key={effect.id} className={styles.catchAnim} style={{ left: effect.x, top: effect.y }}>
                    {effect.text}
                </div>
            ))}
        </div>
    );
};

export default GameSeven;
