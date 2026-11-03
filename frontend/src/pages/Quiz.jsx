import { useEffect, useRef, useState } from 'react';
import useGeneratedActivity from '../hooks/useGeneratedActivity';
import { recordQuiz } from '../services/progress';

export default function Quiz({ language, grade, user }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const completionId = useRef('');
  const { item: quiz, loading, error, refresh } = useGeneratedActivity('quiz', grade, language, user);
  const questions = quiz?.questions || [];
  const current = questions[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelected(null);
    setShowResult(false);
    setActionError('');
    completionId.current = `${Date.now()}-${Math.random()}`;
  }, [quiz]);

  function selectOption(option) {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === current.correctAnswer) setScore((previous) => previous + 1);
  }

  async function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      setSelected(null);
      setAnswered(false);
      return;
    }

    setSaving(true);
    setActionError('');
    try {
      await recordQuiz(score, questions.length, user, grade, completionId.current);
      setShowResult(true);
    } catch (saveError) {
      setActionError(`Quiz finished, but progress could not be saved: ${saveError.message}`);
    } finally {
      setSaving(false);
    }
  }

  function restart() {
    setShowResult(false);
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setActionError('');
    refresh();
  }

  if (showResult) {
    return (
      <div className="page-shell activity-page" style={containerStyle()}>
        <div className="activity-card quiz-result-card" style={resultCardStyle()}>
          <h1 style={resultTitleStyle()}>Quiz Complete! 🏆</h1>
          <div style={scoreStyle()}>{score} <span style={scoreLabelStyle()}>out of {questions.length}</span></div>
          <p style={resultMessageStyle()}>
            {score === questions.length
              ? 'Perfect! You are a star! ⭐'
              : score >= questions.length / 2
                ? 'Great job! Keep learning! 🌟'
                : "Don't worry, try again! You'll do better!"}
          </p>
          <button onClick={restart} style={restartButtonStyle()}>Try a fresh quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell activity-page" style={containerStyle()}>
      <div className="activity-header" style={headerStyle()}>
        <h1 style={titleStyle()}>General Knowledge Quiz 🧠</h1>
        <p>Fresh Gemini quiz for grade {grade}</p>
        {current && !loading && <div style={progressStyle()}>Question {currentIndex + 1} of {questions.length}</div>}
      </div>

      <div className="activity-card" style={cardStyle()}>
        {loading && <p role="status">Creating a fresh grade {grade} quiz…</p>}
        {error && <div role="alert"><p>{error}</p><button onClick={refresh} style={nextButtonStyle()}>Try again</button></div>}
        {current && !loading && (
          <>
            <div style={topicStyle()}>{current.topic}</div>
            <h2 style={questionStyle()}>{current.question}</h2>
            <div style={optionsStyle()}>
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => selectOption(option)}
                  disabled={answered}
                  style={optionButtonStyle(
                    answered && (option === current.correctAnswer || option === selected)
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            {answered && (
              <p style={explanationStyle()}>
                {selected === current.correctAnswer ? 'Correct! 🎉' : `The correct answer is ${current.correctAnswer}.`}
                {' '}{current.explanation}
              </p>
            )}
            <button onClick={nextQuestion} disabled={!answered || saving} style={nextButtonStyle()}>
              {saving ? 'Saving progress…' : answered ? currentIndex === questions.length - 1 ? 'Finish quiz' : 'Next question' : 'Select an answer'}
            </button>
          </>
        )}
        {actionError && <p role="alert" style={errorStyle()}>{actionError}</p>}
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
    return { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#6B7280' };
  }

  function titleStyle() {
    return { margin: 0, fontSize: '2rem', color: '#26324A', fontFamily: "'Fredoka', 'Poppins', sans-serif" };
  }

  function progressStyle() {
    return { fontSize: '0.95rem', color: '#6B7280', fontWeight: 500 };
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
    };
  }

  function topicStyle() {
    return { color: '#70C9FF', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' };
  }

  function questionStyle() {
    return { margin: '0 0 24px', fontSize: '1.3rem', color: '#26324A', fontWeight: 600, lineHeight: 1.4 };
  }

  function optionsStyle() {
    return { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' };
  }

  function optionButtonStyle(active) {
    return {
      padding: '14px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: answered ? 'default' : 'pointer',
      background: active ? selected === current.correctAnswer ? '#8DE3C1' : '#FF8E8E' : '#fff',
      border: active ? 'none' : '2px solid #e5e7eb',
      color: '#26324A',
    };
  }

  function explanationStyle() {
    return { marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '12px', color: '#26324A', lineHeight: 1.5 };
  }

  function nextButtonStyle() {
    return {
      marginTop: '20px',
      background: answered ? '#70C9FF' : '#c7d3e0',
      color: '#26324A',
      padding: '12px 28px',
      borderRadius: '12px',
      fontWeight: 600,
      width: '100%',
    };
  }

  function errorStyle() {
    return { color: '#9B2C2C', marginTop: '12px' };
  }

  function resultCardStyle() {
    return { background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 12px rgba(38,50,74,0.12)', maxWidth: '500px', margin: '0 auto', textAlign: 'center' };
  }

  function resultTitleStyle() {
    return { margin: '0 0 16px', fontSize: '2rem', color: '#26324A', fontFamily: "'Fredoka', sans-serif" };
  }

  function scoreStyle() {
    return { fontSize: '3rem', fontWeight: 700, color: '#70C9FF', marginBottom: '8px', fontFamily: "'Fredoka', sans-serif" };
  }

  function scoreLabelStyle() {
    return { fontSize: '1rem', color: '#6B7280' };
  }

  function resultMessageStyle() {
    return { margin: '0 0 24px', fontSize: '1.1rem', color: '#26324A' };
  }

  function restartButtonStyle() {
    return { background: '#FFD95A', color: '#26324A', padding: '12px 32px', borderRadius: '12px', fontWeight: 600 };
  }
}
