import { useEffect, useState } from 'react';

export default function Admin() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTracks() {
    setLoading(true);
    const res = await fetch('/api/list');
    const data = await res.json();
    setTracks(data.tracks || []);
    setLoading(false);
  }

  useEffect(() => {
    loadTracks();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0b0b',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: 24
    }}>
      <h1>🎧 DJ Dennis Adminbereich</h1>
      <p>Hier siehst du die aktuellen Musikwünsche aus deiner Spotify-Wunschplaylist.</p>

      <button onClick={loadTracks} style={{
        padding: 14,
        borderRadius: 12,
        border: 'none',
        background: '#1DB954',
        fontWeight: 'bold',
        marginBottom: 24
      }}>
        Aktualisieren
      </button>

      {loading && <p>Lade Wünsche...</p>}

      {!loading && tracks.length === 0 && <p>Keine Wünsche vorhanden.</p>}

      <div style={{ display: 'grid', gap: 14 }}>
        {tracks.map((track, index) => (
          <div key={track.id + index} style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            background: '#151515',
            border: '1px solid #333',
            borderRadius: 16,
            padding: 14
          }}>
            {track.image && (
              <img src={track.image} width="64" height="64" style={{ borderRadius: 10 }} />
            )}

            <div>
              <strong>{index + 1}. {track.title}</strong>
              <div style={{ color: '#aaa' }}>{track.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
