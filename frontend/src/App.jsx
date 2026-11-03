import { useState } from 'react';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Chat from './pages/Chat';
import MathsAdventure from './pages/MathsAdventure';
import ScienceExplorer from './pages/ScienceExplorer';
import EnglishPractice from './pages/EnglishPractice';
import Quiz from './pages/Quiz';
import BrainGym from './pages/BrainGym';
import StoryTime from './pages/StoryTime';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import StudIQMascot from './components/StudIQMascot';

const ROUTES = {
  WELCOME: 'welcome',
  HOME: 'home',
  CHAT: 'chat',
  MATHS: 'maths',
  SCIENCE: 'science',
  ENGLISH: 'english',
  QUIZ: 'quiz',
  BRAIN: 'brain',
  STORY: 'story',
  PROGRESS: 'progress',
  SETTINGS: 'settings',
};

export default function App() {
  const [page, setPage] = useState(ROUTES.WELCOME);
  const [language, setLanguage] = useState('english');

  return (
    <div className="app">
      <StudIQMascot expression="happy" />
      {page === ROUTES.WELCOME && (
        <Welcome onStart={setHome} setLanguage={setLanguage} />
      )}
      {page === ROUTES.HOME && <Home onNavigate={setPage} language={language} />}
      {page === ROUTES.CHAT && <Chat language={language} onDashboard={() => setPage(ROUTES.HOME)} />}
      {page === ROUTES.MATHS && <MathsAdventure language={language} />}
      {page === ROUTES.SCIENCE && <ScienceExplorer language={language} />}
      {page === ROUTES.ENGLISH && <EnglishPractice language={language} />}
      {page === ROUTES.QUIZ && <Quiz language={language} />}
      {page === ROUTES.BRAIN && <BrainGym language={language} />}
      {page === ROUTES.STORY && <StoryTime language={language} />}
      {page === ROUTES.PROGRESS && <Progress />}
      {page === ROUTES.SETTINGS && <Settings language={language} setLanguage={setLanguage} />}
      {page !== ROUTES.WELCOME && page !== ROUTES.HOME && page !== ROUTES.CHAT && (
        <button className="app-home-button" onClick={() => setPage(ROUTES.HOME)}>
          ← Back to dashboard
        </button>
      )}
    </div>
  );

  function setHome() {
    setPage(ROUTES.HOME);
  }
}
