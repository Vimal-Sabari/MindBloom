import React, { Component } from 'react';
import styles from './Assessment.module.css';

/**
 * Concept: Class Component
 * This demonstrates the traditional way of defining components in React.
 * It uses 'this.state' and potentially life-cycle methods.
 */
class AssessmentResult extends Component {
    constructor(props) {
        super(props);
        const { results } = props;
        this.state = {
            score: results.score,
            review: results.review,
            encouragement: this.getEncouragement(results.score)
        };
    }

    getEncouragement(score) {
        if (score === 10) return "Legendary Performance! 👑";
        if (score >= 8) return "Superstar Status! 🌟";
        if (score >= 6) return "Great Adventure! 🚀";
        return "Amazing Effort! ❤️";
    }

    render() {
        const { onRestart } = this.props;
        const { score, review, encouragement } = this.state;

        return (
            <div className={styles.celebrationScreen}>
                <section className={styles.topCeremony}>
                    <div className={styles.starDisplay}>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <span key={i} className={i < score ? styles.starFilled : styles.starEmpty}>
                                ⭐
                            </span>
                        ))}
                    </div>
                    <h1 className={styles.celebrationTitle}>{encouragement}</h1>
                    <p className={styles.finalScore}>You discovered {score} out of 10 stars!</p>
                </section>

                <section className={styles.reviewSection}>
                    <h2 className={styles.reviewHeading}>Your Adventure Journey</h2>
                    <div className={styles.reviewGrid}>
                        {review.map((item, index) => (
                            <div key={item.id} className={`${styles.reviewCard} ${item.isCorrect ? styles.correctCard : styles.incorrectCard}`}>
                                <div className={styles.reviewHeader}>
                                    <span className={styles.reviewNumber}>#{index + 1}</span>
                                    <span className={styles.reviewStatus}>{item.isCorrect ? '✨ Perfect!' : '🩹 Almost!'}</span>
                                </div>
                                <p className={styles.reviewText}>{item.text}</p>
                                <div className={styles.answerComparison}>
                                    <p><strong>Your Answer:</strong> {item.userAnswer}</p>
                                    {!item.isCorrect && (
                                        <p className={styles.correctHighlight}><strong>Correct:</strong> {item.answer}</p>
                                    )}
                                </div>
                                <div className={styles.explanationBox}>
                                    <strong>Why?</strong>
                                    <p>{item.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className={styles.resultFooter}>
                    <button className={styles.restartBtn} onClick={onRestart}>
                        Try a New Quest! 🔄
                    </button>
                </footer>
            </div>
        );
    }
}

export default AssessmentResult;
