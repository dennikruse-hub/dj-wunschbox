import { useEffect, useRef, useState } from 'react';
import BackgroundGlow from '../components/BackgroundGlow';

export default function Admin() {
  const [tracks, setTracks] = useState([]);
  const [likes, setLikes] = useState({});
  const [popup, setPopup] = useState(null);
  const lastFirstId = useRef(null);

  async function load() {
    try {
      const listRes = await fetch('/api/list');
      const listData = await listRes.json();

      const likesRes = await fetch('/api/likes');
      const likesData = await likesRes.json();

      const newTracks = listData.tracks || [];

      if (lastFirstId.current && newTracks[0]?.id && newTracks[0].id !== lastFirstId.current) {
        setPopup(newTracks[0]);
        setTimeout(() => setPopup(null), 5000);
      }

      if (newTracks[0]?.id) {
        lastFirstId.current = newTracks[0].id;
      }

      setTracks(newTracks);
      setLikes(likesData.likes || {});
    } catch (err) {
      console.log(err);
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
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, []);

  const nowPlaying = tracks[0];
  const queue = tracks.slice(1);

  return (
    <main style={styles.page}>
      <BackgroundGlow />

      {popup && (
        <div style={styles.popup}>
          🔔 Neuer Wunsch
          <div style={styles.popupSong}>{popup.title}</div>
          <div style={styles.popupArtist}>{popup.artist}</div>
        </div>
      )}

      <section style={styles.app}>
        <div style={styles.top}>
          <a href="/" style={styles.back}>← Wunschbox</a>
          <div style={styles.live}>● LIVE</div>
        </div>

        <h1 style={styles.title}>🎧 DJ Panel</h1>
        <p style={styles.subtitle}>Live-Warteliste für DJ Dennis</p>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <b>{tracks.length}</b>
            <span>Wünsche</span>
          </div>
          <div style={styles.stat}>
            <b>{Object.values(likes).reduce((a, b) => a + b, 0)}</b>
            <span>Likes</span>
          </div>
        </div>

        {nowPlaying && (
          <div style={styles.now}>
            <div style={styles.nowLabel}>🎵 NÄCHSTER / OBEN IN DER LISTE</div>

            <div style={styles.nowContent}>
              {nowPlaying.image && <img src={nowPlaying.image} style={styles.nowCover} />}

              <div style={{ flex: 1 }}>
                <b>{nowPlaying.title}</b>
                <div style={styles.artist}>{nowPlaying.artist}</div>
                <div style={styles.likeText}>❤️ {likes[nowPlaying.id] || 0}</div>
              </div>
            </div>
          </div>
        )}

        <h2 style={styles.queueTitle}>📋 Warteschlange</h2>

        {tracks.length === 0 && (
          <div style={styles.empty}>Noch keine Musikwünsche vorhanden.</div>
        )}

        <div style={styles.list}>
          {queue.map((track, index) => (
            <div key={track.id + index} style={styles.card}>
              <div style={styles.number}>{index + 2}</div>

              {track.image && <img src={track.image} style={styles.cover} />}

              <div style={styles.info}>
                <b>{track.title}</b>
                <div style={styles.artist}>{track.artist}</div>
                <div style={styles.likeText}>❤️ {likes[track.id] || 0}</div>
              </div>

              <div style={styles.actions}>
                <button style={styles.played} onClick={() => markPlayed(track.id)}>✔</button>
                <button style={styles.delete} onClick={() => removeTrack(track.id)}>🗑</button>
              </div>
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
    maxWidth: 760,
    marginTop: 6,
    padding: 16,
    borderRadius: 28,
    background:
      'radial-gradient(circle at 20% 15%,rgba(29,185,84,.26),transparent 30%), radial-gradient(circle at 90% 55%,rgba(124,58,237,.30),transparent 40%), rgba(2,6,23,.9)',
    border: '1px solid rgba(255,255,255,.18)',
    boxShadow: '0 0 50px rgba(29,185,84,.22), 0 25px 80px rgba(0,0,0,.85)',
    backdropFilter: 'blur(18px)',
    position: 'relative',
    zIndex: 2
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  back: {
    color: '#7dffad',
    textDecoration: 'none',
    fontWeight: 900
  },
  live: {
    color: '#7dffad',
    fontWeight: 900
  },
  title: {
    margin: 0,
    fontSize: 40,
    fontWeight: 900
  },
  subtitle: {
    margin: '6px 0 14px',
    opacity: 0.75
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 14
  },
  stat: {
    padding: 14,
    borderRadius: 18,
    background: 'rgba(0,0,0,.35)',
    border: '1px solid rgba(255,255,255,.16)',
    display: 'grid',
    gap: 3,
    textAlign: 'center'
  },
  now: {
    padding: 14,
    borderRadius: 20,
    background: 'linear-gradient(135deg,rgba(29,185,84,.22),rgba(124,58,237,.18))',
    border: '1px solid rgba(53,255,117,.55)',
    boxShadow: '0 0 28px rgba(29,185,84,.25)',
    marginBottom: 16
  },
  nowLabel: {
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 12,
    marginBottom: 10
  },
  nowContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  nowCover: {
    width: 72,
    height: 72,
    borderRadius: 16,
    objectFit: 'cover'
  },
  queueTitle: {
    margin: '8px 0 10px'
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
    background: 'rgba(0,25,45,.48)',
    border: '1px solid rgba(0,229,255,.30)'
  },
  number: {
    width: 28,
    height: 28,
    minWidth: 28,
    borderRadius: '50%',
    background: '#1db954',
    color: '#001b09',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900
  },
  cover: {
    width: 56,
    height: 56,
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
  likeText: {
    marginTop: 4,
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 13
  },
  actions: {
    display: 'flex',
    gap: 6
  },
  played: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: 0,
    background: '#1db954',
    color: '#001b09',
    fontWeight: 900,
    cursor: 'pointer'
  },
  delete: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: 0,
    background: '#ff4444',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },
  empty: {
    padding: 16,
    borderRadius: 18,
    background: 'rgba(0,0,0,.35)',
    border: '1px solid rgba(255,255,255,.16)',
    textAlign: 'center',
    opacity: 0.8
  },
  popup: {
    position: 'fixed',
    top: 18,
    right: 18,
    zIndex: 9999,
    background: '#1db954',
    color: '#001b09',
    padding: 14,
    borderRadius: 18,
    fontWeight: 900,
    boxShadow: '0 0 40px rgba(29,185,84,.75)'
  },
  popupSong: {
    marginTop: 6
  },
  popupArtist: {
    opacity: 0.8,
    fontSize: 13
  }
};
