import React, { useState, useEffect } from 'react';
import './KidsInfoCard.css';

const FUN_FACTS = [
    { id: 1, icon: '🌈', text: "Did you know? Octopuses have three hearts! One, two, three!" },
    { id: 2, icon: '🐱', text: "Cats can make over 100 different sounds. Meow, purr, chirrup!" },
    { id: 3, icon: '🐘', text: "An elephant's trunk has over 40,000 muscles! It's very strong." },
    { id: 4, icon: '🐝', text: "Bees can dance to tell their friends where the flowers are!" },
    { id: 5, icon: '🦋', text: "Butterflies taste their food using their tiny feet!" },
    { id: 6, icon: '🐳', text: "The blue whale is the biggest animal to ever live on Earth!" },
    { id: 7, icon: '🐸', text: "Frogs don't need to drink water, they soak it in through their skin!" },
    { id: 8, icon: '🦉', text: "Owls' eyes are tubes, not balls! That's why they turn their heads." },
    { id: 9, icon: '🐄', text: "Cows can sleep standing up, but they only dream when lying down!" },
    { id: 10, icon: '🐴', text: "Seahorses eat almost all the time because they don't have stomachs!" },
    { id: 11, icon: '🐿️', text: "Squirrels plant trees by forgetting where they hide their nuts!" },
    { id: 12, icon: '🐷', text: "Pigs are very smart and can even learn to play simple games!" },
];

const KidsInfoCard = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % FUN_FACTS.length);
        }, 8000); // Rotate every 8 seconds
        return () => clearInterval(timer);
    }, []);

    const fact = FUN_FACTS[index];

    return (
        <div className="kids-info-wrapper">
            <div className="glass-panel fact-card">
                <div className="fact-icon-container">
                    <span className="fact-icon">{fact.icon}</span>
                </div>
                <div className="fact-content">
                    <span className="fact-label">Adventure Fact:</span>
                    <p className="fact-text">{fact.text}</p>
                </div>
            </div>
        </div>
    );
};

export default KidsInfoCard;
