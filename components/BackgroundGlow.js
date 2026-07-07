export default function BackgroundGlow() {
  return (
    <>
      <style jsx global>{`
        @keyframes moveGlowA {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(35px,25px) scale(1.1); }
        }

        @keyframes moveGlowB {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px,-35px) scale(1.12); }
        }

        @keyframes starsMove {
          0% { background-position: 0 0; }
          100% { background-position: 180px 260px; }
        }

        @keyframes pulseLight {
          0%,100% { opacity: .25; }
          50% { opacity: .65; }
        }
      `}</style>

      <div style={styles.base}></div>
      <div style={styles.stars}></div>
      <div style={styles.green}></div>
      <div style={styles.purple}></div>
      <div style={styles.blue}></div>
      <div style={styles.centerLight}></div>
      <div style={styles.vignette}></div>
    </>
  );
}

const styles = {
  base: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at top,#14213d 0%,#050816 40%,#02030a 100%)',
    zIndex: 0
  },
  stars: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle,rgba(255,255,255,.8) 1px,transparent 1px), radial-gradient(circle,rgba(125,255,173,.55) 1px,transparent 1px)',
    backgroundSize: '90px 130px, 130px 170px',
    opacity: .22,
    animation: 'starsMove 28s linear infinite',
    zIndex: 0
  },
  green: {
    position: 'fixed',
    top: -120,
    left: -120,
    width: 420,
    height: 420,
    borderRadius: '50%',
    background: '#1db95488',
    filter: 'blur(105px)',
    animation: 'moveGlowA 8s ease-in-out infinite',
    zIndex: 0
  },
  purple: {
    position: 'fixed',
    right: -160,
    bottom: -140,
    width: 520,
    height: 520,
    borderRadius: '50%',
    background: '#7c3aed99',
    filter: 'blur(120px)',
    animation: 'moveGlowB 9s ease-in-out infinite',
    zIndex: 0
  },
  blue: {
    position: 'fixed',
    top: '38%',
    left: '45%',
    width: 280,
    height: 280,
    borderRadius: '50%',
    background: '#00e5ff44',
    filter: 'blur(90px)',
    animation: 'pulseLight 5s ease-in-out infinite',
    zIndex: 0
  },
  centerLight: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at center,rgba(255,255,255,.10),transparent 35%)',
    zIndex: 0
  },
  vignette: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at center,transparent 42%,rgba(0,0,0,.78) 100%)',
    zIndex: 0
  }
};
