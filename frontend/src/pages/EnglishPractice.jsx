import { useEffect, useState } from 'react';
import useGeneratedActivity from '../hooks/useGeneratedActivity';
import { recordActivity } from '../services/progress';

export default function EnglishPractice({ language, grade, user }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const { item: word, loading, error, refresh } = useGeneratedActivity('english', grade, language, user);

  useEffect(() => {
    setShowTranslation(false);
    setCompleted(false);
  }, [word]);

  async function markPracticed() {
    if (!word || completed || saving) return;
    setActionError('');
    setSaving(true);
    try {
      await recordActivity('English vocabulary', user, 'english', grade);
      setCompleted(true);
    } catch (saveError) {
      setActionError(`Your progress could not be saved: ${saveError.message}`);
    } finally {
      setSaving(false);
    }
  }

  function nextWord() {
    setShowTranslation(false);
    setCompleted(false);
    refresh();
  }

  return (
    <div className="page-shell activity-page" style={containerStyle()}>
      <div className="activity-header" style={headerStyle()}>
        <h1 style={titleStyle()}>English Practice 📚</h1>
        <p>Fresh Gemini vocabulary for grade {grade}</p>
      </div>

      <div className="activity-card" style={cardStyle()}>
        {loading && <p role="status">Creating a fresh vocabulary activity…</p>}
        {error && <div role="alert"><p>{error}</p><button onClick={refresh} style={navButtonStyle()}>Try again</button></div>}
        {word && !loading && (
          <>
            <p style={readingLevelStyle()}>Grade {grade} vocabulary</p>
            <div style={wordStyle()}>{word.word}</div>
            <div style={sentenceStyle()}>"{word.sentence}"</div>
            <p style={challengeStyle()}>{word.challenge}</p>
            {showTranslation && (
              <div style={hindiStyle()}>
                {word.meaning} · हिन्दी: {word.hindi}
              </div>
            )}
            <button onClick={() => setShowTranslation((visible) => !visible)} style={toggleButtonStyle()}>
              {showTranslation ? 'Hide meaning' : 'Show meaning'}
            </button>
            <div style={actionRowStyle()}>
              <button onClick={markPracticed} disabled={completed || saving} style={navButtonStyle()}>
                {saving ? 'Saving…' : completed ? 'Practiced ✓' : 'I practiced this'}
              </button>
              {completed && <button onClick={nextWord} style={navButtonStyle()}>Next word →</button>}
            </div>
          </>
        )}
      </div>
      {actionError && <p role="alert" style={actionErrorStyle()}>{actionError}</p>}
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

  function readingLevelStyle() {
    return { color: '#70C9FF', fontWeight: 700 };
  }

  function challengeStyle() {
    return { color: '#6B7280', margin: '0 0 16px', lineHeight: 1.5 };
  }

  function actionRowStyle() {
    return { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '16px' };
  }

  function actionErrorStyle() {
    return { textAlign: 'center', color: '#9B2C2C' };
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