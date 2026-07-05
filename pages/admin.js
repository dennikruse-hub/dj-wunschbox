import { useEffect, useState } from 'react';

export default function Admin() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const res = await fetch('/api/list');
    const data = await res.json();

    setTracks(data.tracks || []);
    setLoading(false);
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
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={styles.page}>
      <h1>🎧 DJ CONTROL MODE</h1>
      <p>Live Wunschsteuerung</p>

      <button onClick={load} style={styles.button}>
        🔄 Refresh
      </button>

      {loading && <p>Lade...</p>}

      {tracks.map((t, i) => (
        <div key={t.id + i} style={styles.card}>

          {t.image && (
            <img src={t.image} style={styles.img} />
          )}

          <div style={{ flex: 1 }}>
            <b>{t.title}</b>
            <div>{t.artist}</div>
          </div>

          <button
            onClick={() => markPlayed(t.id)}
            style={styles.played}
          >
            ✔ gespielt
          </button>

          <button
            onClick={() => removeTrack(t.id)}
            style={styles.delete}
          >
            🗑 löschen
          </button>

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
  button: {
    padding: 10,
    background: '#1db954',
    border: 0,
    borderRadius: 10,
    marginBottom: 15,
    cursor: 'pointer'
  },
  card: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: 10,
    background: '#111',
    borderRadius: 10,
    marginBottom: 10,
    border: '1px solid #333'
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 8
  },
  played: {
    background: '#1db954',
    border: 0,
    padding: 8,
    borderRadius: 8,
    cursor: 'pointer'
  },
  delete: {
    background: '#ff4444',
    border: 0,
    padding: 8,
    borderRadius: 8,
    cursor: 'pointer',
    color: '#fff'
  }
};
