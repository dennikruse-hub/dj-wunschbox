import { useEffect, useRef, useState } from 'react';
import BackgroundGlow from '../components/BackgroundGlow';

const GUEST_URL = 'https://dj-wunschbox.vercel.app';

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

      if (
        lastFirstId.current &&
        newTracks[0]?.id &&
        newTracks[0].id !== lastFirstId.current
      ) {
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
    await fetch('/api/remove?id=' + encodeURIComponent(id));
    load();
  }

  async function markPlayed(id) {
    await fetch('/api/played?id=' + encodeURIComponent(id));
    load();
  }

  function printQR() {
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

  const totalLikes = Object.values(likes).reduce((sum, value) => sum + value, 0);

  const topLiked = [...tracks]
    .sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0))
    .slice(0, 5);

  const nextSong = tracks[0];

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
          <a href="/" style={styles.back}>← Gäste-Wunschbox</a>
          <div style={styles.live}>● LIVE</div>
        </div>

        <h1 style={styles.title}>🎧 DJ Control Center</h1>
        <p style={styles.subtitle}>
          Deine zentrale Übersicht für Musikwünsche, Likes und QR-Code.
        </p>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <b>{tracks.length}</b>
            <span>Wünsche</span>
          </div>

          <div style={styles.stat}>
            <b>{totalLikes}</b>
            <span>Likes</span>
          </div>

          <div style={styles.stat}>
            <b>{topLiked[0] ? '🔥' : '–'}</b>
            <span>Top Song</span>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.qrBox}>
            <h2 style={styles.boxTitle}>📱 Gäste QR-Code</h2>
            <p style={styles.text}>
              Diesen QR-Code kannst du ausdrucken oder auf einem Bildschirm zeigen.
            </p>

            <img
              alt="QR-Code"
              style={styles.qr}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(GUEST_URL)}`}
            />

            <button style={styles.printButton} onClick={printQR}>
              🖨 QR-Code öffnen / drucken
            </button>
          </div>

          <div style={styles.topSongsBox}>
            <h2 style={styles.boxTitle}>❤️ Meistgelikte Songs</h2>

            {topLiked.length === 0 && (
              <div style={styles.empty}>Noch keine Likes vorhanden.</div>
            )}

            {topLiked.map((track, index) => (
              <div key={track.id + index} style={styles.topSong}>
                <strong>{index + 1}</strong>

                {track.image && (
                  <img src={track.image} style={styles.smallCover} />
                )}

                <div style={{ flex: 1 }}>
                  <b>{track.title}</b>
                  <div style={styles.artist}>{track.artist}</div>
                </div>

                <div style={styles.likeText}>❤️ {likes[track.id] || 0}</div>
              </div>
            ))}
          </div>
        </div>

        {nextSong && (
          <div style={styles.nextBox}>
            <div style={styles.nextLabel}>🎵 OBEN IN DER WARTELISTE</div>

            <div style={styles.nextContent}>
              {nextSong.image && (
                <img src={nextSong.image} style={styles.nextCover} />
              )}

              <div style={{ flex: 1 }}>
                <b>{nextSong.title}</b>
                <div style={styles.artist}>{nextSong.artist}</div>
                <div style={styles.likeText}>❤️ {likes[nextSong.id] || 0}</div>
              </div>

              <div style={styles.actions}>
                <button style={styles.played} onClick={() => markPlayed(nextSong.id)}>
                  ✔
                </button>
                <button style={styles.delete} onClick={() => removeTrack(nextSong.id)}>
                  🗑
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 style={styles.queueTitle}>📋 Warteschlange</h2>

        {tracks.length === 0 && (
          <div style={styles.empty}>Noch keine Musikwünsche vorhanden.</div>
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
                <div style={styles.likeText}>❤️ {likes[track.id] || 0}</div>
              </div>

              <div style={styles.actions}>
                <button style={styles.played} onClick={() => markPlayed(track.id)}>
                  ✔
                </button>
                <button style={styles.delete} onClick={() => removeTrack(track.id)}>
                  🗑
                </button>
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
    maxWidth: 980,
    marginTop: 6,
    padding: 18,
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
    gridTemplateColumns: 'repeat(3, 1fr)',
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

  grid: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: 14,
    marginBottom: 14
  },

  qrBox: {
    padding: 16,
    borderRadius: 22,
    background: 'rgba(0,0,0,.35)',
    border: '1px solid rgba(255,255,255,.16)',
    textAlign: 'center'
  },

  qr: {
    width: 230,
    height: 230,
    borderRadius: 18,
    background: 'white',
    padding: 10,
    margin: '10px auto'
  },

  printButton: {
    width: '100%',
    padding: 12,
    borderRadius: 14,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },

  topSongsBox: {
    padding: 16,
    borderRadius: 22,
    background: 'rgba(0,0,0,.35)',
    border: '1px solid rgba(255,255,255,.16)'
  },

  boxTitle: {
    margin: '0 0 8px'
  },

  text: {
    opacity: 0.75
  },

  topSong: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 16,
    background: 'rgba(255,255,255,.06)',
    marginTop: 8
  },

  smallCover: {
    width: 44,
    height: 44,
    borderRadius: 10,
    objectFit: 'cover'
  },

  nextBox: {
    padding: 14,
    borderRadius: 22,
    background: 'linear-gradient(135deg,rgba(29,185,84,.22),rgba(124,58,237,.18))',
    border: '1px solid rgba(53,255,117,.55)',
    boxShadow: '0 0 28px rgba(29,185,84,.25)',
    marginBottom: 14
  },

  nextLabel: {
    color: '#7dffad',
    fontWeight: 900,
    fontSize: 12,
    marginBottom: 10
  },

  nextContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },

  nextCover: {
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
