import React, { useState, useEffect } from 'react';
import styles from './GameOne.module.css';
import { useTheme } from '../../context/ThemeContext';

const ICONS = ['🌍', '🪐', '👾', '🚀', '⭐', '🌙'];

const GameOne = ({ onBack }) => {
    const { playSound } = useTheme();
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        // Create pairs
        const pairs = [...ICONS, ...ICONS];
        // Shuffle
        const shuffled = pairs
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({
                id: index,
                content: icon,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(shuffled);
        setFlippedCards([]);
        setMatchedPairs(0);
    };

    const handleCardClick = (id) => {
        if (isProcessing) return;

        const clickedCard = cards.find(c => c.id === id);
        if (clickedCard.isFlipped || clickedCard.isMatched) return;

        // Flip the card
        const newCards = cards.map(c =>
            c.id === id ? { ...c, isFlipped: true } : c
        );
        setCards(newCards);

        const newFlipped = [...flippedCards, clickedCard];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setIsProcessing(true);
            checkMatch(newFlipped, newCards);
        }
    };

    const checkMatch = (currentFlipped, currentCards) => {
        const [card1, card2] = currentFlipped;

        if (card1.content === card2.content) {
            playSound('success');
            // Match found
            setTimeout(() => {
                setCards(prev => prev.map(c =>
                    c.content === card1.content ? { ...c, isMatched: true } : c
                ));
                setFlippedCards([]);
                setIsProcessing(false);
                setMatchedPairs(prev => prev + 1);
            }, 500);
        } else {
            playSound('error'); // Gentle wobble sound
            // No match
            setTimeout(() => {
                setCards(prev => prev.map(c =>
                    (c.id === card1.id || c.id === card2.id) ? { ...c, isFlipped: false } : c
                ));
                setFlippedCards([]);
                setIsProcessing(false);
            }, 1500); // giving time to see
        }
    };

    const isWin = matchedPairs === ICONS.length;

    return (
        <div className={styles.gameContainer}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onBack} style={{ fontSize: '1.5rem', background: 'transparent' }}>⬅️ Back</button>
                <h2 className={styles.title}>Cosmic Memory Match</h2>
                <div style={{ width: '60px' }}></div> {/* Spacer */}
            </div>

            {isWin ? (
                <div style={{ textAlign: 'center', animation: 'pop 0.5s ease' }}>
                    <h1>🎉 YOU WON! 🎉</h1>
                    <button
                        onClick={initializeGame}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.5rem',
                            background: 'var(--accent-gold)',
                            borderRadius: '20px',
                            color: 'var(--bg-deep-space)',
                            marginTop: '1rem'
                        }}
                    >
                        Play Again!
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className={`${styles.cardContainer} ${card.isFlipped ? styles.flipped : ''} ${card.isMatched ? styles.matched : ''}`}
                            onClick={() => handleCardClick(card.id)}
                        >
                            <div className={`${styles.cardFace} ${styles.cardBack}`}>
                                ★
                            </div>
                            <div className={`${styles.cardFace} ${styles.cardFront}`}>
                                {card.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GameOne;
