import { useState } from 'react';
import riddles from '../data/riddles.json';

export default function BrainGym({ language }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const riddle = riddles[currentIndex];

  return (
    <div style={containerStyle()}>
      <div style={headerStyle()}>
        <h1 style={titleStyle()}>Brain Gym 🧩</h1>
      </div>

      <div style={cardStyle()}>
        <div style={riddleTextStyle()}>{riddle.question}</div>
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          style={toggleButtonStyle()}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        {showAnswer && (
          <>
            <div style={answerStyle()}>
              <strong>Answer:</strong> {riddle.answer}
            </div>
            <div style={hintStyle()}>
              <strong>Hint:</strong> {riddle.hint}
            </div>
          </>
        )}
      </div>

      <div style={navStyle()}>
        <button
          onClick={() => setCurrentIndex((i) => (i === 0 ? riddles.length - 1 : i - 1))}
          style={navButtonStyle()}
        >
          ← Previous
        </button>
        <span style={counterStyle()}>
          {currentIndex + 1} of {riddles.length}
        </span>
        <button
          onClick={() => setCurrentIndex((i) => (i === riddles.length - 1 ? 0 : i + 1))}
          style={navButtonStyle()}
        >
          Next →
        </button>
      </div>
    </div>
  );

  function containerStyle() {
    return {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '24px',
      background: 'linear-gradient(180deg, #FFF9EE 0%, #F3E8D3 100%)',
    };
  }

  function headerStyle() {
    return {
      marginBottom: '24px',
    };
  }

  function titleStyle() {
    return {
      margin: 0,
      fontSize: '2rem',
      color: '#26324A',
      fontFamily: "'Fredoka', 'Poppins', sans-serif",
    };
  }

  function cardStyle() {
    return {
      background: '#fff',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(38,50,74,0.12)',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center',
    };
  }

  function riddleTextStyle() {
    return {
      fontSize: '1.4rem',
      color: '#26324A',
      marginBottom: '24px',
      lineHeight: '1.6',
      fontWeight: '500',
    };
  }

  function toggleButtonStyle() {
    return {
      background: '#B7A4FF',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }

  function answerStyle() {
    return {
      marginTop: '16px',
      fontSize: '1.2rem',
      color: '#26324A',
      fontWeight: '600',
    };
  }

  function hintStyle() {
    return {
      marginTop: '8px',
      fontSize: '1rem',
      color: '#6B7280',
      fontStyle: 'italic',
    };
  }

  function navStyle() {
    return {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '600px',
      margin: '24px auto 0',
    };
  }

  function navButtonStyle() {
    return {
      background: '#fff',
      border: '2px solid #70C9FF',
      color: '#26324A',
      padding: '10px 20px',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }

  function counterStyle() {
    return {
      fontWeight: '600',
      color: '#26324A',
    };
  }
}