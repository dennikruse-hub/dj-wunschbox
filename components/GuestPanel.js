export default function GuestPanel() {
  return (
    <div style={styles.panel}>
      <a href="/queue" style={styles.queueButton}>
        📋 Warteliste ansehen
      </a>

      <a
        href="https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG"
        target="_blank"
        rel="noreferrer"
        style={styles.paypalButton}
      >
        💸 Trinkgeld geben
      </a>
    </div>
  );
}

const styles = {
  panel: {
    marginTop: 12,
    display: 'grid',
    gap: 10
  },
  queueButton: {
    display: 'block',
    padding: 14,
    borderRadius: 16,
    background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)',
    color: '#fff',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 900,
    boxShadow: '0 0 25px rgba(14,165,233,.35)'
  },
  paypalButton: {
    display: 'block',
    padding: 13,
    borderRadius: 16,
    background: 'linear-gradient(135deg,#1db954,#22c55e)',
    color: '#000',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 900,
    boxShadow: '0 0 25px rgba(29,185,84,.35)'
  }
};
