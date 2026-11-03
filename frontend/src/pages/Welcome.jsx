import { useState } from 'react';
import ChikuMascot from '../components/ChikuMascot';

export default function Welcome({ onStart, setLanguage }) {
  const [language, setLocalLanguage] = useState('english');

  const languages = [
    { code: 'english', label: 'English' },
    { code: 'hinglish', label: 'Hinglish' },
    { code: 'hindi', label: 'हिन्दी' },
  ];

  return (
    <div style={containerStyle()}>
      <div style={cardStyle()}>
        <ChikuMascot expression="happy" />
        <h1 style={titleStyle()}>Welcome to Chiku AI! 👋</h1>
        <p style={subtitleStyle()}>
          Your friendly AI learning buddy.
        </p>

        <div style={languageSectionStyle()}>
          <label style={labelStyle()}>Choose your language:</label>
          <div style={languageToggleStyle()}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocalLanguage(lang.code);
                  if (setLanguage) setLanguage(lang.code);
                }}
                style={langButtonStyle(language === lang.code)}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onStart} style={startButtonStyle()}>
          Let's Learn Together!
        </button>

        <p style={privacyStyle()}>
          Chiku is an AI learning companion. No personal information is needed to play.
        </p>
      </div>
    </div>
  );

  function containerStyle() {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      background: 'linear-gradient(180deg, #FFF9EE 0%, #F3E8D3 100%)',
    };
  }

  function cardStyle() {
    return {
      background: '#fff',
      borderRadius: '32px',
      padding: '40px 32px',
      boxShadow: '0 8px 24px rgba(38,50,74,0.12)',
      textAlign: 'center',
      maxWidth: '480px',
      width: '100%',
      border: '1px solid rgba(255,255,255,0.6)',
    };
  }

  function titleStyle() {
    return {
      margin: '16px 0 8px 0',
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
      lineHeight: '1.5',
    };
  }

  function languageSectionStyle() {
    return {
      margin: '24px 0',
    };
  }

  function labelStyle() {
    return {
      display: 'block',
      marginBottom: '10px',
      fontWeight: '600',
      color: '#26324A',
    };
  }

  function languageToggleStyle() {
    return {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
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

  function startButtonStyle() {
    return {
      marginTop: '24px',
      background: '#70C9FF',
      color: '#26324A',
      border: 'none',
      padding: '16px 36px',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: '600',
      fontFamily: 'inherit',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(112,201,255,0.4)',
    };
  }

  function privacyStyle() {
    return {
      marginTop: '20px',
      fontSize: '0.8rem',
      color: '#9CA3AF',
    };
  }
}