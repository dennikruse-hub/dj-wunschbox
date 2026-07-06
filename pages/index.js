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
      setStatus({ type: 'loading', text: 'Dein Wunsch wird gesendet...' });

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
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <section style={styles.app}>
        <div style={styles.topBadge}>● LIVE PARTY MODE</div>

        <header style={styles.header}>
          <div style={styles.logoCircle}>🎧</div>
          <div>
            <div style={styles.dj}>DJ DENNIS</div>
            <h1 style={styles.title}>Wunschbox</h1>
            <p style={styles.subtitle}>Wünsch dir deinen Song direkt in die Spotify-Playlist.</p>
          </div>
        </header>

        <form onSubmit={submit} style={styles.form}>
          <Input label="👤 Dein Name">
            <input name="guest" value={form.guest} onChange={update} style={styles.input} placeholder="z. B. Dennis" />
          </Input>

          <Input label="🎤 Interpret">
            <input name="artist" value={form.artist} onChange={update} style={styles.input} placeholder="z. B. Roland Kaiser" />
          </Input>

          <Input label="🎵 Songtitel">
            <input name="title" value={form.title} onChange={update} style={styles.input} placeholder="z. B. Warum hast du nicht nein gesagt" />
          </Input>

          {searching && <div style={styles.searching}>🔎 Spotify sucht passende Songs...</div>}

          {suggestions.length > 0 && (
            <div style={styles.suggestionBox}>
              {suggestions.map(track => (
                <button type="button" key={track.id} onClick={() => chooseTrack(track)} style={styles.song}>
                  {track.image && <img src={track.image} style={styles.cover} />}
                  <div style={{ textAlign: 'left' }}>
                    <b>{track.title}</b>
                    <div style={styles.artist}>{track.artist}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedTrack && (
            <div style={styles.selected}>
              {selectedTrack.image && <img src={selectedTrack.image} style={styles.selectedCover} />}
              <div>
                <div style={styles.selectedLabel}>Spotify gefunden</div>
                <b>{selectedTrack.title}</b>
                <div style={styles.artist}>{selectedTrack.artist}</div>
              </div>
            </div>
          )}

          <Input label="💬 Gruß optional">
            <textarea name="message" value={form.message} onChange={update} style={styles.textarea} placeholder="Gruß an DJ Dennis oder das Geburtstagskind..." />
          </Input>

          <button style={styles.button} disabled={status?.type === 'loading'}>
            {status?.type === 'loading' ? 'Bitte warten...' : '🎵 WUNSCH SENDEN'}
          </button>
        </form>

        <div style={styles.counter}>Gesendete Wünsche auf diesem Gerät: {count}/3</div>

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

        <div style={styles.paypalCard}>
          <div>
            <b>💚 DJ Support</b>
            <p style={styles.payText}>Wenn dir die Musik gefällt, kannst du DJ Dennis unterstützen.</p>
          </div>

          <a
            href="https://www.paypal.com/donate/?hosted_button_id=F7AH256S64MDG"
            target="_blank"
            style={styles.paypal}
          >
            💸 Trinkgeld geben
          </a>
        </div>
      </section>
    </main>
  );
}

function Input({ label, children }) {
  return (
    <label style={styles.inputWrap}>
      <div style={styles.inputLabel}>{label}</div>
      {children}
    </label>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#04040a,#090014 45%,#020503)',
    color: 'white',
    fontFamily: 'Arial, Helvetica, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    position: 'relative',
    overflow: 'auto'
  },
  glowOne: {
    position: 'fixed',
    top: -120,
    left: -120,
    width: 360,
    height: 360,
    background: '#1db95455',
    filter: 'blur(90px)',
    borderRadius: '50%'
  },
  glowTwo: {
    position: 'fixed',
    right: -140,
    bottom: -120,
    width: 420,
    height: 420,
    background: '#7c3aed66',
    filter: 'blur(100px)',
    borderRadius: '50%'
  },
  app: {
    width: '100%',
    maxWidth: 560,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 28,
    padding: 24,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 0 60px rgba(29,185,84,0.18), 0 30px 90px rgba(0,0,0,0.75)',
    position: 'relative',
    zIndex: 2
  },
  topBadge: {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: 999,
    background: 'rgba(29,185,84,0.18)',
    border: '1px solid rgba(29,185,84,0.5)',
    color: '#7dffad',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 18
  },
  header: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    marginBottom: 22
  },
  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    boxShadow: '0 0 35px rgba(29,185,84,0.45)'
  },
  dj: {
    color: '#1db954',
    fontWeight: 900,
    letterSpacing: 2,
    fontSize: 14
  },
  title: {
    margin: '2px 0',
    fontSize: 42,
    lineHeight: 1
  },
  subtitle: {
    margin: 0,
    opacity: 0.72,
    lineHeight: 1.4
  },
  form: {
    display: 'grid',
    gap: 13
  },
  inputWrap: {
    display: 'grid',
    gap: 7,
    background: 'rgba(0,0,0,0.24)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 18,
    padding: 13
  },
  inputLabel: {
    fontWeight: 800,
    fontSize: 14,
    color: '#eafff1'
  },
  input: {
    width: '100%',
    padding: 13,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(0,0,0,0.55)',
    color: 'white',
    outline: 'none',
    fontSize: 16
  },
  textarea: {
    width: '100%',
    padding: 13,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(0,0,0,0.55)',
    color: 'white',
    outline: 'none',
    fontSize: 16,
    minHeight: 82
  },
  searching: {
    padding: 12,
    borderRadius: 16,
    background: 'rgba(29,185,84,0.14)',
    border: '1px solid rgba(29,185,84,0.35)',
    color: '#b7ffd0'
  },
  suggestionBox: {
    display: 'grid',
    gap: 9
  },
  song: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    padding: 11,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(29,185,84,0.25)',
    color: 'white',
    cursor: 'pointer'
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 10,
    objectFit: 'cover'
  },
  artist: {
    fontSize: 13,
    opacity: 0.72,
    marginTop: 3
  },
  selected: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    background: 'linear-gradient(135deg,rgba(29,185,84,0.18),rgba(124,58,237,0.16))',
    border: '1px solid rgba(29,185,84,0.55)'
  },
  selectedCover: {
    width: 72,
    height: 72,
    borderRadius: 15,
    objectFit: 'cover'
  },
  selectedLabel: {
    color: '#1db954',
    fontWeight: 900,
    fontSize: 12,
    marginBottom: 4
  },
  button: {
    padding: 17,
    borderRadius: 18,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 17,
    cursor: 'pointer',
    boxShadow: '0 0 35px rgba(29,185,84,0.35)'
  },
  counter: {
    marginTop: 14,
    opacity: 0.7,
    fontSize: 13
  },
  status: {
    marginTop: 16,
    padding: 15,
    borderRadius: 18,
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.12)'
  },
  success: {
    border: '1px solid rgba(29,185,84,0.75)'
  },
  error: {
    border: '1px solid #ff4444',
    color: '#ffaaaa'
  },
  statusTrack: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginTop: 10
  },
  paypalCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    background: 'rgba(0,0,0,0.28)',
    border: '1px solid rgba(255,255,255,0.12)',
    textAlign: 'center'
  },
  payText: {
    opacity: 0.7,
    margin: '8px 0 14px'
  },
  paypal: {
    display: 'block',
    padding: 14,
    background: '#1db954',
    color: '#000',
    borderRadius: 14,
    textDecoration: 'none',
    fontWeight: 900
  }
};
