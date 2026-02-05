import React from 'react';
import styles from './Assessment.module.css';

/**
 * Concept: Stateless Component (Pure Component)
 * This component only renders UI based on props.
 * It does not maintain its own state or lifecycle.
 */
const QuestionDisplay = ({ question, onSelect, selectedValue }) => {
    return (
        <div className={styles.questionCard}>
            <h3 className={styles.questionTitle}>Question {question.id}</h3>
            <p className={styles.questionText}>{question.text}</p>

            <div className={styles.answerArea}>
                {question.type === 'choice' ? (
                    <div className={styles.optionsGrid}>
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`${styles.optionBtn} ${selectedValue === option ? styles.selected : ''}`}
                                onClick={() => onSelect(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className={styles.textInputWrapper}>
                        <input
                            type="text"
                            className={styles.textInput}
                            placeholder="Type your answer here..."
                            value={selectedValue || ''}
                            onChange={(e) => onSelect(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionDisplay;
