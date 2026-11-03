import { useState, useEffect, useRef } from 'react';

export default function VoiceControls({
  onSpeak,
  onListen,
  speaking,
  listening,
  onStop,
  speechSupported,
  recognitionSupported,
}) {
  const [canSpeak, setCanSpeak] = useState(!!speechSupported);
  const [canListen, setCanListen] = useState(!!recognitionSupported);

  useEffect(() => {
    setCanSpeak(!!speechSupported);
    setCanListen(!!recognitionSupported);
  }, [speechSupported, recognitionSupported]);

  if (!canSpeak && !canListen) {
    return (
      <div className="voice-controls voice-controls--unsupported" style={unsupportedStyle()}>
        Voice features not available in this browser. You can still type and chat!
      </div>
    );
  }

  return (
    <div className="voice-controls" style={containerStyle()}>
      <button
        onClick={speaking ? onStop : onSpeak}
        aria-label="Read aloud"
        style={buttonStyle(speaking, 'speak')}
      >
        {speaking ? '⏹ Stop' : '🔊 Read Aloud'}
      </button>
      <button
        onClick={onListen}
        disabled={listening || !canListen}
        aria-label="Voice input"
        style={buttonStyle(listening, 'listen')}
      >
        {listening ? '⏹ Stop Listening' : '🎤 Speak'}
      </button>
      {onStop && speaking && (
        <button onClick={onStop} style={buttonStyle(true, 'stop')}>
          ⏹ Stop
        </button>
      )}
    </div>
  );

  function containerStyle() {
    return {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '16px',
    };
  }

  function buttonStyle(active, type) {
    const base = {
      padding: '10px 18px',
      borderRadius: '30px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      border: 'none',
      fontFamily: 'inherit',
    };
    if (type === 'speak') {
      return {
        ...base,
        background: active ? '#FF8E8E' : '#8DE3C1',
        color: active ? '#fff' : '#26324A',
        opacity: active ? 1 : 0.9,
      };
    }
    if (type === 'listen') {
      return {
        ...base,
        background: active ? '#FF8E8E' : '#B7A4FF',
        color: active ? '#fff' : '#26324A',
        opacity: active ? 1 : 0.9,
      };
    }
    return {
      ...base,
      background: '#FF8E8E',
      color: '#fff',
    };
  }

  function unsupportedStyle() {
    return {
      textAlign: 'center',
      padding: '12px',
      fontSize: '0.85rem',
      color: '#6B7280',
      background: '#fff',
      borderRadius: '12px',
      marginTop: '12px',
    };
  }
}
