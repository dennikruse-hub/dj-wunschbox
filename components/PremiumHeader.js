export default function PremiumHeader() {
  return (
    <>
      <div style={styles.topRow}>
        <div style={styles.liveBadge}>
          <span style={styles.liveDot}></span>
          LIVE PARTY MODE
        </div>

        <div style={styles.spotifyBadge}>
          Spotify verbunden
        </div>
      </div>

      <header style={styles.header}>
        <div style={styles.logoCircle}>
          🎧
          <div style={styles.logoGlow}></div>
        </div>

        <div style={styles.textBox}>
          <div style={styles.dj}>DJ DENNIS</div>
          <h1 style={styles.title}>Wunschbox</h1>
          <p style={styles.subtitle}>
            Wünsch dir deinen Song direkt in die Spotify-Playlist.
          </p>

          <div style={styles.equalizer}>
            <span style={{ ...styles.bar, height: 12 }}></span>
            <span style={{ ...styles.bar, height: 22 }}></span>
            <span style={{ ...styles.bar, height: 16 }}></span>
            <span style={{ ...styles.bar, height: 28 }}></span>
            <span style={{ ...styles.bar, height: 18 }}></span>
            <span style={{ ...styles.bar, height: 24 }}></span>
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
    background: 'rgba(29,185,84,0.18)',
    border: '1px solid rgba(29,185,84,0.5)',
    color: '#7dffad',
    fontWeight: 'bold',
    fontSize: 12
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#1db954',
    boxShadow: '0 0 12px #1db954'
  },
  spotifyBadge: {
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#dfffe8',
    fontWeight: 'bold',
    fontSize: 12
  },
  header: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    marginBottom: 24
  },
  logoCircle: {
    width: 72,
    height: 72,
    minWidth: 72,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    boxShadow: '0 0 38px rgba(29,185,84,0.55)',
    position: 'relative'
  },
  logoGlow: {
    position: 'absolute',
    inset: -8,
    borderRadius: '50%',
    border: '1px solid rgba(29,185,84,0.35)'
  },
  textBox: {
    flex: 1
  },
  dj: {
    color: '#1db954',
    fontWeight: 900,
    letterSpacing: 2,
    fontSize: 14
  },
  title: {
    margin: '3px 0',
    fontSize: 44,
    lineHeight: 1
  },
  subtitle: {
    margin: 0,
    opacity: 0.72,
    lineHeight: 1.4
  },
  equalizer: {
    display: 'flex',
    gap: 4,
    alignItems: 'end',
    height: 30,
    marginTop: 12
  },
  bar: {
    width: 5,
    borderRadius: 999,
    background: 'linear-gradient(#7dffad,#1db954)',
    boxShadow: '0 0 10px rgba(29,185,84,0.7)'
  }
};
