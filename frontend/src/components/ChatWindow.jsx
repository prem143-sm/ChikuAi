import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import ChatMessage from './ChatMessage';
import ChatComposer from './ChatComposer';
import VoiceControls from './VoiceControls';

export default function ChatWindow({ language, onDashboard }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setSpeechSupported(typeof window !== 'undefined' && !!window.speechSynthesis);
    setRecognitionSupported(
      typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }, []);

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const addMessage = (text, isUser) => {
    setMessages((prev) => [...prev, { text, isUser, id: Date.now() + Math.random() }]);
  };

  const handleSend = async (text) => {
    if (!text?.trim() || loading) return;
    const history = messages.slice(-6).map((message) => ({
      role: message.isUser ? 'user' : 'assistant',
      content: message.text,
    }));
    addMessage(text, true);
    setLoading(true);
    setLastFailedMessage(null);
    try {
      const response = await api.chat(text, language, 'chat', history);
      if (response.success) {
        addMessage(response.reply, false);
        if (response.provider === 'gemini') speak(response.reply);
      } else {
        addMessage("Sorry, I couldn't understand that. Let's try again!", false);
      }
    } catch (err) {
      setLastFailedMessage(text);
      addMessage("I'm having trouble connecting. Let's try a local game instead!", false);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text) => {
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hindi' || language === 'hinglish' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.speak(utterance);
  };

  const handleListen = async () => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    if (!SpeechRecognition) {
      addMessage("Voice input isn't available on this browser. Try typing instead!", false);
      return;
    }
    setListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hindi' || language === 'hinglish' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      handleSend(transcript);
    };
    recognition.onerror = () => {
      setListening(false);
      addMessage("I didn't catch that. Try typing your question!", false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleStop = () => {
    if (synth) synth.cancel();
    setSpeaking(false);
  };

  const clearConversation = () => {
    if (loading) return;
    handleStop();
    setMessages([]);
    setLastFailedMessage(null);
  };

  const suggestedQuestions = [
    "Why is the sky blue?",
    "Teach me multiplication.",
    "Tell me about dinosaurs.",
    "How do plants grow?",
    "Let's practice English.",
    "Give me a fun riddle.",
  ];

  return (
    <div className="chat-page" style={containerStyle()}>
      <div className="chat-header" style={headerStyle()}>
        <button onClick={onDashboard} style={dashboardButtonStyle()}>
          ← Back to dashboard
        </button>
        <div className="chat-mascot" style={mascotStyle()}>🐣</div>
        <div>
          <h2 style={titleStyle()}>StudIQ</h2>
          <p style={statusStyle()}>
            {loading ? "Thinking..." : "Your AI learning buddy"}
          </p>
        </div>
        <button onClick={clearConversation} disabled={loading || messages.length === 0} style={clearButtonStyle()}>
          Clear chat
        </button>
      </div>

      <div className="chat-messages" style={messagesContainerStyle()}>
        {messages.length === 0 && (
          <div style={emptyStyle()}>
            <p>Ask me anything!</p>
            <p style={hintStyle()}>Try: "Why is the sky blue?"</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.text}
            isUser={msg.isUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <VoiceControls
        speechSupported={speechSupported}
        recognitionSupported={recognitionSupported}
        speaking={speaking}
        listening={listening}
        onSpeak={() => {
          const last = messages[messages.length - 1];
          if (last && !last.isUser) speak(last.text);
        }}
        onListen={handleListen}
        onStop={handleStop}
      />

      <div className="chat-suggestions" style={suggestionsStyle()}>
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            style={chipStyle()}
          >
            {q}
          </button>
        ))}
      </div>

      {lastFailedMessage && (
        <button className="chat-retry-button" onClick={() => handleSend(lastFailedMessage)} style={retryButtonStyle()}>
          Retry last question
        </button>
      )}

      <ChatComposer
        onSend={handleSend}
        placeholder="Type your question here..."
        disabled={loading}
      />
    </div>
  );

  function containerStyle() {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxHeight: '100vh',
      background: 'linear-gradient(180deg, #FFF9EE 0%, #F3E8D3 100%)',
    };
  }

  function headerStyle() {
    return {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 24px',
      background: '#fff',
      borderBottom: '1px solid rgba(38,50,74,0.08)',
    };
  }

  function dashboardButtonStyle() {
    return {
      flex: '0 0 auto',
      border: '2px solid #70C9FF',
      borderRadius: '999px',
      background: '#fff',
      color: '#26324A',
      font: 'inherit',
      fontWeight: 700,
      padding: '10px 14px',
      boxShadow: '0 3px 10px rgba(38, 50, 74, 0.16)',
    };
  }

  function mascotStyle() {
    return {
      width: '48px',
      height: '48px',
      background: '#70C9FF',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
    };
  }

  function titleStyle() {
    return {
      margin: 0,
      fontSize: '1.25rem',
      color: '#26324A',
      fontFamily: "'Fredoka', 'Poppins', sans-serif",
    };
  }

  function statusStyle() {
    return {
      margin: 0,
      fontSize: '0.85rem',
      color: '#6B7280',
    };
  }

  function clearButtonStyle() {
    return {
      marginLeft: 'auto', background: '#fff', border: '2px solid #70C9FF',
      borderRadius: '10px', padding: '8px 12px', color: '#26324A', cursor: 'pointer',
    };
  }

  function retryButtonStyle() {
    return {
      margin: '0 12px 12px', padding: '10px 14px', border: 'none', borderRadius: '10px',
      background: '#B7A4FF', color: '#fff', fontWeight: '600', cursor: 'pointer',
    };
  }

  function messagesContainerStyle() {
    return {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    };
  }

  function emptyStyle() {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#6B7280',
    };
  }

  function hintStyle() {
    return {
      marginTop: '6px',
      fontSize: '0.85rem',
      fontStyle: 'italic',
    };
  }

  function suggestionsStyle() {
    return {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      justifyContent: 'center',
      padding: '12px',
      background: '#fff',
    };
  }

  function chipStyle() {
    return {
      background: '#fff',
      border: '2px solid #B7A4FF',
      color: '#26324A',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '500',
      cursor: 'pointer',
    };
  }
}
