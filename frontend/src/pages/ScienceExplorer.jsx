import { useState } from 'react';
import useGeneratedActivity from '../hooks/useGeneratedActivity';
import { recordActivity } from '../services/progress';

export default function ScienceExplorer({ language, grade, user }) {
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const { item: fact, loading, error, refresh } = useGeneratedActivity('science', grade, language, user);

  async function nextFact() {
    if (saving || loading) return;
    setActionError('');
    setSaving(true);
    if (fact) {
      try {
        await recordActivity(fact.topic, user, 'science', grade);
      } catch (saveError) {
        setActionError(`Your progress could not be saved: ${saveError.message}`);
        setSaving(false);
        return;
      }
    }
    refresh();
    setSaving(false);
  }

  return (
    <div className="page-shell activity-page" style={containerStyle()}>
      <div className="activity-header" style={headerStyle()}>
        <h1 style={titleStyle()}>Science Explorer 🔬</h1>
        <p>Fresh Gemini science for grade {grade}</p>
      </div>

      <div className="activity-card" style={cardStyle()}>
        {loading && <p role="status">Creating a fresh science lesson…</p>}
        {error && <div role="alert"><p>{error}</p><button onClick={refresh} style={navButtonStyle()}>Try again</button></div>}
        {fact && !loading && (
          <>
            <div style={topicStyle()}>{fact.topic} · Grade {grade}</div>
            <h2 style={factTitleStyle()}>{fact.title}</h2>
            <p style={factTextStyle()}>{fact.text}</p>
            {fact.question && <p style={questionStyle()}>💬 {fact.question}</p>}
          </>
        )}
      </div>

      <div style={navStyle()}>
        <button onClick={nextFact} disabled={loading || saving || !fact} style={navButtonStyle()}>
          {saving ? 'Saving…' : 'I learned this — Next fact →'}
        </button>
      </div>
      {actionError && <p role="alert" style={questionStyle()}>{actionError}</p>}
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
