import { useEffect, useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import StudIQMascot from '../components/StudIQMascot';

const FEATURES = [
  {
    icon: '💬',
    title: 'Chat with StudIQ',
    description: 'Ask questions and get friendly answers.',
    route: 'chat',
  },
  {
    icon: '🔢',
    title: 'Maths Adventure',
    description: 'Fresh grade-level questions with helpful explanations.',
    route: 'maths',
  },
  {
    icon: '🔬',
    title: 'Science Explorer',
    description: 'Explore fresh, grade-level science lessons.',
    route: 'science',
  },
  {
    icon: '📚',
    title: 'English Practice',
    description: 'Practice a new word and English challenge each time.',
    route: 'english',
  },
  {
    icon: '🧠',
    title: 'General Knowledge Quiz',
    description: 'Try a fresh five-question quiz for your grade.',
    route: 'quiz',
  },
  {
    icon: '🧩',
    title: 'Brain Gym',
    description: 'Solve a new logic puzzle with a hint.',
    route: 'brain',
  },
  {
    icon: '📖',
    title: 'Story Time',
    description: 'Read a new original story for your grade.',
    route: 'story',
  },
  {
    icon: '🏆',
    title: 'My Progress',
    description: 'See what you have learned.',
    route: 'progress',
  },
];

export default function Home({
  onNavigate,
  language,
  grade,
  user,
  onSignIn,
  onSignOut,
  authBusy,
  authError,
  firebaseConfigured,
}) {
  const [suggestion, setSuggestion] = useState(
    "Today's suggestion: Try Chat with StudIQ!"
  );

  const suggestions = [
    "Today's suggestion: Try Chat with StudIQ!",
    "Today's suggestion: Explore Science Explorer!",
    "Today's suggestion: Play Maths Adventure!",
    "Today's suggestion: Read a Story!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-shell dashboard-page" style={containerStyle()}>
      <div className="dashboard-header" style={headerStyle()}>
        <StudIQMascot expression="happy" />
        <div className="dashboard-heading">
          <p className="dashboard-eyebrow">YOUR NEXT BIG IDEA STARTS HERE</p>
          <h1 style={titleStyle()}>StudIQ Learning World</h1>
          <p style={subtitleStyle()}>Learn, explore & have fun, Grade {grade} learner!</p>
        </div>
        <div style={headerActionsStyle()}>
          <button
            className="dashboard-settings-button"
            style={settingsButtonStyle()}
            onClick={() => onNavigate('settings')}
            aria-label="Settings"
          >
            ⚙
          </button>
          {user ? (
            <div style={accountControlsStyle()}>
              <span style={accountLabelStyle()}>Guardian account connected</span>
              <button onClick={onSignOut} disabled={authBusy} style={accountButtonStyle()}>
                {authBusy ? 'Please wait…' : 'Sign out'}
              </button>
              {authError && <p className="account-status account-status--error" role="status">{authError}</p>}
            </div>
          ) : (
            <div style={accountControlsStyle()}>
              <button
                onClick={onSignIn}
                disabled={authBusy || !firebaseConfigured}
                style={accountButtonStyle()}
              >
                {authBusy ? 'Please wait…' : 'Sign in with Google'}
              </button>
              <p className="account-status" role="status">
                {authError || (firebaseConfigured
                  ? 'Optional guardian sign-in for cloud progress'
                  : 'Guest progress stays on this device')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-section-heading">
        <div>
          <p className="dashboard-eyebrow">CHOOSE YOUR ADVENTURE</p>
          <h2>What would you like to learn today?</h2>
        </div>
        <p className="dashboard-suggestion" style={suggestionStyle()}>{suggestion}</p>
      </div>

      <div className="feature-grid" style={gridStyle()}>
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.route}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            onClick={() => onNavigate(feature.route)}
          />
        ))}
      </div>

      <div className="dashboard-footer" style={footerStyle()}>
        <p>Made with ❤️ for curious learners in grades 5–9</p>
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
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '24px',
    };
  }

  function headerActionsStyle() {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      marginLeft: 'auto',
    };
  }

  function accountControlsStyle() {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
    };
  }

  function accountLabelStyle() {
    return { color: '#6B7280', fontSize: '0.78rem' };
  }

  function accountButtonStyle() {
    return {
      border: '2px solid #70C9FF',
      borderRadius: '12px',
      background: '#fff',
      color: '#26324A',
      padding: '9px 14px',
      fontWeight: '600',
      cursor: 'pointer',
    };
  }

  function titleStyle() {
    return {
      margin: '8px 0 4px 0',
      fontSize: '2rem',
      color: '#26324A',
      fontFamily: "'Fredoka', 'Poppins', sans-serif",
    };
  }

  function subtitleStyle() {
    return {
      margin: 0,
      fontSize: '1.1rem',
      color: '#6B7280',
    };
  }

  function settingsButtonStyle() {
    return {
      background: '#fff',
      border: '2px solid #70C9FF',
      color: '#26324A',
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
  }

  function suggestionStyle() {
    return {
      textAlign: 'center',
      fontSize: '1rem',
      color: '#26324A',
      marginBottom: '24px',
      fontWeight: '500',
    };
  }

  function gridStyle() {
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      flex: 1,
    };
  }

  function footerStyle() {
    return {
      marginTop: '24px',
      textAlign: 'center',
      color: '#9CA3AF',
      fontSize: '0.85rem',
    };
  }
}
