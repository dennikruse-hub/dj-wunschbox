import { useEffect, useRef, useState } from 'react';
import BackgroundGlow from '../components/BackgroundGlow';

const GUEST_URL = 'https://dj-wunschbox.vercel.app';

export default function DJ() {
  const [tracks, setTracks] = useState([]);
  const [likes, setLikes] = useState({});
  const [history, setHistory] = useState([]);
  const [popup, setPopup] = useState(null);
  const lastFirstId = useRef(null);

  async function load() {
    try {
      const listData = await fetch('/api/list').then(r => r.json());
      const likesData = await fetch('/api/likes').then(r => r.json());
      const historyData = await fetch('/api/history').then(r => r.json()).catch(() => ({ history: [] }));

      const newTracks = listData.tracks || [];

      if (lastFirstId.current && newTracks[0]?.id && newTracks[0].id !== lastFirstId.current) {
        setPopup(newTracks[0]);
        setTimeout(() => setPopup(null), 6000);
      }

      if (newTracks[0]?.id) lastFirstId.current = newTracks[0].id;

      setTracks(newTracks);
      setLikes(likesData.likes || {});
      setHistory(historyData.history || []);
    } catch (err) {
      console.log(err);
    }
  }

  async function removeTrack(id) {
    await fetch('/api/remove?id=' + encodeURIComponent(id));
    load();
  }

  async function markPlayed(track) {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track })
    });

    await fetch('/api/played?id=' + encodeURIComponent(track.id));
    load();
  }

  function openQR() {
    window.open(
      `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(GUEST_URL)}`,
      '_blank'
    );
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSong = tracks[0];
  const queue = tracks.slice(1);
  const totalLikes = Object.values(likes).reduce((a, b) => a + b, 0);
  const topLiked = [...tracks].sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0)).slice(0, 5);

  return (
    <main style={styles.page}>
      <BackgroundGlow />

      {popup && (
        <div style={styles.popup}>
          🔔 NEUER WUNSCH
          <strong>{popup.title}</strong>
          <span>{popup.artist}</span>
        </div>
      )}

      <section style={styles.dashboard}>
        <header style={styles.header}>
          <div>
            <div style={styles.live}>● LIVE DJ SYSTEM</div>
            <h1 style={styles.title}>🎧 DJ Dennis Control</h1>
          </div>

          <div style={styles.headerButtons}>
            <button style={styles.qrButton} onClick={openQR}>📱 QR-Code</button>
            <a href="/" style={styles.guestButton}>Gäste-App</a>
          </div>
        </header>

        <div style={styles.stats}>
          <Stat label="Wünsche" value={tracks.length} />
          <Stat label="Likes" value={totalLikes} />
          <Stat label="Gespielt" value={history.length} />
        </div>

        <section style={styles.nowArea}>
          <div style={styles.nowBox}>
            <div style={styles.sectionLabel}>🎵 ALS NÄCHSTES</div>

            {nextSong ? (
              <div style={styles.nowContent}>
                {nextSong.image && <img src={nextSong.image} style={styles.nowCover} />}

                <div style={styles.nowInfo}>
                  <h2>{nextSong.title}</h2>
                  <p>{nextSong.artist}</p>
                  <strong>❤️ {likes[nextSong.id] || 0} Likes</strong>
                </div>

                <div style={styles.bigActions}>
                  <button style={styles.played} onClick={() => markPlayed(nextSong)}>✔ Gespielt</button>
                  <button style={styles.delete} onClick={() => removeTrack(nextSong.id)}>🗑 Löschen</button>
                </div>
              </div>
            ) : (
              <Empty text="Noch kein Wunsch vorhanden." />
            )}
          </div>
        </section>

        <section style={styles.columns}>
          <Panel title="📋 Warteschlange">
            {queue.length === 0 && <Empty text="Keine weiteren Songs in der Liste." />}
            {queue.map((track, index) => (
              <SongRow
                key={track.id + index}
                number={index + 2}
                track={track}
                likes={likes[track.id] || 0}
                onPlayed={() => markPlayed(track)}
                onDelete={() => removeTrack(track.id)}
              />
            ))}
          </Panel>

          <Panel title="❤️ Top Likes">
            {topLiked.length === 0 && <Empty text="Noch keine Likes." />}
            {topLiked.map((track, index) => (
              <TopRow
                key={track.id + index}
                number={index + 1}
                track={track}
                likes={likes[track.id] || 0}
              />
            ))}
          </Panel>
        </section>

        <Panel title="📜 Gespielte Songs">
          {history.length === 0 && <Empty text="Noch keine Songs gespielt." />}
          <div style={styles.historyGrid}>
            {history.slice(0, 12).map((track, index) => (
              <div key={track.id + index} style={styles.historyCard}>
                {track.image && <img src={track.image} style={styles.historyCover} />}
                <div>
                  <b>{track.title}</b>
                  <span>{track.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div style={styles.panel}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return <div style={styles.empty}>{text}</div>;
}

function SongRow({ number, track, likes, onPlayed, onDelete }) {
  return (
    <div style={styles.row}>
      <div style={styles.number}>{number}</div>
      {track.image && <img src={track.image} style={styles.cover} />}
      <div style={styles.info}>
        <b>{track.title}</b>
        <span>{track.artist}</span>
        <small>❤️ {likes}</small>
      </div>
      <button style={styles.smallPlayed} onClick={onPlayed}>✔</button>
      <button style={styles.smallDelete} onClick={onDelete}>🗑</button>
    </div>
  );
}

function TopRow({ number, track, likes }) {
  return (
    <div style={styles.row}>
      <div style={styles.number}>{number}</div>
      {track.image && <img src={track.image} style={styles.cover} />}
      <div style={styles.info}>
        <b>{track.title}</b>
        <span>{track.artist}</span>
      </div>
      <strong style={styles.like}>❤️ {likes}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#02030a',
    color: 'white',
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: 14
  },
  dashboard: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1320,
    margin: '0 auto',
    padding: 18,
    borderRadius: 30,
    background: 'rgba(2,6,23,.9)',
    border: '1px solid rgba(255,255,255,.16)',
    boxShadow: '0 0 70px rgba(29,185,84,.22)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14
  },
  live: {
    color: '#7dffad',
    fontWeight: 900,
    letterSpacing: 2
  },
  title: {
    margin: '4px 0 0',
    fontSize: 38
  },
  headerButtons: {
    display: 'flex',
    gap: 10
  },
  qrButton: {
    padding: '13px 18px',
    borderRadius: 16,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },
  guestButton: {
    padding: '13px 18px',
    borderRadius: 16,
    background: 'rgba(255,255,255,.08)',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 900
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 12,
    marginBottom: 14
  },
  stat: {
    padding: 16,
    borderRadius: 20,
    background: 'rgba(0,0,0,.38)',
    border: '1px solid rgba(255,255,255,.14)',
    textAlign: 'center',
    display: 'grid',
    gap: 4
  },
  nowArea: {
    marginBottom: 14
  },
  nowBox: {
    padding: 18,
    borderRadius: 26,
    background: 'linear-gradient(135deg,rgba(29,185,84,.26),rgba(124,58,237,.22))',
    border: '1px solid rgba(53,255,117,.55)',
    boxShadow: '0 0 40px rgba(29,185,84,.28)'
  },
  sectionLabel: {
    color: '#7dffad',
    fontWeight: 900,
    marginBottom: 12
  },
  nowContent: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr 190px',
    gap: 18,
    alignItems: 'center'
  },
  nowCover: {
    width: 150,
    height: 150,
    borderRadius: 24,
    objectFit: 'cover'
  },
  nowInfo: {
    display: 'grid',
    gap: 6
  },
  bigActions: {
    display: 'grid',
    gap: 12
  },
  played: {
    padding: 18,
    borderRadius: 18,
    border: 0,
    background: '#1db954',
    color: '#001b09',
    fontWeight: 900,
    fontSize: 18,
    cursor: 'pointer'
  },
  delete: {
    padding: 18,
    borderRadius: 18,
    border: 0,
    background: '#ff4444',
    color: 'white',
    fontWeight: 900,
    fontSize: 18,
    cursor: 'pointer'
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: 14
  },
  panel: {
    padding: 16,
    borderRadius: 24,
    background: 'rgba(0,0,0,.35)',
    border: '1px solid rgba(255,255,255,.14)',
    marginBottom: 14
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    marginTop: 8,
    borderRadius: 18,
    background: 'rgba(255,255,255,.06)'
  },
  number: {
    width: 30,
    height: 30,
    minWidth: 30,
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
    borderRadius: 14,
    objectFit: 'cover'
  },
  info: {
    flex: 1,
    minWidth: 0,
    display: 'grid',
    gap: 3
  },
  like: {
    color: '#7dffad'
  },
  smallPlayed: {
    width: 42,
    height: 42,
    borderRadius: 14,
    border: 0,
    background: '#1db954',
    cursor: 'pointer',
    fontWeight: 900
  },
  smallDelete: {
    width: 42,
    height: 42,
    borderRadius: 14,
    border: 0,
    background: '#ff4444',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 900
  },
  historyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))',
    gap: 10
  },
  historyCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 18,
    background: 'rgba(255,255,255,.06)'
  },
  historyCover: {
    width: 46,
    height: 46,
    borderRadius: 12,
    objectFit: 'cover'
  },
  empty: {
    padding: 14,
    borderRadius: 18,
    background: 'rgba(255,255,255,.06)',
    opacity: .8
  },
  popup: {
    position: 'fixed',
    top: 18,
    right: 18,
    zIndex: 9999,
    padding: 18,
    borderRadius: 20,
    background: '#1db954',
    color: '#001b09',
    display: 'grid',
    gap: 5,
    fontWeight: 900,
    boxShadow: '0 0 50px rgba(29,185,84,.8)'
  }
};
