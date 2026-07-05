import { useEffect, useState } from 'react';

function NowPlaying({ track }) {
  if (!track) return null;

  return (
    <div style={styles.now}>
      🎧 <b>JETZT LÄUFT</b>

      <div style={styles.nowBox}>
        {track.image && <img src={track.image} style={styles.img} />}

        <div>
          <h3 style={{ margin: 0 }}>{track.title}</h3>
          <p style={{ margin: 0 }}>{track.artist}</p>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [tracks, setTracks] = useState([]);

  async function load() {
    try {
      const res = await fetch('/api/list');
      const data = await res.json();

      setTracks(data.tracks || []);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    load();

    // 🔥 LIVE MODE (kein Flicker, nur smooth refresh)
    const interval = setInterval(load, 2500);

    return () => clearInterval(interval);
  }, []);

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
      <h1>🎧 DJ FINAL MODE</h1>

      {/* NOW PLAYING */}
      <NowPlaying track={nowPlaying} />

      {/* QUEUE */}
      <h3 style={{ marginTop: 20 }}>📊 Warteschlange</h3>

      {queue.length === 0 && (
        <p>Keine weiteren Wünsche</p>
      )}

      {queue.map((t) => (
        <div key={t.id} style={styles.card}>

          {t.image && <img src={t.image} style={styles.imgSmall} />}

          <div style={{ flex: 1 }}>
            <b>{t.title}</b>
            <div style={{ opacity: 0.7 }}>{t.artist}</div>
          </div>

          <button onClick={() => markPlayed(t.id)} style={styles.played}>
            ✔
          </button>

          <button onClick={() => removeTrack(t.id)} style={styles.delete}>
            🗑
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

  now: {
    padding: 15,
    border: '1px solid #1db954',
    borderRadius: 12,
    background: '#111'
  },

  nowBox: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginTop: 10
  },

  card: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: 10,
    background: '#111',
    borderRadius: 10,
    marginTop: 10
  },

  img: {
    width: 60,
    height: 60,
    borderRadius: 8
  },

  imgSmall: {
    width: 45,
    height: 45,
    borderRadius: 6
  },

  played: {
    background: '#1db954',
    border: 0,
    padding: 8,
    borderRadius: 6,
    cursor: 'pointer'
  },

  delete: {
    background: '#ff4444',
    border: 0,
    padding: 8,
    borderRadius: 6,
    cursor: 'pointer',
    color: '#fff'
  }
};
