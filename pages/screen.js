export default function Screen() {
  return (
    <div style={styles.page}>
      <h1>🎧 DJ SCREEN</h1>
      <p>Live Anzeige aktiv</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#1db954',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial'
  }
};
