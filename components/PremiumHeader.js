export default function PremiumHeader() {
  return (
    <>
      <style jsx global>{`
        @keyframes eq {
          0%,100% { transform: scaleY(.32); }
          50% { transform: scaleY(1); }
        }

        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 22px #1db954, 0 0 45px rgba(124,58,237,.7); }
          50% { box-shadow: 0 0 42px #35ff75, 0 0 80px rgba(124,58,237,1); }
        }

        @keyframes livePulse {
          0%,100% { opacity: .65; }
          50% { opacity: 1; }
        }
      `}</style>

      <div style={styles.top}>
        <div style={styles.badge}>
          <span style={styles.dot}></span>
          LIVE PARTY
        </div>

        <div style={styles.spotify}>Spotify connected</div>
      </div>

      <header style={styles.header}>
        <div style={styles.logo}>🎧</div>

        <div style={styles.text}>
          <div style={styles.dj}>DJ DENNIS</div>
          <h1 style={styles.title}>Wunschbox</h1>
          <p style={styles.sub}>Scanne, suche und sende deinen Musikwunsch direkt an den DJ.</p>

          <div style={styles.eq}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <span key={i} style={{ ...styles.bar, animationDelay: `${i * .08}s` }} />
            ))}
          </div>
        </div>
      </header>
    </>
  );
}

const styles = {
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '7px 11px',
    borderRadius: 999,
    background: 'rgba(29,185,84,.18)',
    border: '1px solid rgba(29,185,84,.7)',
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 12
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#35ff75',
    boxShadow: '0 0 14px #35ff75',
    animation: 'livePulse 1.3s infinite'
  },
  spotify: {
    padding: '7px 11px',
    borderRadius: 999,
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.14)',
    color: '#dfffe8',
    fontWeight: 800,
    fontSize: 12
  },
  header: {
    display: 'flex',
    gap: 13,
    alignItems: 'center',
    marginBottom: 12
  },
  logo: {
    width: 76,
    height: 76,
    minWidth: 76,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#1db954,#00e5ff,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 35,
    animation: 'glowPulse 2.6s ease-in-out infinite',
    border: '1px solid rgba(255,255,255,.45)'
  },
  text: {
    flex: 1
  },
  dj: {
    color: '#7dffad',
    fontWeight: 900,
    letterSpacing: 3,
    fontSize: 13
  },
  title: {
    margin: '1px 0',
    fontSize: 36,
    lineHeight: 1,
    fontWeight: 900,
    textShadow: '0 0 24px rgba(29,185,84,.45)'
  },
  sub: {
    margin: 0,
    opacity: .8,
    lineHeight: 1.25,
    fontSize: 13
  },
  eq: {
    display: 'flex',
    gap: 4,
    height: 24,
    alignItems: 'end',
    marginTop: 7
  },
  bar: {
    width: 5,
    height: 23,
    borderRadius: 10,
    background: 'linear-gradient(#35ff75,#00e5ff,#7c3aed)',
    transformOrigin: 'bottom',
    animation: 'eq .85s infinite ease-in-out',
    boxShadow: '0 0 10px rgba(53,255,117,.8)'
  }
};
