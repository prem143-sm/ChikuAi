import { useEffect, useState } from 'react';
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
import { firebaseApp, firebaseConfigured, signInWithGoogle, signOutUser } from './services/firebase';
import { getGrade, setGrade as saveGrade, syncGuestProgress } from './services/progress';

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

const ACTIVITY_ROUTES = [
  ROUTES.MATHS,
  ROUTES.SCIENCE,
  ROUTES.ENGLISH,
  ROUTES.QUIZ,
  ROUTES.BRAIN,
  ROUTES.STORY,
];

function getInitialPage() {
  try {
    const savedPage = sessionStorage.getItem('StudIQ-current-activity');
    return ACTIVITY_ROUTES.includes(savedPage) ? savedPage : ROUTES.WELCOME;
  } catch {
    return ROUTES.WELCOME;
  }
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);
  const [language, setLanguage] = useState('english');
  const [grade, setGrade] = useState('5');
  const [user, setUser] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authReady, setAuthReady] = useState(() => !firebaseConfigured);
  const monitorAuth = firebaseConfigured && page !== ROUTES.WELCOME;

  useEffect(() => {
    if (!monitorAuth) {
      setAuthReady(true);
      return undefined;
    }
    let active = true;
    let unsubscribe;
    setAuthReady(false);
    import('firebase/auth').then(({ getAuth, onAuthStateChanged }) => {
      if (!active) return;
      unsubscribe = onAuthStateChanged(getAuth(firebaseApp), async (account) => {
        try {
          await syncGuestProgress(account);
          const savedGrade = await getGrade(account);
          if (!active) return;
          setUser(account);
          setGrade(savedGrade);
          setAuthError('');
        } catch (error) {
          if (!active) return;
          setUser(account);
          setAuthError(`Could not sync account data: ${error.message}`);
        } finally {
          if (active) setAuthReady(true);
        }
      }, (error) => {
        if (!active) return;
        setAuthReady(true);
        setAuthError(`Sign-in status could not be loaded: ${error.message}`);
      });
    }).catch((error) => {
      setAuthReady(true);
      setAuthError(`Google sign-in could not be initialized: ${error.message}`);
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [monitorAuth]);

  function navigate(nextPage) {
    if (firebaseConfigured && page === ROUTES.WELCOME && nextPage !== ROUTES.WELCOME) {
      setAuthReady(false);
    }
    setPage(nextPage);
    try {
      if (ACTIVITY_ROUTES.includes(nextPage)) {
        sessionStorage.setItem('StudIQ-current-activity', nextPage);
      } else {
        sessionStorage.removeItem('StudIQ-current-activity');
      }
    } catch (error) {
      setAuthError(`This browser could not remember the current activity: ${error.message}`);
    }
  }

  useEffect(() => {
    if (user) return undefined;
    let active = true;
    getGrade(null).then((savedGrade) => {
      if (active) setGrade(savedGrade);
    }).catch((error) => {
      if (active) setAuthError(`Could not load the saved grade: ${error.message}`);
    });
    return () => {
      active = false;
    };
  }, [user]);

  async function handleSignIn() {
    setAuthBusy(true);
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(error.message || 'Google sign-in failed. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    setAuthBusy(true);
    setAuthError('');
    try {
      await signOutUser();
    } catch (error) {
      setAuthError(error.message || 'Could not sign out. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleGradeChange(nextGrade) {
    setGrade(nextGrade);
    setAuthError('');
    try {
      await saveGrade(nextGrade, user);
    } catch (error) {
      setAuthError(`Could not save the selected grade: ${error.message}`);
    }
  }

  return (
    <div className="app">
      <StudIQMascot expression="happy" />
      {firebaseConfigured && !authReady && page !== ROUTES.WELCOME && (
        <p role="status" style={{ textAlign: 'center', margin: '24px' }}>Checking account and loading your learning data…</p>
      )}
      {(!firebaseConfigured || authReady || page === ROUTES.WELCOME) && page === ROUTES.WELCOME && (
        <Welcome
          onStart={setHome}
          setLanguage={setLanguage}
          grade={grade}
          onGradeChange={handleGradeChange}
        />
      )}
      {(!firebaseConfigured || authReady) && page === ROUTES.HOME && (
        <Home
          onNavigate={navigate}
          language={language}
          grade={grade}
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          authBusy={authBusy || !authReady}
          authError={authError}
          firebaseConfigured={firebaseConfigured}
        />
      )}
      {(!firebaseConfigured || authReady) && page === ROUTES.CHAT && <Chat language={language} onDashboard={() => navigate(ROUTES.HOME)} />}
      {(!firebaseConfigured || authReady) && page === ROUTES.MATHS && <MathsAdventure language={language} grade={grade} user={user} />}
      {(!firebaseConfigured || authReady) && page === ROUTES.SCIENCE && <ScienceExplorer language={language} grade={grade} user={user} />}
      {(!firebaseConfigured || authReady) && page === ROUTES.ENGLISH && <EnglishPractice language={language} grade={grade} user={user} />}
      {(!firebaseConfigured || authReady) && page === ROUTES.QUIZ && <Quiz language={language} grade={grade} user={user} />}
      {(!firebaseConfigured || authReady) && page === ROUTES.BRAIN && <BrainGym language={language} grade={grade} user={user} />}
      {(!firebaseConfigured || authReady) && page === ROUTES.STORY && <StoryTime language={language} grade={grade} user={user} />}
      {(!firebaseConfigured || authReady) && page === ROUTES.PROGRESS && <Progress user={user} />}
      {(!firebaseConfigured || authReady) && page === ROUTES.SETTINGS && (
        <Settings
          language={language}
          setLanguage={setLanguage}
          user={user}
        />
      )}
      {(!firebaseConfigured || authReady)
        && page !== ROUTES.WELCOME && page !== ROUTES.HOME && page !== ROUTES.CHAT && (
        <button className="app-home-button" onClick={() => navigate(ROUTES.HOME)}>
          ← Back to dashboard
        </button>
      )}
    </div>
  );

  function setHome() {
    navigate(ROUTES.HOME);
  }
}
