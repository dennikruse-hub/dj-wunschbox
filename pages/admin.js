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

  useEffect(() => {
    load();

    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={styles.page}>
      <h1>🎧 DJ LIVE MODE</h1>
      <p>Alle Wünsche in Echtzeit</p>

      <button onClick={load} style={styles.button}>
        🔄 Aktualisieren
      </button>

      {loading && <p>Lade Wünsche...</p>}

      {tracks.length === 0 && !loading && (
        <p>Keine Wünsche vorhanden</p>
      )}

      <div style={styles.list}>
        {tracks.map((t, i) => (
          <div key={t.id + i} style={styles.card}>
            {t.image && (
              <img src={t.image} style={styles.img} />
            )}

            <div>
              <b>{t.title}</b>
              <div>{t.artist}</div>
            </div>
          </div>
        ))}
      </div>
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
    padding: 12,
    background: '#1db954',
    border: 0,
    borderRadius: 10,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: 20
  },
  list: {
    display: 'grid',
    gap: 10
  },
  card: {
    display: 'flex',
    gap: 10,
    padding: 10,
    background: '#111',
    borderRadius: 10,
    alignItems: 'center',
    border: '1px solid #333'
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 8
  }
};
