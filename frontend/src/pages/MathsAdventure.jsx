import { useEffect, useState } from 'react';
import { recordActivity } from '../services/progress';

const LEVELS = {
  easy: { name: 'Easy', max: 10 },
  medium: { name: 'Medium', max: 20 },
  challenging: { name: 'Challenging', max: 50 },
};

export default function MathsAdventure({ language }) {
  const [level, setLevel] = useState('easy');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  function generateQuestion() {
    const max = LEVELS[level].max;
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let correct;
    let text;
    if (op === '+') {
      correct = a + b;
      text = `${a} + ${b} = ?`;
    } else if (op === '-') {
      const bigger = Math.max(a, b);
      const smaller = Math.min(a, b);
      correct = bigger - smaller;
      text = `${bigger} - ${smaller} = ?`;
    } else {
      correct = (a % 10) * (b % 10);
      text = `${a % 10} × ${b % 10} = ?`;
    }

    setQuestion({ text, correct });
    setAnswer('');
    setFeedbackState('');
  }

  function checkAnswer() {
    if (!question) return;
    const num = parseInt(answer, 10);
    setAttempts((prev) => prev + 1);
    if (num === question.correct) {
      setScore((prev) => prev + 1);
      recordActivity('Maths');
      setFeedback("Correct! Great job! 🎉");
      setTimeout(generateQuestion, 1500);
    } else {
      setFeedback(
        `Not quite! The answer is ${question.correct}. Let's try again!`
      );
    }
  }

  useEffect(() => {
    generateQuestion();
  }, [level]);

  return (
    <div style={containerStyle()}>
      <div style={headerStyle()}>
        <h1 style={titleStyle()}>Maths Adventure 🔢</h1>
        <div style={levelSelectorStyle()}>
          {Object.entries(LEVELS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setLevel(key)}
              style={levelButtonStyle(level === key)}
            >
              {val.name}
            </button>
          ))}
        </div>
      </div>

      <div style={cardStyle()}>
        {question && (
          <>
            <div style={questionTextStyle()}>{question.text}</div>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
              style={inputStyle()}
            />
            <button onClick={checkAnswer} style={checkButtonStyle()}>
              Check Answer
            </button>
            {feedback && <p style={feedbackStyle()}>{feedback}</p>}
          </>
        )}
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
      gap: '12px',
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

  function levelSelectorStyle() {
    return {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    };
  }

  function levelButtonStyle(active) {
    return {
      padding: '8px 16px',
      borderRadius: '20px',
      border: active ? 'none' : '2px solid #70C9FF',
      background: active ? '#70C9FF' : '#fff',
      color: active ? '#fff' : '#26324A',
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
      maxWidth: '500px',
      margin: '0 auto',
      textAlign: 'center',
    };
  }

  function questionTextStyle() {
    return {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#26324A',
      marginBottom: '20px',
      fontFamily: "'Fredoka', sans-serif",
    };
  }

  function inputStyle() {
    return {
      padding: '14px 18px',
      fontSize: '1.5rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '120px',
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
      padding: '12px 28px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }

  function feedbackStyle() {
    return {
      marginTop: '12px',
      fontSize: '1rem',
      color: '#26324A',
      fontWeight: '500',
    };
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
