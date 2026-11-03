import { useState } from 'react';
import vocabulary from '../data/vocabulary.json';

export default function EnglishPractice({ language }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const word = vocabulary[wordIndex];

  return (
    <div style={containerStyle()}>
      <div style={headerStyle()}>
        <h1 style={titleStyle()}>English Practice 📚</h1>
      </div>

      <div style={cardStyle()}>
        <div style={wordStyle()}>{word.word}</div>
        {showTranslation && (
          <div style={hindiStyle()}>
            {word.hindi} — {word.hindiSentence}
          </div>
        )}
        <div style={sentenceStyle()}>
          "{word.sentence}"
        </div>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          style={toggleButtonStyle()}
        >
          {showTranslation ? 'Hide Hindi' : 'Show Hindi'}
        </button>
      </div>

      <div style={navStyle()}>
        <button
          onClick={() => setWordIndex((i) => (i === 0 ? vocabulary.length - 1 : i - 1))}
          style={navButtonStyle()}
        >
          ← Previous
        </button>
        <span style={counterStyle()}>
          {wordIndex + 1} of {vocabulary.length}
        </span>
        <button
          onClick={() => setWordIndex((i) => (i === vocabulary.length - 1 ? 0 : i + 1))}
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

  function wordStyle() {
    return {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#26324A',
      marginBottom: '8px',
      fontFamily: "'Fredoka', sans-serif",
    };
  }

  function hindiStyle() {
    return {
      fontSize: '1.5rem',
      color: '#FF8E8E',
      marginBottom: '16px',
      fontWeight: '500',
    };
  }

  function sentenceStyle() {
    return {
      fontSize: '1.2rem',
      color: '#26324A',
      marginBottom: '20px',
      lineHeight: '1.5',
      fontStyle: 'italic',
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