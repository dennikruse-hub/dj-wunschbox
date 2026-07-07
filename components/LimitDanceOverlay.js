export default function LimitDanceOverlay({ resetText, animationText }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.disco}>🪩</div>
      <h1 style={styles.title}>Nicht warten – tanzen!</h1>
      <div style={styles.dancer}>🕺</div>
      <div style={styles.timer}>⏳ Neue Wünsche in {resetText}</div>
      <div style={styles.small}>Animation endet in {animationText}</div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    background: 'radial-gradient(circle at top,#7c3aed55,transparent 35%), radial-gradient(circle at bottom,#1db95455,transparent 35%), #050008',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20
  },
  disco: { fontSize: 70 },
  title: {
    fontSize: 42,
    color: '#ff4fd8',
    textShadow: '0 0 25px #ff4fd8',
    margin: '20px 0'
  },
  dancer: {
    fontSize: 110,
    animation: 'bounce 1s infinite'
  },
  timer: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 900,
    color: '#35ff75'
  },
  small: {
    marginTop: 10,
    opacity: 0.8
  }
};
