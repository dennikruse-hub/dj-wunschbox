export default function SuccessOverlay({ status, onClose }) {
  if (!status || status.type !== 'success') return null;

  const track = status.track;

  return (
    <>
      <style jsx global>{`
        @keyframes popIn {
          0% { transform: scale(.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes fall {
          0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(360px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <div style={styles.overlay}>
        <div style={styles.confetti}>
          {['🎉','✨','💚','🎵','🪩','🔥','🎊','⭐'].map((c, i) => (
            <span key={i} style={{ ...styles.piece, left: `${10 + i * 11}%`, animationDelay: `${i * .15}s` }}>
              {c}
            </span>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.check}>✅</div>
          <h1 style={styles.title}>Wunsch übermittelt</h1>

          {track?.image && (
            <img src={track.image} style={styles.cover} />
          )}

          <h2 style={styles.song}>{track?.title}</h2>
          <p style={styles.artist}>{track?.artist}</p>

          <div style={styles.message}>
            Dein Song ist bei DJ Dennis angekommen.
          </div>

          <div style={styles.hint}>
            📋 Du kannst jetzt die Warteliste ansehen<br />
            ❤️ und Songs liken
          </div>

          <button style={styles.button} onClick={onClose}>
            Zurück zur Wunschbox
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    background: 'rgba(0,0,0,.72)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 380,
    padding: 24,
    borderRadius: 30,
    background:
      'radial-gradient(circle at top,rgba(29,185,84,.32),transparent 38%), rgba(2,6,23,.95)',
    border: '1px solid rgba(53,255,117,.55)',
    boxShadow: '0 0 65px rgba(29,185,84,.45)',
    textAlign: 'center',
    color: 'white',
    animation: 'popIn .35s ease-out'
  },
  check: {
    fontSize: 54,
    marginBottom: 8
  },
  title: {
    margin: '0 0 14px',
    fontSize: 30,
    textTransform: 'uppercase'
  },
  cover: {
    width: 160,
    height: 160,
    objectFit: 'cover',
    borderRadius: 24,
    boxShadow: '0 0 35px rgba(29,185,84,.45)',
    marginBottom: 14
  },
  song: {
    margin: '8px 0 4px',
    fontSize: 24
  },
  artist: {
    margin: 0,
    opacity: .75
  },
  message: {
    marginTop: 16,
    fontWeight: 900,
    color: '#7dffad'
  },
  hint: {
    marginTop: 14,
    lineHeight: 1.5,
    opacity: .85
  },
  button: {
    marginTop: 18,
    width: '100%',
    padding: 14,
    borderRadius: 16,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },
  confetti: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none'
  },
  piece: {
    position: 'absolute',
    top: 0,
    fontSize: 26,
    animation: 'fall 2.5s linear forwards'
  }
};
