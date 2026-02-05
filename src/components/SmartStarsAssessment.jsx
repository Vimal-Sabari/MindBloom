import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionDisplay from './QuestionDisplay';
import AssessmentResult from './AssessmentResult';
import styles from './Assessment.module.css';

const QUESTION_POOL = [
    // Logic & Patterns
    { id: 1, type: 'choice', text: "What comes next? 🟦 🔴 🟦 🔴", options: ["🔴", "🟦", "🟢"], answer: "🟦", explanation: "This is an A-B pattern. Blue always comes after Red!" },
    { id: 2, type: 'choice', text: "Which shape is different? ⭕ ⭕ ⬛ ⭕", options: ["⭕", "⬛"], answer: "⬛", explanation: "The Square has 4 corners, but the Circles are round!" },
    { id: 3, type: 'choice', text: "Finish the line: 1, 2, 3, 4, ...", options: ["5", "6", "0"], answer: "5", explanation: "We are counting up by 1. After 4 comes 5!" },

    // Animals & Sounds
    { id: 4, type: 'text', text: "What animal says 'Moo'?", answer: "cow", explanation: "Cows live on farms and say Moo!" },
    { id: 5, type: 'text', text: "What animal has a long trunk?", answer: "elephant", explanation: "Elephants use their long trunks to drink and spray water!" },
    { id: 6, type: 'choice', text: "Which one lives in the ocean?", options: ["🦁", "🐠", "🐦"], answer: "🐠", explanation: "Fish (🐠) have gills to breathe underwater!" },
    { id: 7, type: 'text', text: "What animal says 'Meow'?", answer: "cat", explanation: "Cats are furry friends that love to say Meow!" },

    // General Knowledge & Vocabulary
    { id: 8, type: 'choice', text: "What color is the sun?", options: ["Blue", "Yellow", "Pink"], answer: "Yellow", explanation: "The sun is a big, bright yellow star!" },
    { id: 9, type: 'text', text: "What do you wear on your feet?", answer: "shoes", explanation: "Shoes or socks keep our feet safe when we walk!" },
    { id: 10, type: 'choice', text: "Which one do you eat with?", options: ["✏️", "🥣", "🚗"], answer: "🥣", explanation: "We use a bowl and spoon to eat our yummy food!" },

    // Math & Numbers
    { id: 11, type: 'text', text: "What is 1 + 1?", answer: "2", explanation: "If you have one apple and get one more, you have two!" },
    { id: 12, type: 'text', text: "What is 2 + 2?", answer: "4", explanation: "Two plus two makes four!" },
    { id: 13, type: 'choice', text: "How many fingers do you have on one hand?", options: ["4", "5", "10"], answer: "5", explanation: "Count them: 1, 2, 3, 4, 5!" },

    // Emotions & Social
    { id: 14, type: 'choice', text: "Which face is happy?", options: ["🙂", "😢", "😠"], answer: "🙂", explanation: "A big smile means someone is feeling happy!" },
    { id: 15, type: 'text', text: "What do you say when you get a gift?", answer: "thank you", explanation: "It's polite to say 'Thank you' when someone is kind to you!" },
    { id: 16, type: 'choice', text: "If a friend is sad, what can you do?", options: ["Hug", "Run", "Shout"], answer: "Hug", explanation: "Giving a hug or a kind word helps a sad friend feel better!" },

    // Colors & Shapes
    { id: 17, type: 'choice', text: "What color is grass?", options: ["Red", "Green", "Blue"], answer: "Green", explanation: "Most grass and leaves are a beautiful green!" },
    { id: 18, type: 'choice', text: "Which shape has 3 sides?", options: ["Square", "Circle", "Triangle"], answer: "Triangle", explanation: "Tri-angle means three corners/sides!" },
    { id: 19, type: 'text', text: "What color is a banana?", answer: "yellow", explanation: "Bananas are yellow when they are ready to eat!" },

    // Objects & Functions
    { id: 20, type: 'choice', text: "Which one flies in the sky?", options: ["🚲", "🚢", "✈️"], answer: "✈️", explanation: "Aeroplanes have wings to fly high in the clouds!" },
    { id: 21, type: 'text', text: "Where do you sleep?", answer: "bed", explanation: "We sleep in a cozy bed at night!" },
    { id: 22, type: 'text', text: "What do you use to brush your teeth?", answer: "toothbrush", explanation: "A toothbrush keeps our teeth clean and shiny!" },

    // Memory & Observation
    { id: 23, type: 'choice', text: "Did you see a 🐱 or a 🐶 in the garden?", options: ["🐱", "🐶"], answer: "any", explanation: "Both can be in the garden! You are a great observer!" },
    { id: 24, type: 'choice', text: "Which fruit is red?", options: ["Apple", "Banana", "Grape"], answer: "Apple", explanation: "Apples are often red and very crunchy!" },
    { id: 25, type: 'text', text: "What is the name of our planet?", answer: "earth", explanation: "We live on the beautiful blue planet Earth!" },

    // Advanced Logic
    { id: 26, type: 'choice', text: "Heavy vs Light: Which is heavier?", options: ["Feather", "Brick"], answer: "Brick", explanation: "A brick is made of stone and is much heavier than a feather!" },
    { id: 27, type: 'choice', text: "Day vs Night: What do we see at night?", options: ["Sun", "Moon"], answer: "Moon", explanation: "The moon and stars come out when it is dark!" },
    { id: 28, type: 'text', text: "What is the opposite of HOT?", answer: "cold", explanation: "Ice is cold, but fire is hot!" },
    { id: 29, type: 'text', text: "What is used to keep us dry in rain?", answer: "umbrella", explanation: "An umbrella or raincoat keeps the water off!" },
    { id: 30, type: 'choice', text: "Which one belongs in the fridge?", options: ["Book", "Milk", "Shoe"], answer: "Milk", explanation: "Milk needs to stay cold to be fresh!" }
];

const SmartStarsAssessment = () => {
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [results, setResults] = useState(null);
    const navigate = useNavigate();

    // Concept: Logic - Selective Randomization
    useEffect(() => {
        const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
        setSelectedQuestions(shuffled.slice(0, 10)); // Pick 10 random questions
    }, []);

    const handleUpdateResponse = (id, value) => {
        setResponses(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalScore = 0;
        const finalResults = selectedQuestions.map(q => {
            const userAns = (responses[q.id] || "").toString().toLowerCase().trim();
            const correctAns = q.answer.toString().toLowerCase().trim();
            const isCorrect = q.answer === 'any' || userAns === correctAns;

            if (isCorrect) finalScore += 1;

            return {
                ...q,
                userAnswer: responses[q.id] || "No answer",
                isCorrect
            };
        });

        setResults({ score: finalScore, review: finalResults });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (results) {
        return <AssessmentResult results={results} onRestart={() => navigate('/')} />;
    }

    if (selectedQuestions.length === 0) return <div className={styles.loader}>Shuffling stars... ✨</div>;

    return (
        <div className={styles.assessmentContainer}>
            <header className={styles.header}>
                <button onClick={() => navigate('/')} className={styles.backBtn}>🏠 Home</button>
                <h2 className={styles.title}>Super Stars Quest! 🚀</h2>
            </header>

            <div className={styles.introBox}>
                <p>A new set of 10 special questions has been picked just for you!</p>
                <p className={styles.smallNote}>Take your time, there's no rush! ✨</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.singlePageForm}>
                {selectedQuestions.map((q, index) => (
                    <QuestionDisplay
                        key={q.id}
                        question={{ ...q, id: index + 1 }} // Display 1 to 10
                        selectedValue={responses[q.id]}
                        onSelect={(val) => handleUpdateResponse(q.id, val)}
                    />
                ))}

                <div className={styles.formFooter}>
                    <p className={styles.reminderText}>Finish your quest to see your stars! 🌈</p>
                    <button type="submit" className={styles.finishBtn}>
                        Reveal My Stars! 🎉
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SmartStarsAssessment;
