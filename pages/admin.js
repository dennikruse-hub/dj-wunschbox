import { useEffect, useState } from 'react';

export default function Admin() {
  const [tracks, setTracks] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [popup, setPopup] = useState(null);

  async function load() {
    try {
      const res = await fetch('/api/list');
      const data = await res.json();

      const newTracks = data.tracks || [];

      // 🔥 CHECK OB NEUER WUNSCH DA IST
      if (newTracks.length > 0) {
        if (lastId && newTracks[0].id !== lastId) {
          setPopup(newTracks[0]);

          // Auto close popup nach 4 Sekunden
          setTimeout(() => setPopup(null), 4000);
        }

        setLastId(newTracks[0].id);
      }

      setTracks(newTracks);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 2500);
    return () => clearInterval(interval);
  }, [lastId]);

  async function removeTrack(id) {
    await fetch('/api/remove?id=' + id);
    load();
  }

  async function markPlayed(id) {
    await fetch('/api/played?id=' + id);
    load();
  }

  const nowPlaying = tracks[0];
  const queue = tracks.slice(1);

  return (
    <main style={styles.page}>

      <h1>🎧 DJ CONTROL</h1>

      {/* 🔥 POPUP */}
      {popup && (
        <div style={styles.popup}>
          🔔 NEUER WUNSCH!

          <div style={styles.popupBox}>
            <b>{popup.title}</b>
            <div>{popup.artist}</div>
          </div>
        </div>
      )}

      {/* NOW PLAYING */}
      {nowPlaying && (
        <div style={styles.now}>
          🎧 Jetzt: {nowPlaying.title} - {nowPlaying.artist}
        </div>
      )}

      {/* QUEUE */}
      <h3>Queue</h3>

      {queue.map(t => (
        <div key={t.id} style={styles.card}>
          <div>
            <b>{t.title}</b>
            <div>{t.artist}</div>
          </div>

          <button onClick={() => markPlayed(t.id)}>✔</button>
          <button onClick={() => removeTrack(t.id)}>🗑</button>
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

  now: {
    padding: 10,
    border: '1px solid #1db954',
    borderRadius: 10,
    marginBottom: 10
  },

  card: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    background: '#111',
    borderRadius: 10,
    marginTop: 8
  },

  popup: {
    position: 'fixed',
    top: 20,
    right: 20,
    background: '#1db954',
    color: '#000',
    padding: 15,
    borderRadius: 12,
    fontWeight: 'bold',
    boxShadow: '0 0 30px rgba(0,0,0,0.5)',
    zIndex: 9999
  },

  popupBox: {
    marginTop: 5,
    fontSize: 13
  }
};
