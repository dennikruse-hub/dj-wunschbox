export default function PayPalSupport() {
  return (
    <div style={styles.box}>
      <div style={styles.text}>
        💚 Unterstütze DJ Dennis
      </div>

      <a
        href="https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG"
        target="_blank"
        rel="noreferrer"
        style={styles.button}
      >
        💸 Trinkgeld geben
      </a>
    </div>
  );
}

const styles = {
  box: {
    marginTop: 12,
    padding: 12,
    borderRadius: 18,
    background: 'linear-gradient(135deg,rgba(0,0,0,.38),rgba(29,185,84,.12))',
    border: '1px solid rgba(29,185,84,.35)',
    textAlign: 'center'
  },
  text: {
    fontWeight: 900,
    marginBottom: 10,
    color: '#7dffad'
  },
  button: {
    display: 'block',
    padding: 13,
    borderRadius: 15,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 900,
    boxShadow: '0 0 25px rgba(29,185,84,.35)'
  }
};
