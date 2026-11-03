export default function ProgressCard({ stats }) {
  return (
    <div style={cardStyle()}>
      {stats.map((stat, i) => (
        <div key={i} className="progress-stat">
          <span className="value">{stat.value}</span>
          <span className="label">{stat.label}</span>
        </div>
      ))}
    </div>
  );

  function cardStyle() {
    return {
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '24px',
      background: '#fff',
      borderRadius: '24px',
      boxShadow: '0 4px 12px rgba(38,50,74,0.12)',
      border: '1px solid rgba(255,255,255,0.5)',
    };
  }
}