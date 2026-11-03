import { useState } from 'react';
import useGeneratedActivity from '../hooks/useGeneratedActivity';
import { recordActivity } from '../services/progress';

export default function StoryTime({ language, grade, user }) {
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const { item: story, loading, error, refresh } = useGeneratedActivity('story', grade, language, user);

  async function nextStory() {
    if (saving || loading) return;
    setActionError('');
    if (!story) return;
    setSaving(true);
    try {
      await recordActivity('Story time', user, 'story', grade);
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
        <h1 style={titleStyle()}>Story Time 📖</h1>
        <p>Fresh Gemini stories for grade {grade}</p>
      </div>

      <div className="activity-card story-card" style={cardStyle()}>
        {loading && <p role="status">Creating a fresh story…</p>}
        {error && <div role="alert"><p>{error}</p><button onClick={refresh} style={navButtonStyle()}>Try again</button></div>}
        {story && !loading && (
          <>
            <div style={storyTitleStyle()}>{story.title}</div>
            <div style={readingLevelStyle()}>Grade {grade} · {story.readingLevel}</div>
            <div style={storyTextStyle()}>{story.text}</div>
            {story.moral && <div style={moralStyle()}><strong>Story lesson:</strong> {story.moral}</div>}
            {story.discussionQuestion && (
              <div style={discussionStyle()}>
                <strong>💬 Talk about it:</strong> {story.discussionQuestion}
              </div>
            )}
          </>
        )}
      </div>

      <div style={navStyle()}>
        <button onClick={nextStory} disabled={loading || saving || !story} style={navButtonStyle()}>
          {saving ? 'Saving…' : 'I finished reading — Next story →'}
        </button>
      </div>
      {actionError && <p role="alert" style={discussionStyle()}>{actionError}</p>}
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

}