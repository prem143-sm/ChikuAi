import { useState } from 'react';
import { getProgress, resetProgress } from '../services/progress';

export default function Progress() {
  const progress = getProgress();

  const [resetConfirm, setResetConfirm] = useState(false);

  function handleReset() {
    if (resetConfirm) {
      resetProgress();
      window.location.reload();
    } else {
      setResetConfirm(true);
    }
  }

  const stats = [
    { value: progress.quizzesCompleted, label: 'Quizzes Completed' },
    { value: progress.correctAnswers, label: 'Correct Answers' },
    { value: progress.activitiesCompleted, label: 'Activities Done' },
    { value: progress.topicsExplored.length, label: 'Topics Explored' },
  ];

  return (
    <div style={containerStyle()}>
      <div style={headerStyle()}>
        <h1 style={titleStyle()}>My Progress 🏆</h1>
      </div>

      <div style={statsContainerStyle()}>
        {stats.map((stat, i) => (
          <div key={i} className="progress-stat">
            <span className="value">{stat.value}</span>
            <span className="label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div style={topicsStyle()}>
        <h3 style={topicsTitleStyle()}>Topics Explored</h3>
        {progress.topicsExplored.length === 0 ? (
          <p style={emptyTopicsStyle()}>
            No topics yet. Start exploring with StudIQ!
          </p>
        ) : (
          <div style={topicsListStyle()}>
            {progress.topicsExplored.map((topic, i) => (
              <span key={i} style={topicChipStyle()}>{topic}</span>
            ))}
          </div>
        )}
      </div>

      <div style={resetSectionStyle()}>
        <button onClick={handleReset} style={resetButtonStyle()}>
          {resetConfirm ? 'Click again to confirm reset' : 'Reset Progress'}
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

  function statsContainerStyle() {
    return {
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '32px',
    };
  }

  function topicsStyle() {
    return {
      background: '#fff',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(38,50,74,0.12)',
      maxWidth: '600px',
      margin: '0 auto',
    };
  }

  function topicsTitleStyle() {
    return {
      margin: '0 0 16px 0',
      fontSize: '1.25rem',
      color: '#26324A',
    };
  }

  function emptyTopicsStyle() {
    return {
      color: '#6B7280',
      fontSize: '1rem',
    };
  }

  function topicsListStyle() {
    return {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    };
  }

  function topicChipStyle() {
    return {
      background: '#E3F2FD',
      color: '#26324A',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
    };
  }

  function resetSectionStyle() {
    return {
      marginTop: '32px',
      textAlign: 'center',
    };
  }

  function resetButtonStyle() {
    return {
      background: resetConfirm ? '#FF8E8E' : '#f0f0f0',
      color: resetConfirm ? '#fff' : '#6B7280',
      border: 'none',
      padding: '12px 28px',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }
}
