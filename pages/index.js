import { useState, useEffect } from 'react';

export default function Home() {
  const [form, setForm] = useState({ artist: '', title: '', guest: '', message: '' });
  const [status, setStatus] = useState(null);
  const [count, setCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    setCount(Number(localStorage.getItem('djwunschbox_count') || '0'));
  }, []);

  useEffect(() => {
    const query = `${form.artist} ${form.title}`.trim();

    if (query.length < 3 || selectedTrack) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await fetch('/api/search?q=' + encodeURIComponent(query));
        const data = await res.json();
        setSuggestions(data.tracks || []);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [form.artist, form.title, selectedTrack]);

  function update(e) {
    setSelectedTrack(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function chooseTrack(track) {
    setSelectedTrack(track);
    setForm({
      ...form,
      artist: track.artist,
      title: track.title
    });
    setSuggestions([]);
  }

  async function submit(e) {
    e.preventDefault();

    const currentCount = Number(localStorage.getItem('djwunschbox_count') || '0');

    if (currentCount >= 3) {
      setStatus({ type: 'error', text: 'Limit erreicht (3 Wünsche)' });
      return;
    }

    try {
      setStatus({ type: 'loading', text: 'Sende Wunsch...' });

      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('djwunschbox_count', String(currentCount + 1));
      setCount(currentCount + 1);

      setStatus({
        type: 'success',
        text: '🎉 Wunsch erfolgreich gesendet!',
        track: data.track
      });

      setForm({ artist: '', title: '', guest: '', message: '' });
      setSuggestions([]);
      setSelectedTrack(null);

    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  }

  return (
    <main style={styles.page}>

      <div style={styles.glow}></div>

      <section style={styles.card}>

        <div style={styles.header}>
          🎧 <span>DJ DENNIS</span>
        </div>

        <h1 style={styles.title}>Wunschbox</h1>
        <p style={styles.subtitle}>
          Sende deinen Song direkt in die Playlist
        </p>

        <form onSubmit={submit} style={styles.form}>

          <input name="guest" placeholder="Dein Name" value={form.guest} onChange={update} style={styles.input} />
          <input name="artist" placeholder="Interpret" value={form.artist} onChange={update} style={styles.input} />
          <input name="title" placeholder="Songtitel" value={form.title} onChange={update} style={styles.input} />

          {searching && (
            <div style={styles.loading}>
              🔎 Spotify sucht...
            </div>
          )}

          {suggestions.map(track => (
            <div
              key={track.id}
              onClick={() => chooseTrack(track)}
              style={{
                ...styles.item,
                border: selectedTrack?.id === track.id
                  ? '2px solid #1db954'
                  : '1px solid #222'
              }}
            >
              {track.image && (
                <img src={track.image} style={styles.img} />
              )}

              <div>
                <b>{track.title}</b>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {track.artist}
                </div>
              </div>
            </div>
          ))}

          <textarea
            name="message"
            placeholder="Gruß (optional)"
            value={form.message}
            onChange={update}
            style={styles.input}
          />

          <button style={styles.button}>
            🎵 Wunsch senden
          </button>

        </form>

        <p style={styles.counter}>{count}/3 Wünsche</p>

        {status && (
          <div style={styles.status}>
            <b>{status.text}</b>
            {status.track && (
              <div style={{ marginTop: 5 }}>
                {status.track.artist} - {status.track.title}
              </div>
            )}
          </div>
        )}

        <div style={styles.tip}>
          💡 Tipp: Unterstütze den DJ mit Trinkgeld ❤️
        </div>

      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top,#1db95422,#000)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial',
    color: '#fff'
  },
  glow: {
    position: 'absolute',
    width: 500,
    height: 500,
    background: '#1db95433',
    filter: 'blur(120px)'
  },
  card: {
    width: '92%',
    maxWidth: 520,
    background: '#0d0d0d',
    padding: 24,
    borderRadius: 18,
    border: '1px solid #1db95433',
    boxShadow: '0 0 40px rgba(0,0,0,0.8)'
  },
  header: {
    color: '#1db954',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 34,
    margin: '10px 0 0'
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 20
  },
  form: { display: 'grid', gap: 10 },
  input: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid #222',
    background: '#111',
    color: '#fff'
  },
  button: {
    padding: 14,
    background: '#1db954',
    border: 0,
    borderRadius: 10,
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  item: {
    display: 'flex',
    gap: 10,
    padding: 10,
    marginTop: 6,
    borderRadius: 10,
    cursor: 'pointer',
    background: '#111'
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 6
  },
  loading: {
    padding: 10,
    background: '#111',
    borderRadius: 10,
    fontSize: 13
  },
  status: {
    marginTop: 15,
    padding: 10,
    background: '#111',
    borderRadius: 10,
    border: '1px solid #1db95433'
  },
  counter: {
    marginTop: 10,
    opacity: 0.7
  },
  tip: {
    marginTop: 15,
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center'
  }
};
