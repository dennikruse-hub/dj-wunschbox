import { useEffect, useRef, useState } from 'react';

export default function Admin() {
  const [tracks, setTracks] = useState([]);
  const [popup, setPopup] = useState(null);
  const lastIdRef = useRef(null);
  const firstLoadRef = useRef(true);

  async function load() {
    try {
      const res = await fetch('/api/list');
      const data = await res.json();
      const newTracks = data.tracks || [];

      if (newTracks.length > 0) {
        const newest = newTracks[0];

        if (!firstLoadRef.current && lastIdRef.current && newest.id !== lastIdRef.current) {
          setPopup(newest);
          playAlertSound();
          setTimeout(() => setPopup(null), 5000);
        }

        lastIdRef.current = newest.id;
      }

      firstLoadRef.current = false;
      setTracks(newTracks);
    } catch (e) {
      console.log(e);
    }
  }

  function playAlertSound() {
    try {
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch (e) {
      console.log(e);
    }
  }

  async function removeTrack(id) {
    await fetch('/api/remove?id=' + id);
    load();
  }

  async function markPlayed(id) {
    await fetch('/api/played?id=' + id);
    load();
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 2500);
    return () => clearInterval(interval);
  }, []);

  const nowPlaying = tracks[0];
  const queue = tracks.slice(1);

  return (
    <main style={styles.page}>
      <h1>🎧 DJ CONTROL</h1>
      <p style={styles.subline}>Live-Wunschliste wird automatisch aktualisiert.</p>

      {popup && (
        <div style={styles.popup}>
          <div style={styles.popupTitle}>🔔 NEUER WUNSCH!</div>
          <div style={styles.popupBox}>
            <b>{popup.title}</b>
            <div>{popup.artist}</div>
          </div>
        </div>
      )}

      {nowPlaying && (
        <div style={styles.now}>
          <div style={styles.nowLabel}>🎧 JETZT LÄUFT</div>
          <b>{nowPlaying.title}</b>
          <div>{nowPlaying.artist}</div>
        </div>
      )}

      <h3>📋 Warteschlange</h3>

      {queue.length === 0 && (
        <p style={styles.empty}>Keine weiteren Wünsche vorhanden.</p>
      )}

      {queue.map(t => (
        <div key={t.id} style={styles.card}>
          <div style={styles.songInfo}>
            {t.image && <img src={t.image} style={styles.image} />}
            <div>
              <b>{t.title}</b>
              <div style={styles.artist}>{t.artist}</div>
            </div>
          </div>

          <div style={styles.actions}>
            <button style={styles.played} onClick={() => markPlayed(t.id)}>✔</button>
            <button style={styles.delete} onClick={() => removeTrack(t.id)}>🗑</button>
          </div>
        </div>
      ))}
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0b0b0b',
    color: '#fff',
    padding: 20,
    fontFamily: 'Arial'
  },
  subline: {
    opacity: 0.7
  },
  now: {
    padding: 15,
    border: '1px solid #1db954',
    borderRadius: 12,
    marginBottom: 20,
    background: '#111'
  },
  nowLabel: {
    color: '#1db954',
    fontWeight: 'bold',
    marginBottom: 6
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    padding: 10,
    background: '#111',
    borderRadius: 10,
    marginTop: 8,
    border: '1px solid #222'
  },
  songInfo: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 8
  },
  artist: {
    opacity: 0.7,
    fontSize: 13
  },
  actions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  },
  played: {
    background: '#1db954',
    border: 0,
    borderRadius: 8,
    padding: '8px 10px',
    cursor: 'pointer'
  },
  delete: {
    background: '#ff4444',
    color: '#fff',
    border: 0,
    borderRadius: 8,
    padding: '8px 10px',
    cursor: 'pointer'
  },
  empty: {
    opacity: 0.7
  },
  popup: {
    position: 'fixed',
    top: 20,
    right: 20,
    background: '#1db954',
    color: '#000',
    padding: 16,
    borderRadius: 14,
    fontWeight: 'bold',
    boxShadow: '0 0 35px rgba(29,185,84,0.7)',
    zIndex: 9999,
    maxWidth: 280
  },
  popupTitle: {
    fontSize: 16,
    marginBottom: 6
  },
  popupBox: {
    fontSize: 14
  }
};
