export default function BackgroundGlow() {
  return (
    <>
      <style jsx global>{`
        @keyframes floatOne {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(35px,25px) scale(1.08); }
        }
        @keyframes floatTwo {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px,-25px) scale(1.1); }
        }
        @keyframes moveGrid {
          0% { background-position: 0 0; }
          100% { background-position: 70px 70px; }
        }
      `}</style>

      <div style={styles.base}></div>
      <div style={styles.grid}></div>
      <div style={styles.green}></div>
      <div style={styles.purple}></div>
      <div style={styles.blue}></div>
      <div style={styles.vignette}></div>
    </>
  );
}

const styles = {
  base: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg,#03040a,#090014 45%,#020503)',
    zIndex: 0
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
    backgroundSize: '70px 70px',
    animation: 'moveGrid 20s linear infinite',
    opacity: .25,
    zIndex: 0
  },
  green: {
    position: 'fixed',
    top: -140,
    left: -130,
    width: 440,
    height: 440,
    borderRadius: '50%',
    background: '#1db95477',
    filter: 'blur(105px)',
    animation: 'floatOne 8s ease-in-out infinite',
    zIndex: 0
  },
  purple: {
    position: 'fixed',
    right: -150,
    bottom: -130,
    width: 520,
    height: 520,
    borderRadius: '50%',
    background: '#7c3aed88',
    filter: 'blur(120px)',
    animation: 'floatTwo 9s ease-in-out infinite',
    zIndex: 0
  },
  blue: {
    position: 'fixed',
    top: '38%',
    left: '45%',
    width: 270,
    height: 270,
    borderRadius: '50%',
    background: '#00e5ff33',
    filter: 'blur(95px)',
    zIndex: 0
  },
  vignette: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,.75) 100%)',
    zIndex: 0
  }
};
