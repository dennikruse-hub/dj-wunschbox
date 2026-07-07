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

  const totalLikes = Object.values(likes).reduce((a, b) => a + b, 0);
  const topLiked = [...tracks].sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0)).slice(0, 5);
  const nextSong = tracks[0];

  return (
    <main style={styles.page}>
      <BackgroundGlow />

      {popup && (
        <div style={styles.popup}>
          🔔 NEUER WUNSCH
          <div>{popup.title}</div>
          <small>{popup.artist}</small>
        </div>
      )}

      <section style={styles.shell}>
        <aside style={styles.sidebar}>
          <h2>🎧 DJ Dennis</h2>
          <a style={styles.nav} href="/">Gäste-App</a>
          <a style={styles.nav} href="/queue">Warteliste</a>
          <button style={styles.qrBtn} onClick={openQR}>🖨 QR-Code</button>
          <div style={styles.live}>● LIVE</div>
        </aside>

        <section style={styles.main}>
          <h1>DJ Wunschbox Control</h1>

          <div style={styles.stats}>
            <Box title="Wünsche" value={tracks.length} />
            <Box title="Likes" value={totalLikes} />
            <Box title="Gespielt" value={history.length} />
          </div>

          {nextSong && (
            <div style={styles.hero}>
              <div>
                <div style={styles.label}>OBEN IN DER WARTELISTE</div>
                <h2>{nextSong.title}</h2>
                <p>{nextSong.artist}</p>
                <strong>❤️ {likes[nextSong.id] || 0}</strong>
              </div>

              {nextSong.image && <img src={nextSong.image} style={styles.heroImg} />}

              <div style={styles.actions}>
                <button style={styles.played} onClick={() => markPlayed(nextSong)}>✔ Gespielt</button>
                <button style={styles.delete} onClick={() => removeTrack(nextSong.id)}>🗑 Löschen</button>
              </div>
            </div>
          )}

          <div style={styles.grid}>
            <Panel title="📋 Warteschlange">
              {tracks.length === 0 && <Empty text="Noch keine Wünsche vorhanden." />}
              {tracks.map((t, i) => (
                <SongRow
                  key={t.id + i}
                  index={i + 1}
                  track={t}
                  likes={likes[t.id] || 0}
                  onPlayed={() => markPlayed(t)}
                  onDelete={() => removeTrack(t.id)}
                />
              ))}
            </Panel>

            <Panel title="❤️ Top Likes">
              {topLiked.length === 0 && <Empty text="Noch keine Likes vorhanden." />}
              {topLiked.map((t, i) => (
                <TopRow key={t.id + i} index={i + 1} track={t} likes={likes[t.id] || 0} />
              ))}
            </Panel>
          </div>

          <Panel title="📜 Gespielte Songs">
            {history.length === 0 && <Empty text="Noch keine Songs gespielt." />}
            {history.slice(0, 20).map((t, i) => (
              <div key={t.id + i} style={styles.history}>
                {t.image && <img src={t.image} style={styles.coverSmall} />}
                <div>
                  <b>{t.title}</b>
                  <div>{t.artist}</div>
                  <small>{t.playedAt ? new Date(t.playedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : ''}</small>
                </div>
              </div>
            ))}
          </Panel>
        </section>
      </section>
    </main>
  );
}

function Box({ title, value }) {
  return (
    <div style={styles.box}>
      <b>{value}</b>
      <span>{title}</span>
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

function SongRow({ index, track, likes, onPlayed, onDelete }) {
  return (
    <div style={styles.row}>
      <div style={styles.num}>{index}</div>
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

function TopRow({ index, track, likes }) {
  return (
    <div style={styles.row}>
      <div style={styles.num}>{index}</div>
      {track.image && <img src={track.image} style={styles.cover} />}
      <div style={styles.info}>
        <b>{track.title}</b>
        <span>{track.artist}</span>
      </div>
      <strong style={styles.likes}>❤️ {likes}</strong>
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
  shell: {
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '230px 1fr',
    gap: 14,
    maxWidth: 1300,
    margin: '0 auto'
  },
  sidebar: {
    minHeight: 'calc(100vh - 28px)',
    padding: 18,
    borderRadius: 26,
    background: 'rgba(0,0,0,.55)',
    border: '1px solid rgba(255,255,255,.14)'
  },
  nav: {
    display: 'block',
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    background: 'rgba(255,255,255,.07)',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 900
  },
  qrBtn: {
    width: '100%',
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },
  live: {
    marginTop: 20,
    color: '#7dffad',
    fontWeight: 900
  },
  main: {
    padding: 18,
    borderRadius: 26,
    background: 'rgba(2,6,23,.88)',
    border: '1px solid rgba(255,255,255,.14)'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginBottom: 14
  },
  box: {
    padding: 16,
    borderRadius: 18,
    background: 'rgba(0,0,0,.38)',
    border: '1px solid rgba(255,255,255,.14)',
    display: 'grid',
    gap: 4,
    textAlign: 'center'
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 110px 180px',
    gap: 14,
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    background: 'linear-gradient(135deg,rgba(29,185,84,.25),rgba(124,58,237,.20))',
    border: '1px solid rgba(53,255,117,.55)',
    marginBottom: 14
  },
  label: {
    color: '#7dffad',
    fontSize: 12,
    fontWeight: 900
  },
  heroImg: {
    width: 110,
    height: 110,
    borderRadius: 18,
    objectFit: 'cover'
  },
  actions: {
    display: 'grid',
    gap: 10
  },
  played: {
    padding: 13,
    borderRadius: 14,
    border: 0,
    background: '#1db954',
    color: '#001b09',
    fontWeight: 900,
    cursor: 'pointer'
  },
  delete: {
    padding: 13,
    borderRadius: 14,
    border: 0,
    background: '#ff4444',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: 14
  },
  panel: {
    padding: 16,
    borderRadius: 22,
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
    borderRadius: 16,
    background: 'rgba(255,255,255,.06)'
  },
  num: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#1db954',
    color: '#001b09',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 12,
    objectFit: 'cover'
  },
  coverSmall: {
    width: 44,
    height: 44,
    borderRadius: 10,
    objectFit: 'cover'
  },
  info: {
    flex: 1,
    display: 'grid',
    gap: 3,
    minWidth: 0
  },
  likes: {
    color: '#7dffad'
  },
  smallPlayed: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: 0,
    background: '#1db954',
    cursor: 'pointer'
  },
  smallDelete: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: 0,
    background: '#ff4444',
    color: 'white',
    cursor: 'pointer'
  },
  history: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    marginTop: 8,
    borderRadius: 16,
    background: 'rgba(255,255,255,.05)'
  },
  empty: {
    padding: 14,
    borderRadius: 16,
    background: 'rgba(255,255,255,.06)',
    opacity: .8
  },
  popup: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 9999,
    padding: 16,
    borderRadius: 18,
    background: '#1db954',
    color: '#001b09',
    fontWeight: 900,
    boxShadow: '0 0 45px rgba(29,185,84,.75)'
  }
};
