import { useEffect, useState } from 'react';
import { getProgress, resetProgress } from '../services/progress';

export default function Progress({ user }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProgress(user).then((value) => {
      if (active) {
        setProgress(value);
        setError('');
      }
    }).catch((loadError) => {
      if (active) setError(`Progress could not be loaded: ${loadError.message}`);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [user]);

  async function handleReset() {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    setError('');
    try {
      await resetProgress(user);
      setProgress(await getProgress(user));
      setResetConfirm(false);
    } catch (resetError) {
      setError(`Progress could not be reset: ${resetError.message}`);
    }
  }

  const summary = progress || {
    quizzesCompleted: 0,
    correctAnswers: 0,
    activitiesCompleted: 0,
    topicsExplored: [],
    activityCounts: {},
    grade: '5',
  };
  const stats = [
    { value: summary.quizzesCompleted, label: 'Quizzes Completed' },
    { value: summary.correctAnswers, label: 'Correct Quiz & Maths Answers' },
    { value: summary.activitiesCompleted, label: 'Activities Done' },
    { value: summary.topicsExplored.length, label: 'Topics Explored' },
  ];
  const activityNames = {
    maths: 'Maths questions',
    science: 'Science lessons',
    english: 'English practices',
    quiz: 'General knowledge quizzes',
    brain: 'Brain Gym puzzles',
    story: 'Stories read',
  };

  return (
    <div className="page-shell progress-page" style={containerStyle()}>
      <div className="page-heading" style={headerStyle()}>
        <h1 style={titleStyle()}>My Progress 🏆</h1>
        <p style={progressSourceStyle()}>
          {user ? 'Saved to your guardian account and synced across devices.' : 'Guest report saved on this device. A guardian can sign in from the dashboard to sync it.'}
        </p>
      </div>

      {loading && <p role="status">Loading your learning report…</p>}
      {error && <p role="alert" style={errorStyle()}>{error}</p>}
      <div style={statsContainerStyle()}>
        {stats.map((stat, i) => (
          <div key={i} className="progress-stat">
            <span className="value">{stat.value}</span>
            <span className="label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="report-card" style={topicsStyle()}>
        <h3 style={topicsTitleStyle()}>Topics Explored</h3>
        {summary.topicsExplored.length === 0 ? (
          <p style={emptyTopicsStyle()}>
            No topics yet. Start exploring with StudIQ!
          </p>
        ) : (
          <div style={topicsListStyle()}>
            {summary.topicsExplored.map((topic, i) => (
              <span key={i} style={topicChipStyle()}>{topic}</span>
            ))}
          </div>
        )}
      </div>

      <div className="report-card" style={activityReportStyle()}>
        <h3 style={topicsTitleStyle()}>Activities by type</h3>
        <p style={gradeLabelStyle()}>Selected grade: {summary.grade}</p>
        {Object.keys(activityNames).map((activity) => (
          <div key={activity} style={activityRowStyle()}>
            <span>{activityNames[activity]}</span>
            <strong>{summary.activityCounts[activity] || 0}</strong>
          </div>
        ))}
        {summary.lastQuiz && (
          <p style={lastQuizStyle()}>
            Latest quiz: {summary.lastQuiz.score} / {summary.lastQuiz.total} correct (Grade {summary.lastQuiz.grade})
          </p>
        )}
      </div>

      <div style={resetSectionStyle()}>
        <button onClick={handleReset} disabled={loading} style={resetButtonStyle()}>
          {resetConfirm ? 'Click again to confirm reset' : 'Reset Progress'}
        </button>
        {resetConfirm && <button onClick={() => setResetConfirm(false)} style={cancelButtonStyle()}>Cancel</button>}
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

  function progressSourceStyle() {
    return { color: '#6B7280', marginTop: '8px', lineHeight: 1.5 };
  }

  function errorStyle() {
    return { color: '#9B2C2C', textAlign: 'center', marginBottom: '16px' };
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

  function activityReportStyle() {
    return {
      background: '#fff',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(38,50,74,0.12)',
      maxWidth: '600px',
      width: '100%',
      margin: '24px auto 0',
    };
  }

  function activityRowStyle() {
    return { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(38,50,74,0.08)' };
  }

  function gradeLabelStyle() {
    return { color: '#6B7280', margin: '0 0 12px' };
  }

  function lastQuizStyle() {
    return { margin: '16px 0 0', color: '#6B7280' };
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

  function cancelButtonStyle() {
    return { marginLeft: '10px', padding: '12px 20px', borderRadius: '12px', border: '2px solid #70C9FF', color: '#26324A' };
  }
}
