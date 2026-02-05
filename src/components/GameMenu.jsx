import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import HeroSection from './HeroSection';
import KidsInfoCard from './KidsInfoCard';
import styles from './GameMenu.module.css';

const GAMES = [
    {
        id: 1,
        title: 'Cosmic Memory',
        icon: '🪐',
        color: 'var(--pastel-blue)',
        desc: 'Find all the matching space friends!'
    },
    {
        id: 2,
        title: 'Dino Patterns',
        icon: '🦕',
        color: 'var(--pastel-green)',
        desc: 'Help the dinos finish their pattern!'
    },
    {
        id: 3,
        title: 'Ocean Sorter',
        icon: '🐙',
        color: 'var(--pastel-pink)',
        desc: 'Sort the ocean treasures by color!'
    },
    {
        id: 4,
        title: 'Shape Safari',
        icon: '🦒',
        color: 'var(--pastel-yellow)',
        desc: 'Build amazing animal shapes!'
    },
    {
        id: 5,
        title: 'Emotion Garden',
        icon: '🌻',
        color: 'var(--pastel-green)',
        desc: 'Grow happy flowers in our garden!'
    },
    {
        id: 6,
        title: 'Robot Directions',
        icon: '🤖',
        color: 'var(--pastel-purple)',
        desc: 'Give Geo instructions to find the ball!'
    },
    {
        id: 7,
        title: 'Focus Fireflies',
        icon: '✨',
        color: 'var(--pastel-blue)',
        desc: 'Catch the glowing fireflies!'
    },
];

const GameMenu = ({ onSelectGame }) => {
    const { playSound } = useTheme();

    const handleHover = () => {
        // playSound('hover'); // Optional soft hover sound
    };

    return (
        <div className={styles.menuContainer}>
            <HeroSection />
            <KidsInfoCard />

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Ready for a Challenge? 🌟</h2>
            </div>

            <div className={styles.specialCardContainer}>
                <Link to="/assessment" className={`${styles.planetCard} ${styles.assessmentCard} glass-panel`}>
                    <div className={styles.iconWrapper} style={{ backgroundColor: 'var(--accent-gold)' }}>
                        <span className={styles.icon}>🌟</span>
                    </div>
                    <div className={styles.contentWrapper}>
                        <h3 className={styles.label}>Smart Stars Assessment</h3>
                        <p className={styles.description}>Show what you've learned and collect all 10 stars!</p>
                        <div className={styles.playBadge}>Start Challenge ➔</div>
                    </div>
                </Link>
            </div>

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Pick a Planet to Explore!</h2>
            </div>

            <div className={styles.galaxyGrid}>
                {GAMES.map((game) => (
                    <button
                        key={game.id}
                        className={`${styles.planetCard} glass-panel`}
                        onClick={() => onSelectGame(game.id)}
                        onMouseEnter={handleHover}
                        aria-label={`Play ${game.title}`}
                    >
                        <div className={styles.iconWrapper} style={{ backgroundColor: game.color }}>
                            <span className={styles.icon}>{game.icon}</span>
                        </div>
                        <div className={styles.contentWrapper}>
                            <h3 className={styles.label}>{game.title}</h3>
                            <p className={styles.description}>{game.desc}</p>
                            <div className={styles.playBadge}>Play Now! ➔</div>
                        </div>
                    </button>
                ))}
            </div>

            <footer className={styles.footer}>
                <p>Made with ❤️ for amazing kids</p>
            </footer>
        </div>
    );
};

export default GameMenu;
