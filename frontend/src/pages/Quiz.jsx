import { useState, useEffect } from 'react';
import quizzes from '../data/quizzes.json';
import { recordQuiz } from '../services/progress';

export default function Quiz({ language }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setAnswered(false);
  }, [currentIndex]);

  const quiz = quizzes.filter(
    (q) => q.difficulty === 'easy' || q.difficulty === 'medium'
  );

  const current = quiz[currentIndex];

  function selectOption(option) {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === current.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  }

  function nextQuestion() {
    if (currentIndex === quiz.length - 1) {
      recordQuiz(score);
      setShowResult(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function restart() {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
  }

  if (showResult) {
    return (
      <div style={containerStyle()}>
        <div style={resultCardStyle()}>
          <h1 style={resultTitleStyle()}>Quiz Complete! 🏆</h1>
          <div style={scoreStyle()}>
            <span className="value">{score}</span>
            <span className="label">out of {quiz.length}</span>
          </div>
          <p style={resultMessageStyle()}>
            {score === quiz.length
              ? 'Perfect! You are a star! ⭐'
              : score >= quiz.length / 2
              ? 'Great job! Keep learning! 🌟'
              : "Don't worry, try again! You'll do better!"}
          </p>
          <button onClick={restart} style={restartButtonStyle()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle()}>
      <div style={headerStyle()}>
        <h1 style={titleStyle()}>General Knowledge Quiz 🧠</h1>
        <div style={progressStyle()}>
          Question {currentIndex + 1} of {quiz.length}
        </div>
      </div>

      <div style={cardStyle()}>
        <div style={topicStyle()}>
          {current.topic} • {current.difficulty}
        </div>
        <h2 style={questionStyle()}>{current.question}</h2>
        <div style={optionsStyle()}>
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => selectOption(opt)}
              disabled={answered}
              style={optionButtonStyle(
                answered &&
                (opt === current.correctAnswer || opt === selected)
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {answered && (
          <p style={explanationStyle()}>
            {selected === current.correctAnswer
              ? 'Correct! 🎉'
              : `Not quite. The answer is ${current.correctAnswer}.`}
            {' '}
            {current.explanation}
          </p>
        )}
        <button
          onClick={nextQuestion}
          disabled={!answered}
          style={nextButtonStyle()}
        >
          {answered ? 'Next Question' : 'Select an answer'}
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
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
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

  function progressStyle() {
    return {
      fontSize: '0.95rem',
      color: '#6B7280',
      fontWeight: '500',
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

  function topicStyle() {
    return {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#70C9FF',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '16px',
    };
  }

  function questionStyle() {
    return {
      margin: '0 0 24px 0',
      fontSize: '1.3rem',
      color: '#26324A',
      fontWeight: '600',
      lineHeight: '1.4',
    };
  }

  function optionsStyle() {
    return {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    };
  }

  function optionButtonStyle(active) {
    const base = {
      padding: '14px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'all 0.2s',
    };
    if (active) {
      return {
        ...base,
        background: optIsCorrect() ? '#8DE3C1' : '#FF8E8E',
        color: '#fff',
        border: 'none',
      };
    }
    return {
      ...base,
      background: '#fff',
      border: '2px solid #e5e7eb',
      color: '#26324A',
    };

    function optIsCorrect() {
      return selected === current.correctAnswer;
    }
  }

  function explanationStyle() {
    return {
      marginTop: '16px',
      padding: '12px',
      background: '#f0fdf4',
      borderRadius: '12px',
      color: '#26324A',
      fontSize: '0.95rem',
    };
  }

  function nextButtonStyle() {
    return {
      marginTop: '20px',
      background: answered ? '#70C9FF' : '#c7d3e0',
      color: '#26324A',
      border: 'none',
      padding: '12px 28px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: answered ? 'pointer' : 'not-allowed',
      fontFamily: 'inherit',
      width: '100%',
    };
  }

  function resultCardStyle() {
    return {
      background: '#fff',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 4px 12px rgba(38,50,74,0.12)',
      maxWidth: '500px',
      margin: '0 auto',
      textAlign: 'center',
    };
  }

  function resultTitleStyle() {
    return {
      margin: '0 0 16px 0',
      fontSize: '2rem',
      color: '#26324A',
      fontFamily: "'Fredoka', sans-serif",
    };
  }

  function scoreStyle() {
    return {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#70C9FF',
      marginBottom: '8px',
      fontFamily: "'Fredoka', sans-serif",
    };
  }

  function resultMessageStyle() {
    return {
      margin: '0 0 24px 0',
      fontSize: '1.1rem',
      color: '#26324A',
    };
  }

  function restartButtonStyle() {
    return {
      background: '#FFD95A',
      color: '#26324A',
      border: 'none',
      padding: '12px 32px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }
}
