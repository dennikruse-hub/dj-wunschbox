import { useEffect, useState } from 'react';

export default function Screen() {
  const [track, setTrack] = useState(null);

  async function load() {
    try {
      const res = await fetch('/api/list');
      const data = await res.json();

      if (data.tracks && data.tracks.length > 0) {
        setTrack(data.tracks[0]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={styles.page}>

      <div style={styles.title}>
        🎧 DJ DENNIS LIVE
      </div>

      {track ? (
        <div style={styles.card}>
          {track.image && (
            <img src={track.image} style={styles.img} />
          )}

          <div>
            <h1 style={{ margin: 0 }}>{track.title}</h1>
            <h3 style={{ margin: 0, opacity: 0.8 }}>{track.artist}</h3>
          </div>
        </div>
      ) : (
        <div style={styles.empty}>
          🎵 Warte auf den nächsten Song...
        </div>
      )}

      <div style={styles.footer}>
        Powered by Spotify • DJ Wunschbox
      </div>

    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top,#1db95433,#000)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial',
    textAlign: 'center'
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1db954'
  },

  card: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    padding: 20,
    background: '#111',
    borderRadius: 20,
    border: '1px solid #1db954',
    boxShadow: '0 0 40px rgba(29,185,84,0.3)'
  },

  img: {
    width: 120,
    height: 120,
    borderRadius: 12
  },

  empty: {
    fontSize: 22,
    opacity: 0.7
  },

  footer: {
    marginTop: 40,
    fontSize: 12,
    opacity: 0.5
  }
};
