import { useEffect, useState } from 'react';
import BackgroundGlow from '../components/BackgroundGlow';

export default function Queue() {
  const [tracks, setTracks] = useState([]);
  const [liked, setLiked] = useState({});

  async function loadQueue() {
    try {
      const res = await fetch('/api/list');
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (err) {
      console.log(err);
      setTracks([]);
    }
  }

  useEffect(() => {
    loadQueue();
    setLiked(JSON.parse(localStorage.getItem('djwunschbox_likes') || '{}'));

    const interval = setInterval(loadQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  function likeSong(id) {
    const next = { ...liked, [id]: true };
    setLiked(next);
    localStorage.setItem('djwunschbox_likes', JSON.stringify(next));
  }

  return (
    <main style={styles.page}>
      <BackgroundGlow />

      <section style={styles.app}>
        <a href="/" style={styles.back}>← Wunschbox</a>

        <div style={styles.header}>
          <div style={styles.badge}>● LIVE</div>
          <h1 style={styles.title}>Warteliste</h1>
          <p style={styles.subtitle}>Diese Songs wurden bereits gewünscht.</p>
        </div>

        {tracks.length === 0 && (
          <div style={styles.empty}>
            Noch keine Wünsche vorhanden.
          </div>
        )}

        <div style={styles.list}>
          {tracks.map((track, index) => (
            <div key={track.id + index} style={styles.card}>
              <div style={styles.number}>{index + 1}</div>

              {track.image && (
                <img src={track.image} style={styles.cover} />
              )}

              <div style={styles.info}>
                <b>{track.title}</b>
                <div style={styles.artist}>{track.artist}</div>
              </div>

              <button
                style={{
                  ...styles.like,
                  ...(liked[track.id] ? styles.liked : {})
                }}
                onClick={() => likeSong(track.id)}
                disabled={liked[track.id]}
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#02030a',
    color: 'white',
    fontFamily: 'Arial, Helvetica, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    position: 'relative',
    overflow: 'auto'
  },
  app: {
    width: '100%',
    maxWidth: 420,
    marginTop: 6,
    padding: 14,
    borderRadius: 28,
    background:
      'radial-gradient(circle at 20% 15%,rgba(29,185,84,.26),transparent 30%), radial-gradient(circle at 90% 55%,rgba(124,58,237,.30),transparent 40%), rgba(2,6,23,.88)',
    border: '1px solid rgba(255,255,255,.18)',
    boxShadow: '0 0 50px rgba(29,185,84,.22), 0 25px 80px rgba(0,0,0,.85)',
    backdropFilter: 'blur(18px)',
    position: 'relative',
    zIndex: 2
  },
  back: {
    display: 'inline-block',
    marginBottom: 12,
    color: '#7dffad',
    textDecoration: 'none',
    fontWeight: 900
  },
  header: {
    marginBottom: 16
  },
  badge: {
    display: 'inline-block',
    padding: '6px 11px',
    borderRadius: 12,
    background: 'rgba(29,185,84,.18)',
    border: '1px solid rgba(29,185,84,.7)',
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 12,
    marginBottom: 10
  },
  title: {
    margin: 0,
    fontSize: 38,
    fontWeight: 900
  },
  subtitle: {
    margin: '6px 0 0',
    opacity: 0.75
  },
  list: {
    display: 'grid',
    gap: 10
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 18,
    background: 'linear-gradient(135deg,rgba(0,255,120,.16),rgba(0,20,50,.65))',
    border: '1px solid rgba(53,255,117,.45)',
    boxShadow: '0 0 24px rgba(29,185,84,.22)'
  },
  number: {
    width: 26,
    height: 26,
    minWidth: 26,
    borderRadius: '50%',
    background: '#1db954',
    color: '#001b09',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900
  },
  cover: {
    width: 54,
    height: 54,
    borderRadius: 12,
    objectFit: 'cover'
  },
  info: {
    flex: 1,
    minWidth: 0
  },
  artist: {
    opacity: 0.72,
    fontSize: 13,
    marginTop: 3
  },
  like: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,.25)',
    background: 'rgba(0,0,0,.35)',
    color: 'white',
    fontSize: 18,
    cursor: 'pointer'
  },
  liked: {
    background: '#1db954',
    color: '#000'
  },
  empty: {
    padding: 16,
    borderRadius: 18,
    background: 'rgba(0,0,0,.35)',
    border: '1px solid rgba(255,255,255,.16)',
    textAlign: 'center',
    opacity: 0.8
  }
};
