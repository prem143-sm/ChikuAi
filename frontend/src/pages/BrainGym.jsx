import { useEffect, useState } from 'react';
import useGeneratedActivity from '../hooks/useGeneratedActivity';
import { recordActivity } from '../services/progress';

export default function BrainGym({ language, grade, user }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const { item: riddle, loading, error, refresh } = useGeneratedActivity('brain', grade, language, user);

  useEffect(() => setShowAnswer(false), [riddle]);

  async function nextRiddle() {
    setActionError('');
    if (!showAnswer || saving || loading) return;
    setSaving(true);
    try {
      await recordActivity('Logic and riddles', user, 'brain', grade);
      setShowAnswer(false);
      refresh();
    } catch (saveError) {
      setActionError(`Your progress could not be saved: ${saveError.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-shell activity-page" style={containerStyle()}>
      <div className="activity-header" style={headerStyle()}>
        <h1 style={titleStyle()}>Brain Gym 🧩</h1>
        <p>Fresh Gemini puzzles for grade {grade}</p>
      </div>

      <div className="activity-card" style={cardStyle()}>
        {loading && <p role="status">Creating a fresh puzzle…</p>}
        {error && <div role="alert"><p>{error}</p><button onClick={refresh} style={navButtonStyle()}>Try again</button></div>}
        {riddle && !loading && (
          <>
            <div style={riddleTextStyle()}>{riddle.question}</div>
            <button onClick={() => setShowAnswer((visible) => !visible)} style={toggleButtonStyle()}>
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            {showAnswer && (
              <>
                <div style={answerStyle()}><strong>Answer:</strong> {riddle.answer}</div>
                <div style={hintStyle()}><strong>Hint:</strong> {riddle.hint}</div>
              </>
            )}
          </>
        )}
      </div>

      <div style={navStyle()}>
        <button onClick={nextRiddle} disabled={loading || saving || !riddle || !showAnswer} style={navButtonStyle()}>
          {saving ? 'Saving…' : 'Solve this — Next puzzle →'}
        </button>
      </div>
      {actionError && <p role="alert" style={hintStyle()}>{actionError}</p>}
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
      textAlign: 'center',
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

}