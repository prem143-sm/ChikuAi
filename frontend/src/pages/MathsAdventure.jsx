import { useEffect, useState } from 'react';
import useGeneratedActivity from '../hooks/useGeneratedActivity';
import { recordActivity } from '../services/progress';

const DIFFICULTIES = ['easy', 'medium', 'challenging'];

export default function MathsAdventure({ language, grade, user }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [actionError, setActionError] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { item: question, loading, error, refresh } = useGeneratedActivity(
    'maths',
    grade,
    language,
    user,
    difficulty
  );

  useEffect(() => {
    setAnswer('');
    setFeedback('');
    setAnswered(false);
  }, [question]);

  async function checkAnswer() {
    if (!question || answered || answer.trim() === '') return;
    setAttempts((count) => count + 1);
    setAnswered(true);
    if (Number(answer) === Number(question.answer)) {
      setScore((count) => count + 1);
      setFeedback('Correct! Great work! 🎉');
      try {
        await recordActivity(question.topic, user, 'maths', grade, true);
      } catch (saveError) {
        setActionError(`Your progress could not be saved: ${saveError.message}`);
      }
    } else {
      setFeedback(`Not quite. The answer is ${question.answer}. ${question.explanation}`);
    }
  }

  function nextQuestion() {
    setAnswer('');
    setFeedback('');
    setActionError('');
    setAnswered(false);
    refresh();
  }

  return (
    <div className="page-shell activity-page" style={containerStyle()}>
      <div className="activity-header" style={headerStyle()}>
        <h1 style={titleStyle()}>Maths Adventure 🔢</h1>
        <p>Fresh Gemini practice for grade {grade}</p>
        <div style={levelSelectorStyle()}>
          {DIFFICULTIES.map((value) => (
            <button
              key={value}
              onClick={() => {
                setDifficulty(value);
                setAnswer('');
                setFeedback('');
                setAnswered(false);
              }}
              style={levelButtonStyle(difficulty === value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="activity-card" style={cardStyle()}>
        {loading && <p role="status">Creating a fresh maths question…</p>}
        {error && (
          <div role="alert">
            <p>{error}</p>
            <button onClick={refresh} style={checkButtonStyle()}>Try again</button>
          </div>
        )}
        {question && !loading && (
          <>
            <p style={topicStyle()}>{question.topic} · Grade {grade}</p>
            <div style={questionTextStyle()}>{question.question}</div>
            <input
              type="number"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') checkAnswer();
              }}
              placeholder="Your answer"
              aria-label="Your answer"
              style={inputStyle()}
              disabled={answered}
            />
            <div>
              <button onClick={checkAnswer} disabled={answered || !answer.trim()} style={checkButtonStyle()}>
                Check answer
              </button>
              {answered && (
                <button onClick={nextQuestion} style={nextButtonStyle()}>
                  Next question
                </button>
              )}
            </div>
            {feedback && <p role="status" style={feedbackStyle()}>{feedback}</p>}
          </>
        )}
        {actionError && <p role="alert" style={errorStyle()}>{actionError}</p>}
      </div>

      <div style={statsStyle()}>
        <div className="progress-stat">
          <span className="value">{score}</span>
          <span className="label">Correct Answers</span>
        </div>
        <div className="progress-stat">
          <span className="value">{attempts}</span>
          <span className="label">Attempts</span>
        </div>
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      color: '#6B7280',
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

  function levelSelectorStyle() {
    return { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' };
  }

  function levelButtonStyle(active) {
    return {
      padding: '8px 16px',
      borderRadius: '20px',
      border: active ? 'none' : '2px solid #70C9FF',
      background: active ? '#70C9FF' : '#fff',
      color: '#26324A',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }

  function cardStyle() {
    return {
      background: '#fff',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(38,50,74,0.12)',
      maxWidth: '600px',
      width: '100%',
      margin: '0 auto',
      textAlign: 'center',
      color: '#26324A',
    };
  }

  function topicStyle() {
    return { color: '#6B7280', fontWeight: 600 };
  }

  function questionTextStyle() {
    return {
      fontSize: '1.6rem',
      fontWeight: 700,
      margin: '16px 0 20px',
      fontFamily: "'Fredoka', sans-serif",
    };
  }

  function inputStyle() {
    return {
      padding: '12px',
      fontSize: '1.25rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      width: '140px',
      marginBottom: '16px',
      textAlign: 'center',
      fontFamily: 'inherit',
    };
  }

  function checkButtonStyle() {
    return {
      background: '#FFD95A',
      color: '#26324A',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }

  function nextButtonStyle() {
    return {
      ...checkButtonStyle(),
      background: '#70C9FF',
      marginLeft: '10px',
    };
  }

  function feedbackStyle() {
    return { marginTop: '16px', lineHeight: 1.5 };
  }

  function errorStyle() {
    return { color: '#9B2C2C', marginTop: '12px' };
  }

  function statsStyle() {
    return {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      marginTop: '24px',
      flexWrap: 'wrap',
    };
  }
}
