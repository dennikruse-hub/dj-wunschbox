export default function QR() {
  return (
    <div style={styles.page}>
      <h1>📱 QR CODE PAGE</h1>
      <p>Hier kommt später dein QR Code</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0b0b0b',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial'
  }
};
