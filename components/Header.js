export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>🎧</div>

      <div>
        <div style={styles.dj}>DJ DENNIS</div>
        <div style={styles.title}>WUNSCHBOX</div>
      </div>

      <div style={styles.spotify}>● Spotify<br />verbunden</div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22
  },
  logo: {
    fontSize: 52,
    filter: 'drop-shadow(0 0 15px #1db954)'
  },
  dj: {
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: 1
  },
  title: {
    color: '#1db954',
    fontSize: 25,
    fontWeight: 900,
    letterSpacing: 1
  },
  spotify: {
    marginLeft: 'auto',
    border: '1px solid #1db954',
    borderRadius: 14,
    padding: '9px 12px',
    color: '#dfffe8',
    fontSize: 13,
    textAlign: 'center'
  }
};
