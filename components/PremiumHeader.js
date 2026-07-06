export default function PremiumHeader() {
  return (
    <>
      <style jsx global>{`
        @keyframes eq {
          0%,100% { transform: scaleY(.45); }
          50% { transform: scaleY(1); }
        }
        @keyframes pulseLive {
          0%,100% { opacity: .6; box-shadow: 0 0 8px #1db954; }
          50% { opacity: 1; box-shadow: 0 0 20px #1db954; }
        }
      `}</style>

      <div style={styles.topRow}>
        <div style={styles.liveBadge}>
          <span style={styles.liveDot}></span>
          LIVE PARTY MODE
        </div>

        <div style={styles.spotifyBadge}>Spotify verbunden</div>
      </div>

      <header style={styles.header}>
        <div style={styles.logoCircle}>🎧</div>

        <div style={styles.textBox}>
          <div style={styles.dj}>DJ DENNIS</div>
          <h1 style={styles.title}>Wunschbox</h1>
          <p style={styles.subtitle}>
            Wünsch dir deinen Song direkt in die Spotify-Playlist.
          </p>

          <div style={styles.equalizer}>
            {[1,2,3,4,5,6,7].map(i => (
              <span key={i} style={{ ...styles.bar, animationDelay: `${i * .12}s` }}></span>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}

const styles = {
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
    marginBottom: 18
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(29,185,84,.18)',
    border: '1px solid rgba(29,185,84,.5)',
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 12
  },
  liveDot: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    background: '#1db954',
    animation: 'pulseLive 1.4s infinite'
  },
  spotifyBadge: {
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.14)',
    color: '#dfffe8',
    fontWeight: 800,
    fontSize: 12
  },
  header: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    marginBottom: 24
  },
  logoCircle: {
    width: 74,
    height: 74,
    minWidth: 74,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    boxShadow: '0 0 45px rgba(29,185,84,.55)'
  },
  textBox: { flex: 1 },
  dj: {
    color: '#1db954',
    fontWeight: 900,
    letterSpacing: 2,
    fontSize: 14
  },
  title: {
    margin: '2px 0',
    fontSize: 44,
    lineHeight: 1
  },
  subtitle: {
    margin: 0,
    opacity: .72,
    lineHeight: 1.4
  },
  equalizer: {
    display: 'flex',
    gap: 5,
    alignItems: 'end',
    height: 32,
    marginTop: 12
  },
  bar: {
    width: 5,
    height: 28,
    borderRadius: 999,
    background: 'linear-gradient(#7dffad,#1db954)',
    transformOrigin: 'bottom',
    animation: 'eq .9s ease-in-out infinite',
    boxShadow: '0 0 12px rgba(29,185,84,.8)'
  }
};
