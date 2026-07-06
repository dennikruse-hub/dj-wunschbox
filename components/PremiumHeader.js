export default function PremiumHeader() {
  return (
    <>
      <div style={styles.topBadge}>● LIVE PARTY MODE</div>

      <header style={styles.header}>
        <div style={styles.logoCircle}>🎧</div>

        <div>
          <div style={styles.dj}>DJ DENNIS</div>
          <h1 style={styles.title}>Wunschbox</h1>
          <p style={styles.subtitle}>
            Wünsch dir deinen Song direkt in die Spotify-Playlist.
          </p>
        </div>
      </header>
    </>
  );
}

const styles = {
  topBadge: {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: 999,
    background: 'rgba(29,185,84,0.18)',
    border: '1px solid rgba(29,185,84,0.5)',
    color: '#7dffad',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 18
  },
  header: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    marginBottom: 22
  },
  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    boxShadow: '0 0 35px rgba(29,185,84,0.45)'
  },
  dj: {
    color: '#1db954',
    fontWeight: 900,
    letterSpacing: 2,
    fontSize: 14
  },
  title: {
    margin: '2px 0',
    fontSize: 42,
    lineHeight: 1
  },
  subtitle: {
    margin: 0,
    opacity: 0.72,
    lineHeight: 1.4
  }
};
