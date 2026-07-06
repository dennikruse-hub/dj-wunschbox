export default function PayPalSupport() {
  return (
    <div style={styles.paypalCard}>
      <div>
        <b>💚 DJ Support</b>
        <p style={styles.payText}>
          Wenn dir die Musik gefällt, kannst du DJ Dennis unterstützen.
        </p>
      </div>

      <a
        href="https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG"
        target="_blank"
        rel="noreferrer"
        style={styles.paypal}
      >
        💸 Trinkgeld geben
      </a>
    </div>
  );
}

const styles = {
  paypalCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 22,
    background: 'linear-gradient(135deg,rgba(0,0,0,.34),rgba(29,185,84,.08))',
    border: '1px solid rgba(255,255,255,.14)',
    textAlign: 'center',
    boxShadow: '0 0 30px rgba(29,185,84,.12)'
  },
  payText: {
    opacity: .72,
    margin: '8px 0 14px'
  },
  paypal: {
    display: 'block',
    padding: 15,
    background: '#1db954',
    color: '#000',
    borderRadius: 16,
    textDecoration: 'none',
    fontWeight: 900
  }
};
