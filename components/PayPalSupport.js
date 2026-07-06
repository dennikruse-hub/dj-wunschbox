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
    padding: 16,
    borderRadius: 20,
    background: 'rgba(0,0,0,0.28)',
    border: '1px solid rgba(255,255,255,0.12)',
    textAlign: 'center'
  },
  payText: {
    opacity: 0.7,
    margin: '8px 0 14px'
  },
  paypal: {
    display: 'block',
    padding: 14,
    background: '#1db954',
    color: '#000',
    borderRadius: 14,
    textDecoration: 'none',
    fontWeight: 900
  }
};
