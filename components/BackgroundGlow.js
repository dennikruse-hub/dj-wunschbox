export default function BackgroundGlow() {
  return (
    <>
      <style jsx global>{`
        @keyframes floatOne {
          0% { transform: translate(0, 0) scale(1); opacity: .75; }
          50% { transform: translate(35px, 28px) scale(1.08); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: .75; }
        }

        @keyframes floatTwo {
          0% { transform: translate(0, 0) scale(1); opacity: .65; }
          50% { transform: translate(-30px, -25px) scale(1.1); opacity: .95; }
          100% { transform: translate(0, 0) scale(1); opacity: .65; }
        }

        @keyframes pulseGlow {
          0% { opacity: .25; transform: scale(1); }
          50% { opacity: .55; transform: scale(1.12); }
          100% { opacity: .25; transform: scale(1); }
        }

        @keyframes moveGrid {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
      `}</style>

      <div style={styles.base}></div>
      <div style={styles.grid}></div>
      <div style={styles.glowGreen}></div>
      <div style={styles.glowPurple}></div>
      <div style={styles.glowBlue}></div>
      <div style={styles.vignette}></div>
    </>
  );
}

const styles = {
  base: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at 50% 0%, rgba(124,58,237,.28), transparent 38%), linear-gradient(135deg,#03040a,#090014 45%,#020503)',
    zIndex: 0
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    animation: 'moveGrid 18s linear infinite',
    opacity: .28,
    zIndex: 0
  },
  glowGreen: {
    position: 'fixed',
    top: -130,
    left: -140,
    width: 430,
    height: 430,
    borderRadius: '50%',
    background: '#1db95477',
    filter: 'blur(100px)',
    animation: 'floatOne 8s ease-in-out infinite',
    zIndex: 0
  },
  glowPurple: {
    position: 'fixed',
    right: -160,
    bottom: -130,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: '#7c3aed88',
    filter: 'blur(115px)',
    animation: 'floatTwo 9s ease-in-out infinite',
    zIndex: 0
  },
  glowBlue: {
    position: 'fixed',
    top: '38%',
    left: '45%',
    width: 260,
    height: 260,
    borderRadius: '50%',
    background: '#00e5ff44',
    filter: 'blur(95px)',
    animation: 'pulseGlow 5s ease-in-out infinite',
    zIndex: 0
  },
  vignette: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,.72) 100%)',
    zIndex: 0,
    pointerEvents: 'none'
  }
};
