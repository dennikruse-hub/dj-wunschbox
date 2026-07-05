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
    }, 300);

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
      setStatus({ type: 'error', text: 'Max 3 Wünsche pro Gerät' });
      return;
    }

    try {
      setStatus({ type: 'loading', text: 'Dein Wunsch wird gesendet...' });

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
        text: '🎉 Wunsch gesendet!',
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

      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          🎧 <span>DJ DENNIS</span>
        </div>

        <h1 style={styles.title}>WUNSCHBOX</h1>
        <p style={styles.subtitle}>
          Scan QR-Code → Song wählen → Party starten 🔥
        </p>

        {/* FORM */}
        <form onSubmit={submit} style={styles.form}>

          <input
            name="guest"
            placeholder="Dein Name"
            value={form.guest}
            onChange={update}
            style={styles.input}
          />

          <input
            name="artist"
            placeholder="Interpret"
            value={form.artist}
            onChange={update}
            style={styles.input}
          />

          <input
            name="title"
            placeholder="Songtitel"
            value={form.title}
            onChange={update}
            style={styles.input}
          />

          {/* SUGGESTIONS */}
          {searching && (
            <div style={styles.search}>
              🔎 Spotify sucht...
            </div>
          )}

          {suggestions.map(track => (
            <div
              key={track.id}
              onClick={() => chooseTrack(track)}
              style={styles.song}
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

          {/* MESSAGE */}
          <textarea
            name="message"
            placeholder="Gruß (optional)"
            value={form.message}
            onChange={update}
            style={styles.textarea}
          />

          {/* BUTTON */}
          <button style={styles.button}>
            🎵 WUNSCH SENDEN
          </button>

        </form>

        {/* COUNT */}
        <div style={styles.counter}>
          Wünsche: {count}/3
        </div>

        {/* STATUS */}
        {status && (
          <div style={styles.status}>
            <b>{status.text}</b>

            {status.track && (
              <div style={styles.track}>
                <img src={status.track.image} style={styles.cover} />
                <div>
                  {status.track.artist} - {status.track.title}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAYPAL */}
        <div style={styles.pay}>
          <h3>💚 DJ Support</h3>
          <p>Wenn dir die Musik gefällt ❤️</p>

          <a
            href="https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG"
            target="_blank"
            style={styles.paybtn}
          >
            💸 Trinkgeld geben
          </a>
        </div>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top,#a855f755,#000 60%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial',
    color: 'white',
    padding: 15
  },
  glow: {
    position: 'absolute',
    width: 500,
    height: 500,
    background: '#1db95433',
    filter: 'blur(140px)'
  },
  container: {
    width: '100%',
    maxWidth: 520,
    background: '#0b0b0f',
    border: '1px solid #2a2a2a',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 0 50px rgba(0,0,0,0.8)'
  },
  header: {
    color: '#1db954',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 38,
    margin: '10px 0 0'
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 20
  },
  form: {
    display: 'grid',
    gap: 10
  },
  input: {
    padding: 12,
    borderRadius: 12,
    border: '1px solid #333',
    background: '#111',
    color: '#fff'
  },
  textarea: {
    padding: 12,
    borderRadius: 12,
    border: '1px solid #333',
    background: '#111',
    color: '#fff',
    minHeight: 80
  },
  button: {
    padding: 14,
    background: '#1db954',
    border: 0,
    borderRadius: 12,
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  song: {
    display: 'flex',
    gap: 10,
    padding: 10,
    background: '#111',
    borderRadius: 10,
    marginTop: 6,
    cursor: 'pointer'
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 6
  },
  search: {
    padding: 10,
    fontSize: 13,
    opacity: 0.7
  },
  counter: {
    marginTop: 10,
    opacity: 0.7
  },
  status: {
    marginTop: 15,
    padding: 10,
    background: '#111',
    borderRadius: 10
  },
  track: {
    display: 'flex',
    gap: 10,
    marginTop: 8,
    alignItems: 'center'
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 6
  },
  pay: {
    marginTop: 25,
    textAlign: 'center',
    padding: 15,
    borderTop: '1px solid #333'
  },
  paybtn: {
    display: 'inline-block',
    marginTop: 10,
    padding: '12px 16px',
    background: '#1db954',
    color: '#000',
    borderRadius: 10,
    fontWeight: 'bold',
    textDecoration: 'none'
  }
};
