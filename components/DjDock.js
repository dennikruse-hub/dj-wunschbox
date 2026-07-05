import { useState } from 'react';

export default function DjDock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TASKBAR */}
      <div style={styles.taskbar}>

        <div style={styles.left}>
          🎧 DJ DENNIS
        </div>

        <div style={styles.center}>
          <button style={styles.btn} onClick={() => setOpen(!open)}>
            🎛 Control
          </button>

          <button
            style={styles.btn}
            onClick={() => window.location.href = '/admin'}
          >
            📊 Admin
          </button>

          <button
            style={styles.btn}
            onClick={() =>
              window.open('https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG')
            }
          >
            💸 Trinkgeld
          </button>
        </div>

        <div style={styles.right}>
          🔴 LIVE
        </div>

      </div>

      {/* FLOAT PANEL */}
      {open && (
        <div style={styles.panel}>
          <h3 style={{ marginTop: 0, color: '#1db954' }}>
            🎧 DJ CONTROL CENTER
          </h3>

          <button style={styles.panelBtn} onClick={() => window.location.href = '/'}>
            🎵 Wunschbox
          </button>

          <button style={styles.panelBtn} onClick={() => window.location.href = '/admin'}>
            🎛 Admin Panel
          </button>

          <button
            style={styles.panelBtn}
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
  taskbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    background: '#0a0a0a',
    borderTop: '1px solid #1db954',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 15px',
    zIndex: 9999
  },

  left: {
    color: '#1db954',
    fontWeight: 'bold'
  },

  center: {
    display: 'flex',
    gap: 10
  },

  right: {
    color: 'red',
    fontWeight: 'bold'
  },

  btn: {
    background: '#111',
    color: 'white',
    border: '1px solid #1db954',
    borderRadius: 6,
    padding: '6px 10px',
    cursor: 'pointer'
  },

  panel: {
    position: 'fixed',
    bottom: 65,
    right: 15,
    width: 220,
    background: '#111',
    border: '1px solid #1db954',
    borderRadius: 12,
    padding: 12,
    zIndex: 9999
  },

  panelBtn: {
    width: '100%',
    padding: 10,
    marginTop: 8,
    background: '#1db954',
    border: 0,
    borderRadius: 8,
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
