import ChatWindow from '../components/ChatWindow';

export default function Chat({ language, onDashboard }) {
  return <ChatWindow language={language} onDashboard={onDashboard} />;
}