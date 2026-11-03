import { useState } from 'react';

export default function ChatComposer({ onSend, placeholder, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="chat-composer" style={composerStyle()}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        spellCheck="true"
        style={inputStyle(disabled)}
      />
      <button type="submit" disabled={!text.trim() || disabled} style={sendButtonStyle(disabled)}>
        Send
      </button>
    </form>
  );

  function composerStyle() {
    return {
      display: 'flex',
      gap: '10px',
      padding: '16px',
      background: '#fff',
      borderTop: '1px solid rgba(38,50,74,0.1)',
      borderRadius: '0 0 24px 24px',
      boxShadow: '0 -4px 12px rgba(38,50,74,0.08)',
    };
  }

  function inputStyle(disabled) {
    return {
      flex: 1,
      padding: '12px 18px',
      border: '2px solid #e5e7eb',
      borderRadius: '30px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      color: '#26324A',
      outline: 'none',
      opacity: disabled ? 0.6 : 1,
    };
  }

  function sendButtonStyle(disabled) {
    return {
      background: disabled ? '#c7d3e0' : '#70C9FF',
      color: disabled ? '#6B7280' : '#26324A',
      padding: '12px 24px',
      borderRadius: '30px',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
    };
  }
}