import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MathWorlds.module.css';

const MATH_GAMES = [
    {
        id: 'moon',
        title: 'Moon World',
        icon: '🌕',
        color: '#8b5cf6', // Violet
        desc: 'Compare numbers on the mystery moon!',
        path: '/moon-balance'
    },
    {
        id: 'farm',
        title: 'Farm World',
        icon: '🍎',
        color: '#10b981', // Emerald
        desc: 'Compare quantities of farm animals!',
        path: '/math/farm'
    },
    {
        id: 'treasure',
        title: 'Treasure World',
        icon: '🪙',
        color: '#f59e0b', // Amber
        desc: 'Add up the gold coins!',
        path: '/math/treasure'
    },
    {
        id: 'spacelab',
        title: 'Space Lab',
        icon: '🚀',
        color: '#3b82f6', // Blue
        desc: 'Solve the equations to launch!',
        path: '/math/spacelab'
    }
];

const MathWorlds = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                🏠 Back to Home
            </button>

            <h1 className={styles.title}>🌍 Math Worlds</h1>

            <div className={styles.grid}>
                {MATH_GAMES.map((game) => (
                    <Link
                        key={game.id}
                        to={game.path}
                        className={styles.card}
                    >
                        <div className={styles.iconWrapper} style={{ backgroundColor: game.color }}>
                            {game.icon}
                        </div>
                        <h2 className={styles.cardTitle}>{game.title}</h2>
                        <p className={styles.cardDesc}>{game.desc}</p>
                        <div className={styles.playBadge}>Play Now! ➔</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MathWorlds;
