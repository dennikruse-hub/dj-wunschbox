export default function PremiumHeader() {
  return (
    <>
      <style jsx global>{`
        @keyframes eq {
          0%,100% { transform: scaleY(.35); }
          50% { transform: scaleY(1); }
        }
        @keyframes ringPulse {
          0%,100% { box-shadow: 0 0 22px #1db954, 0 0 45px rgba(124,58,237,.55); }
          50% { box-shadow: 0 0 38px #35ff75, 0 0 70px rgba(124,58,237,.8); }
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
          <p style={styles.sub}>Wünsch dir deinen Song direkt in die Spotify-Playlist.</p>

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
    marginBottom: 10
  },
  badge: {
    padding: '6px 11px',
    borderRadius: 12,
    background: 'rgba(29,185,84,.18)',
    border: '1px solid rgba(29,185,84,.7)',
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 12
  },
  spotify: {
    padding: '6px 11px',
    borderRadius: 12,
    background: 'rgba(29,185,84,.12)',
    border: '1px solid rgba(29,185,84,.45)',
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 12
  },
  header: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  logo: {
    width: 74,
    height: 74,
    minWidth: 74,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 34,
    animation: 'ringPulse 2.4s infinite',
    border: '1px solid rgba(255,255,255,.4)'
  },
  text: {
    flex: 1
  },
  dj: {
    color: '#1db954',
    fontWeight: 900,
    letterSpacing: 4,
    fontSize: 13
  },
  title: {
    margin: '1px 0',
    fontSize: 34,
    lineHeight: 1,
    fontWeight: 900
  },
  sub: {
    margin: 0,
    opacity: .78,
    lineHeight: 1.25,
    fontSize: 14
  },
  eq: {
    display: 'flex',
    gap: 4,
    height: 23,
    alignItems: 'end',
    marginTop: 6
  },
  bar: {
    width: 5,
    height: 22,
    borderRadius: 10,
    background: 'linear-gradient(#35ff75,#7c3aed)',
    transformOrigin: 'bottom',
    animation: 'eq .8s infinite ease-in-out'
  },
  guests: {
    textAlign: 'center',
    fontWeight: 900,
    margin: '14px 0 11px',
    fontSize: 15
  }
};
