import { useEffect, useState } from 'react';

function NowPlaying({ track }) {
  if (!track) return null;

  return (
    <div style={styles.nowPlaying}>
      <div style={styles.nowLabel}>🎧 JETZT LÄUFT</div>

      <div style={styles.nowContent}>
        {track.image && (
          <img src={track.image} style={styles.nowImg} />
        )}

        <div>
          <h2 style={{ margin: 0 }}>{track.title}</h2>
          <p style={{ margin: 0 }}>{track.artist}</p>
        </div>
      </div>
    </div>
  );
}

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
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={styles.page}>
      <h1>🎧 DJ CONTROL MODE</h1>
      <p>Live Wunschsteuerung</p>

      {tracks.length > 0 && (
        <NowPlaying track={tracks[0]} />
      )}

      <button onClick={load} style={styles.button}>
        🔄 Refresh
      </button>

      {loading && <p>Lade...</p>}

      {tracks.length === 0 && !loading && (
        <p>Keine Wünsche vorhanden</p>
      )}

      <div style={styles.list}>
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
    padding: 10,
    background: '#1db954',
    border: 0,
    borderRadius: 10,
    marginBottom: 15,
    cursor: 'pointer'
  },
  list: {
    display: 'grid',
    gap: 10
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
  },

  nowPlaying: {
    marginTop: 15,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    background: 'linear-gradient(135deg,#1db95422,#000)',
    border: '1px solid #1db954'
  },
  nowLabel: {
    color: '#1db954',
    fontWeight: 'bold',
    marginBottom: 10
  },
  nowContent: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  nowImg: {
    width: 60,
    height: 60,
    borderRadius: 8
  }
};
