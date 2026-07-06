export default function BackgroundGlow() {
  return (
    <>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>
      <div style={styles.glowThree}></div>
      <div style={styles.noise}></div>
    </>
  );
}

const styles = {
  glowOne: {
    position: 'fixed',
    top: -120,
    left: -120,
    width: 380,
    height: 380,
    background: '#1db95466',
    filter: 'blur(100px)',
    borderRadius: '50%',
    animation: 'float 7s ease-in-out infinite',
    zIndex: 0
  },
  glowTwo: {
    position: 'fixed',
    right: -140,
    bottom: -120,
    width: 440,
    height: 440,
    background: '#7c3aed77',
    filter: 'blur(110px)',
    borderRadius: '50%',
    animation: 'float 9s ease-in-out infinite reverse',
    zIndex: 0
  },
  glowThree: {
    position: 'fixed',
    top: '35%',
    left: '45%',
    width: 220,
    height: 220,
    background: '#00e5ff33',
    filter: 'blur(90px)',
    borderRadius: '50%',
    animation: 'pulseGlow 5s ease-in-out infinite',
    zIndex: 0
  },
  noise: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at 20% 20%, rgba(255,255,255,.05), transparent 25%), radial-gradient(circle at 80% 30%, rgba(255,255,255,.04), transparent 25%)',
    opacity: 0.4,
    pointerEvents: 'none',
    zIndex: 0
  }
};
