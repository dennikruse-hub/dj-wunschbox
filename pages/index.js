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
      setStatus({ type: 'error', text: 'Maximal 3 Wünsche pro Gerät.' });
      return;
    }

    try {
      setStatus({ type: 'loading', text: 'Sende deinen Wunsch...' });

      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Fehler beim Senden.');
      }

      localStorage.setItem('djwunschbox_count', String(currentCount + 1));
      setCount(currentCount + 1);

      setStatus({
        type: 'success',
        text: '🎉 Wunsch wurde erfolgreich gesendet!',
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
      <div style={styles.bg}></div>

      <header style={styles.header}>
        <div style={styles.logo}>🎧 DJ DENNIS</div>
        <div style={styles.subtitle}>WUNSCHBOX LIVE SYSTEM</div>
      </header>

      <section style={styles.grid}>
        <form onSubmit={submit} style={styles.card}>
          <h2>🎵 Wunsch senden</h2>

          <input
            name="artist"
            value={form.artist}
            onChange={update}
            style={styles.input}
            placeholder="Interpret"
          />

          <input
            name="title"
            value={form.title}
            onChange={update}
            style={styles.input}
            placeholder="Songtitel"
          />

          <input
            name="guest"
            value={form.guest}
            onChange={update}
            style={styles.input}
            placeholder="Dein Name"
          />

          {searching && (
            <div style={styles.searching}>🔎 Spotify sucht passende Songs...</div>
          )}

          {suggestions.map(track => (
            <div key={track.id} onClick={() => chooseTrack(track)} style={styles.song}>
              {track.image && <img src={track.image} style={styles.cover} />}
              <div>
                <b>{track.title}</b>
                <div style={styles.artist}>{track.artist}</div>
              </div>
            </div>
          ))}

          {selectedTrack && (
            <div style={styles.selected}>
              {selectedTrack.image && <img src={selectedTrack.image} style={styles.selectedCover} />}
              <div>
                <b>Ausgewählt:</b>
                <div>{selectedTrack.artist} – {selectedTrack.title}</div>
              </div>
            </div>
          )}

          <textarea
            name="message"
            value={form.message}
            onChange={update}
            style={styles.textarea}
            placeholder="Gruß optional"
          />

          <button style={styles.button} disabled={status?.type === 'loading'}>
            {status?.type === 'loading' ? 'Bitte warten...' : '🎧 Wunsch senden'}
          </button>

          <div style={styles.counter}>Gesendete Wünsche: {count}/3</div>

          {status && (
            <div style={{
              ...styles.status,
              ...(status.type === 'success' ? styles.success : {}),
              ...(status.type === 'error' ? styles.error : {})
            }}>
              <b>{status.text}</b>
              {status.track && (
                <div style={styles.statusTrack}>
                  {status.track.image && <img src={status.track.image} style={styles.cover} />}
                  <div>{status.track.artist} – {status.track.title}</div>
                </div>
              )}
            </div>
          )}
        </form>

        <div style={styles.card}>
          <h2>💚 Support DJ</h2>

          <div style={styles.supportBox}>
            Wenn dir die Musik gefällt ❤️
          </div>

          <a
            href="https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG"
            style={styles.paypal}
            target="_blank"
          >
            💸 Trinkgeld geben
          </a>

          <div style={styles.info}>
            📱 QR Code scannen → Wunsch senden
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#05060a',
    color: 'white',
    fontFamily: 'Arial',
    overflow: 'auto',
    paddingBottom: 80
  },
  bg: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at 20% 20%, #1db95433, transparent 40%), radial-gradient(circle at 80% 30%, #7c3aed33, transparent 40%), #05060a',
    pointerEvents: 'none'
  },
  header: {
    position: 'relative',
    textAlign: 'center',
    padding: 30,
    zIndex: 2
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1db954',
    letterSpacing: 2
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 8
  },
  grid: {
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20,
    padding: 30,
    maxWidth: 1100,
    margin: '0 auto'
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(29,185,84,0.25)',
    borderRadius: 20,
    padding: 20,
    backdropFilter: 'blur(10px)'
  },
  input: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: '1px solid #333',
    background: '#0b0b0f',
    color: 'white'
  },
  textarea: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: '1px solid #333',
    background: '#0b0b0f',
    color: 'white',
    minHeight: 80
  },
  button: {
    marginTop: 15,
    width: '100%',
    padding: 14,
    borderRadius: 12,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: 'black',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  searching: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: 'rgba(29,185,84,0.12)',
    color: '#b7ffd0'
  },
  song: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: 10,
    marginTop: 8,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(29,185,84,0.25)',
    cursor: 'pointer'
  },
  cover: {
    width: 46,
    height: 46,
    borderRadius: 8,
    objectFit: 'cover'
  },
  artist: {
    fontSize: 13,
    opacity: 0.7
  },
  selected: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    background: 'rgba(29,185,84,0.15)',
    border: '1px solid #1db954'
  },
  selectedCover: {
    width: 60,
    height: 60,
    borderRadius: 10,
    objectFit: 'cover'
  },
  counter: {
    marginTop: 10,
    fontSize: 13,
    opacity: 0.75
  },
  status: {
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    background: '#111'
  },
  success: {
    border: '1px solid #1db954'
  },
  error: {
    border: '1px solid #ff4444',
    color: '#ffaaaa'
  },
  statusTrack: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginTop: 8
  },
  paypal: {
    display: 'block',
    marginTop: 15,
    padding: 14,
    background: '#1db954',
    color: '#000',
    textAlign: 'center',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  supportBox: {
    padding: 15,
    marginTop: 10,
    borderRadius: 12,
    background: 'rgba(29,185,84,0.1)'
  },
  info: {
    marginTop: 15,
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center'
  }
};
