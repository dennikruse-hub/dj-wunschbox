export default function PremiumHeader() {
  return (
    <>
      <style jsx global>{`
        @keyframes eq {
          0%,100% { transform: scaleY(.35); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      <div style={styles.top}>
        <div style={styles.badge}>● LIVE</div>
        <div style={styles.spotify}>Spotify</div>
      </div>

      <header style={styles.header}>
        <div style={styles.logo}>🎧</div>

        <div style={styles.text}>
          <div style={styles.dj}>DJ DENNIS</div>
          <h1 style={styles.title}>Wunschbox</h1>
          <p style={styles.sub}>
            Wünsch dir deinen Song direkt in die Spotify-Playlist.
          </p>

          <div style={styles.eq}>
            {[1,2,3,4,5,6,7].map(i => (
              <span key={i} style={{ ...styles.bar, animationDelay: `${i * .1}s` }} />
            ))}
          </div>
        </div>
      </header>

      <div style={styles.guests}>👥 128 GÄSTE ONLINE</div>
    </>
  );
}

const styles = {
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  badge: {
    padding: '7px 12px',
    borderRadius: 12,
    background: 'rgba(29,185,84,.18)',
    border: '1px solid rgba(29,185,84,.7)',
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 13
  },
  spotify: {
    padding: '7px 12px',
    borderRadius: 12,
    background: 'rgba(29,185,84,.12)',
    border: '1px solid rgba(29,185,84,.45)',
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 13
  },
  header: {
    display: 'flex',
    gap: 14,
    alignItems: 'center'
  },
  logo: {
    width: 82,
    height: 82,
    minWidth: 82,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 38,
    boxShadow: '0 0 30px #1db954, 0 0 45px rgba(124,58,237,.65)'
  },
  text: {
    flex: 1
  },
  dj: {
    color: '#1db954',
    fontWeight: 900,
    letterSpacing: 4,
    fontSize: 14
  },
  title: {
    margin: '2px 0',
    fontSize: 38,
    lineHeight: 1,
    fontWeight: 900
  },
  sub: {
    margin: 0,
    opacity: .78,
    lineHeight: 1.35,
    fontSize: 15
  },
  eq: {
    display: 'flex',
    gap: 4,
    height: 26,
    alignItems: 'end',
    marginTop: 8
  },
  bar: {
    width: 5,
    height: 24,
    borderRadius: 10,
    background: 'linear-gradient(#35ff75,#7c3aed)',
    transformOrigin: 'bottom',
    animation: 'eq .8s infinite ease-in-out'
  },
  guests: {
    textAlign: 'center',
    fontWeight: 900,
    margin: '18px 0 14px',
    fontSize: 16
  }
};
