import { useState } from 'react';
import { resetProgress } from '../services/progress';

export default function Settings({ language, setLanguage, user }) {
  const [localLang, setLocalLang] = useState(language);
  const [resetError, setResetError] = useState('');
  const [resetting, setResetting] = useState(false);

  return (
    <div className="page-shell settings-page" style={containerStyle()}>
      <div className="page-heading" style={headerStyle()}>
        <h1 style={titleStyle()}>Settings ⚙</h1>
        <p style={subtitleStyle()}>
          Parents can manage preferences here.
        </p>
      </div>

      <div className="settings-section">
        <h3>AI & Learning</h3>
        <div style={settingsRowStyle()}>
          <span>AI Learning Activities</span>
          <span style={statusTextStyle()}>Gemini-generated for grades 5–9</span>
        </div>
        <div style={settingsRowStyle()}>
          <span>Fresh content</span>
          <span style={statusTextStyle()}>Avoids repeating the latest 100 items per activity</span>
        </div>
      </div>

      <div className="settings-section">
        <h3>Progress and account</h3>
        <div style={settingsRowStyle()}>
          <span>Progress storage</span>
          <span style={statusTextStyle()}>
            {user ? 'Synced to guardian Google account' : 'Guest mode: saved in this browser'}
          </span>
        </div>
        <p style={statusTextStyle()}>
          Google sign-in is optional and intended for a parent or guardian. Do not enter a child’s personal details.
        </p>
        {resetError && <p role="alert" style={errorTextStyle()}>{resetError}</p>}
      </div>

      <div className="settings-section">
        <h3>Language</h3>
        <div style={languageToggleStyle()}>
          {['english', 'hinglish', 'hindi'].map((code) => (
            <button
              key={code}
              onClick={() => {
                setLocalLang(code);
                if (setLanguage) setLanguage(code);
              }}
              style={langButtonStyle(localLang === code)}
            >
              {code === 'english' ? 'English' : code === 'hinglish' ? 'Hinglish' : 'हिन्दी'}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Privacy</h3>
        <div style={settingsRowStyle()}>
          <span>API Key Stored</span>
          <span style={statusTextStyle()}>Backend only (never in browser)</span>
        </div>
        <div style={settingsRowStyle()}>
          <span>Conversations Stored</span>
          <span style={statusTextStyle()}>Not stored permanently</span>
        </div>
        <div style={settingsRowStyle()}>
          <span>Child personal data</span>
          <span style={statusTextStyle()}>Not requested or stored</span>
        </div>
        <div style={settingsRowStyle()}>
          <span>Guardian account</span>
          <span style={statusTextStyle()}>
            {user ? 'Google/Firebase handles sign-in; email is not in progress records' : 'Optional; use a guardian Google account'}
          </span>
        </div>
      </div>

      <div className="settings-section">
        <h3>Controls</h3>
        <div style={settingsRowStyle()}>
          <span>Reset Learning Progress</span>
          <button
            disabled={resetting}
            onClick={async () => {
              if (!window.confirm('Reset all progress for this profile?')) return;
              setResetting(true);
              setResetError('');
              try {
                await resetProgress(user);
              } catch (error) {
                setResetError(`Progress could not be reset: ${error.message}`);
              } finally {
                setResetting(false);
              }
            }}
            style={resetButtonStyle()}
          >
            {resetting ? 'Resetting…' : 'Reset'}
          </button>
        </div>
      </div>

      <div style={footerStyle()}>
        <p>StudIQ learning content is designed for grades 5–9. A parent or guardian should supervise online use.</p>
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

  function titleStyle() {
    return {
      margin: 0,
      fontSize: '2rem',
      color: '#26324A',
      fontFamily: "'Fredoka', 'Poppins', sans-serif",
    };
  }

  function subtitleStyle() {
    return {
      margin: 0,
      fontSize: '1rem',
      color: '#6B7280',
    };
  }

  function settingsRowStyle() {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid rgba(38,50,74,0.08)',
    };
  }

  function statusTextStyle() {
    return {
      fontSize: '0.9rem',
      color: '#6B7280',
      lineHeight: 1.5,
    };
  }

  function errorTextStyle() {
    return { color: '#9B2C2C', marginTop: '12px' };
  }

  function languageToggleStyle() {
    return {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    };
  }

  function langButtonStyle(active) {
    return {
      padding: '10px 20px',
      borderRadius: '20px',
      border: active ? 'none' : '2px solid #70C9FF',
      background: active ? '#70C9FF' : '#fff',
      color: active ? '#fff' : '#26324A',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }

  function resetButtonStyle() {
    return {
      background: '#FF8E8E',
      color: '#fff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '0.85rem',
      cursor: 'pointer',
      fontFamily: 'inherit',
    };
  }

  function footerStyle() {
    return {
      marginTop: '32px',
      textAlign: 'center',
      color: '#9CA3AF',
      fontSize: '0.85rem',
    };
  }
}
