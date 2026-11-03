import { useState } from 'react';
import stories from '../data/stories.json';

export default function StoryTime({ language }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const story = stories[currentIndex];

  return (
    <div style={containerStyle()}>
      <div style={headerStyle()}>
        <h1 style={titleStyle()}>Story Time 📖</h1>
      </div>

      <div style={cardStyle()}>
        <div style={storyTitleStyle()}>{story.title}</div>
        <div style={readingLevelStyle()}>
          Reading Level: {story.readingLevel}
        </div>
        <div style={storyTextStyle()}>{story.text}</div>
        {story.moral && (
          <div style={moralStyle()}>
            <strong>Moral:</strong> {story.moral}
          </div>
        )}
        {story.discussionQuestion && (
          <div style={discussionStyle()}>
            <strong>💬 Talk about it:</strong> {story.discussionQuestion}
          </div>
        )}
      </div>

      <div style={navStyle()}>
        <button
          onClick={() => setCurrentIndex((i) => (i === 0 ? stories.length - 1 : i - 1))}
          style={navButtonStyle()}
        >
          ← Previous
        </button>
        <span style={counterStyle()}>
          {currentIndex + 1} of {stories.length}
        </span>
        <button
          onClick={() => setCurrentIndex((i) => (i === stories.length - 1 ? 0 : i + 1))}
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
    };
  }

  function storyTitleStyle() {
    return {
      margin: '0 0 8px 0',
      fontSize: '1.75rem',
      color: '#26324A',
      fontFamily: "'Fredoka', sans-serif",
    };
  }

  function readingLevelStyle() {
    return {
      fontSize: '0.9rem',
      color: '#70C9FF',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '20px',
    };
  }

  function storyTextStyle() {
    return {
      fontSize: '1.15rem',
      color: '#26324A',
      lineHeight: '1.7',
      marginBottom: '20px',
      whiteSpace: 'pre-wrap',
    };
  }

  function moralStyle() {
    return {
      marginTop: '16px',
      padding: '12px',
      background: '#FFF9EE',
      borderRadius: '12px',
      color: '#26324A',
      fontSize: '1rem',
    };
  }

  function discussionStyle() {
    return {
      marginTop: '12px',
      padding: '12px',
      background: '#E3F2FD',
      borderRadius: '12px',
      color: '#26324A',
      fontSize: '1rem',
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