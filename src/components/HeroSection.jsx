import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-container">
      <div className="mascot-container">
        <div className="geo-robot">
          <div className="robot-head">
            <div className="eye left"></div>
            <div className="eye right"></div>
            <div className="antenna"></div>
          </div>
          <div className="robot-body">
            <div className="screen-heart">❤️</div>
          </div>
          <div className="shadow"></div>
        </div>
      </div>
      <div className="hero-content">
        <h1 className="app-title">MindBloom 🌱</h1>
        <p className="tagline">Where Young Minds Grow Gently</p>
        <div className="mascot-greeting">Hi, I'm Geo! Ready for a super fun adventure today?</div>
        <div className="encouragement-badge">Let's Play & Learn! 🌟</div>
      </div>
    </section>
  );
};

export default HeroSection;
