export default function ChikuMascot({ expression = 'happy', size = 'regular' }) {
  return (
    <div className={`mascot-wrapper mascot-wrapper--${size} mascot-wrapper--${expression}`}>
      <img
        className="mascot-image"
        src="/chiku-mascot.png"
        alt="Chiku, a winking learning buddy"
      />
    </div>
  );
}
