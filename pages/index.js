import { useState, useEffect } from 'react';

export default function Home() {
  const [form, setForm] = useState({ artist: '', title: '', guest: '', message: '' });

  return (
    <main style={styles.page}>

      {/* BACKGROUND GLOW */}
      <div style={styles.bg}></div>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>🎧 DJ DENNIS</div>
        <div style={styles.subtitle}>WUNSCHBOX LIVE SYSTEM</div>
      </header>

      {/* GRID LAYOUT */}
      <section style={styles.grid}>

        {/* LEFT SIDE */}
        <div style={styles.card}>
          <h2>🎵 Wunsch senden</h2>

          <input style={styles.input} placeholder="Interpret" />
          <input style={styles.input} placeholder="Songtitel" />
          <input style={styles.input} placeholder="Dein Name" />

          <textarea style={styles.textarea} placeholder="Gruß optional" />

          <button style={styles.button}>
            🎧 Wunsch senden
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.card}>
          <h2>💚 Support DJ</h2>

          <div style={styles.supportBox}>
            Wenn dir die Musik gefällt ❤️
          </div>

          <a
            href="https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG"
            style={styles.paypal}
            target="_blank"
          >
            💸 Trinkgeld geben
          </a>

          <div style={styles.info}>
            📱 QR Code scannen → Wunsch senden
          </div>
        </div>

      </section>

    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#05060a',
    color: 'white',
    fontFamily: 'Arial',
    overflow: 'hidden'
  },

  bg: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at 20% 20%, #1db95433, transparent 40%), radial-gradient(circle at 80% 30%, #7c3aed33, transparent 40%), #05060a',
    filter: 'blur(0px)'
  },

  header: {
    textAlign: 'center',
    padding: 30
  },

  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1db954',
    letterSpacing: 2
  },

  subtitle: {
    opacity: 0.7,
    marginTop: 8
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    padding: 30,
    maxWidth: 1100,
    margin: '0 auto'
  },

  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(29,185,84,0.25)',
    borderRadius: 20,
    padding: 20,
    backdropFilter: 'blur(10px)'
  },

  input: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: '1px solid #333',
    background: '#0b0b0f',
    color: 'white'
  },

  textarea: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: '1px solid #333',
    background: '#0b0b0f',
    color: 'white',
    minHeight: 80
  },

  button: {
    marginTop: 15,
    width: '100%',
    padding: 14,
    borderRadius: 12,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: 'black',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  paypal: {
    display: 'block',
    marginTop: 15,
    padding: 14,
    background: '#1db954',
    color: '#000',
    textAlign: 'center',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 'bold'
  },

  supportBox: {
    padding: 15,
    marginTop: 10,
    borderRadius: 12,
    background: 'rgba(29,185,84,0.1)'
  },

  info: {
    marginTop: 15,
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center'
  }
};
