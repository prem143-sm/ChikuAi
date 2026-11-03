export default function ChatMessage({ message, isUser, timestamp }) {
  return (
    <div
      className={`chat-bubble ${isUser ? 'user' : 'studiq'}`}
      role={isUser ? 'log' : 'log'}
      aria-label={isUser ? 'You' : 'StudIQ'}
    >
      {message}
      {timestamp && (
        <span
          style={{
            fontSize: '0.7rem',
            opacity: 0.6,
            display: 'block',
            marginTop: '4px',
            marginLeft: isUser ? 'auto' : 0,
          }}
        >
          {timestamp}
        </span>
      )}
    </div>
  );
}