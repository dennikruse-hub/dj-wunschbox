import { useEffect, useState } from 'react';

export default function Admin() {
  const [tracks, setTracks] = useState([]);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setUrl(window.location.origin);
    fetch('/api/playlist').then(r => r.json()).then(d => {
      if (d.error) setError(d.error); else setTracks(d.tracks || []);
    }).catch(e => setError(e.message));
  }, []);

  const qr = url ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}` : '';

  return <main className="page">
    <section className="card wide">
      <div className="badge">DJ Bereich</div>
      <h1>DJ Dennis Wunschbox</h1>
      <p className="muted">QR-Code für Gäste und aktuelle Spotify-Wunschplaylist.</p>
      {qr && <div className="qr"><img src={qr} alt="QR Code" /><p>{url}</p></div>}
      {error && <div className="status error">{error}</div>}
      <h2>Aktuelle Playlist</h2>
      <div className="tracks">
        {tracks.map(t => <div className="track" key={t.id}>
          {t.image && <img src={t.image} alt="" />}
          <div><strong>{t.title}</strong><span>{t.artist}</span></div>
        </div>)}
      </div>
    </section>
  </main>;
}
