import { useState } from 'react';

export default function DjDock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={styles.fab} onClick={() => setOpen(!open)}>
        🎧 DJ
      </div>

      {open && (
        <div style={styles.panel}>
          <h3 style={{ color: '#1db954', marginTop: 0 }}>DJ PANEL</h3>

          <button style={styles.btn} onClick={() => window.location.href = '/admin'}>
            🎛 Admin
          </button>

          <button style={styles.btn} onClick={() => window.location.href = '/'}>
            🎵 Wunschbox
          </button>

          <button
            style={styles.btn}
            onClick={() =>
              window.open('https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG')
            }
          >
            💸 PayPal
          </button>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: '#1db954',
    color: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 9999
  },

  panel: {
    position: 'fixed',
    bottom: 90,
    right: 20,
    width: 200,
    background: '#111',
    border: '1px solid #1db954',
    borderRadius: 12,
    padding: 12,
    zIndex: 9999
  },

  btn: {
    width: '100%',
    padding: 10,
    marginTop: 8,
    background: '#1db954',
    border: 0,
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
