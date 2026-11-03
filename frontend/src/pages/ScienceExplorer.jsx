import { useState } from 'react';
import scienceFacts from '../data/science-facts.json';
import { recordActivity } from '../services/progress';

export default function ScienceExplorer({ language }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fact = scienceFacts[currentIndex];

  return (
    <div style={containerStyle()}>
      <div style={headerStyle()}>
        <h1 style={titleStyle()}>Science Explorer 🔬</h1>
      </div>

      <div style={cardStyle()}>
        <div style={topicStyle()}>{fact.topic}</div>
        <h2 style={factTitleStyle()}>{fact.title}</h2>
        <p style={factTextStyle()}>{fact.text}</p>
        {fact.question && (
          <p style={questionStyle()}>💬 {fact.question}</p>
        )}
      </div>

      <div style={navStyle()}>
        <button
          onClick={() => { recordActivity(fact.topic); setCurrentIndex((i) => (i === 0 ? scienceFacts.length - 1 : i - 1)); }}
          style={navButtonStyle()}
        >
          ← Previous
        </button>
        <span style={counterStyle()}>
          {currentIndex + 1} of {scienceFacts.length}
        </span>
        <button
          onClick={() => { recordActivity(fact.topic); setCurrentIndex((i) => (i === scienceFacts.length - 1 ? 0 : i + 1)); }}
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

  function topicStyle() {
    return {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#70C9FF',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '12px',
    };
  }

  function factTitleStyle() {
    return {
      margin: '0 0 16px 0',
      fontSize: '1.5rem',
      color: '#26324A',
      fontFamily: "'Fredoka', sans-serif",
    };
  }

  function factTextStyle() {
    return {
      margin: '0 0 16px 0',
      fontSize: '1.1rem',
      color: '#26324A',
      lineHeight: '1.6',
    };
  }

  function questionStyle() {
    return {
      margin: 0,
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
