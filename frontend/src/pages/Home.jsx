import { useEffect, useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import ChikuMascot from '../components/ChikuMascot';

const FEATURES = [
  {
    icon: '💬',
    title: 'Chat with Chiku',
    description: 'Ask questions and get friendly answers.',
    route: 'chat',
  },
  {
    icon: '🔢',
    title: 'Maths Adventure',
    description: 'Practice counting, addition, and more.',
    route: 'maths',
  },
  {
    icon: '🔬',
    title: 'Science Explorer',
    description: 'Discover fun facts about space, animals, and nature.',
    route: 'science',
  },
  {
    icon: '📚',
    title: 'English Practice',
    description: 'Learn words, sentences, and grammar.',
    route: 'english',
  },
  {
    icon: '🧠',
    title: 'General Knowledge Quiz',
    description: 'Test your knowledge with fun quizzes.',
    route: 'quiz',
  },
  {
    icon: '🧩',
    title: 'Brain Gym',
    description: 'Riddles, patterns, and logic puzzles.',
    route: 'brain',
  },
  {
    icon: '📖',
    title: 'Story Time',
    description: 'Read cute stories with morals.',
    route: 'story',
  },
  {
    icon: '🏆',
    title: 'My Progress',
    description: 'See what you have learned.',
    route: 'progress',
  },
];

export default function Home({ onNavigate, language }) {
  const [suggestion, setSuggestion] = useState(
    "Today's suggestion: Try Chat with Chiku!"
  );

  const suggestions = [
    "Today's suggestion: Try Chat with Chiku!",
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
    <div style={containerStyle()}>
      <div style={headerStyle()}>
        <ChikuMascot expression="happy" />
        <div>
          <h1 style={titleStyle()}>Chiku's Learning World</h1>
          <p style={subtitleStyle()}>Pick an adventure, {language} learner!</p>
        </div>
        <button style={settingsButtonStyle()} onClick={() => onNavigate('settings')} aria-label="Settings">
          ⚙
        </button>
      </div>

      <p style={suggestionStyle()}>{suggestion}</p>

      <div style={gridStyle()}>
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

      <div style={footerStyle()}>
        <p>Made with ❤️ for curious kids aged 6–10</p>
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
      marginBottom: '24px',
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
