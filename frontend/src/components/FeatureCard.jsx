export default function FeatureCard({ icon, title, description, onClick }) {
  return (
    <div
      className="feature-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <span className="feature-icon" aria-hidden="true">{icon}</span>
      <div className="feature-card-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="feature-card-arrow" aria-hidden="true">→</span>
    </div>
  );
}
