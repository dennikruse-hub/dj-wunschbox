import { useState, useEffect } from 'react';

export default function Home() {
  const [form, setForm] = useState({ artist: '', title: '', guest: '', message: '' });
  const [status, setStatus] = useState(null);
  const [count, setCount] = useState(0);
  const [confetti, setConfetti] = useState(false);
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
    }, 500);

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

  function startConfetti() {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: 'loading', text: 'Suche deinen Song bei Spotify ...' });

    const currentCount = Number(localStorage.getItem('djwunschbox_count') || '0');

    if (currentCount >= 3) {
      setStatus({ type: 'error', text: 'Du hast bereits 3 Wünsche gesendet. Danke!' });
      return;
    }

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler beim Senden.');

      localStorage.setItem('djwunschbox_count', String(currentCount + 1));
      setCount(currentCount + 1);
      startConfetti();

      setStatus({
        type: 'success',
        text: 'Wunsch erfolgreich!',
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
    <>
      <style jsx global>{`
        @keyframes confettiFall {
          0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <main style={styles.page}>
        {confetti && <Confetti />}

        <section style={styles.app}>
          <header style={styles.header}>
            <div style={styles.logo}>🎧</div>
            <div>
              <div style={styles.dj}>DJ DENNIS</div>
              <div style={styles.title}>WUNSCHBOX</div>
            </div>
            <div style={styles.spotify}>● Spotify<br />verbunden</div>
          </header>

          <div style={styles.infoBox}>
            <div style={styles.infoIcon}>🎵</div>
            <p>Tippe Interpret oder Songtitel ein und wähle direkt einen Spotify-Vorschlag aus.</p>
          </div>

          <form onSubmit={submit} style={styles.form}>
            <InputCard icon="👤" label="Dein Name" optional>
              <input style={styles.input} name="guest" value={form.guest} onChange={update} placeholder="z. B. Dennis" />
            </InputCard>

            <InputCard icon="🎤" label="Interpret">
              <input style={styles.input} name="artist" value={form.artist} onChange={update} placeholder="z. B. Roland Kaiser" />
            </InputCard>

            <InputCard icon="🎵" label="Songtitel">
              <input style={styles.input} name="title" value={form.title} onChange={update} placeholder="z. B. Warum hast du nicht nein gesagt" />
            </InputCard>

            {searching && <div style={styles.searching}>🔎 Suche passende Songs...</div>}

            {suggestions.length > 0 && (
              <div style={styles.suggestions}>
                {suggestions.map((track) => {
  const isSelected = selectedTrack?.id === track.id;

  return (
    <button
      key={track.id}
      type="button"
      onClick={() => chooseTrack(track)}
      style={{
        ...styles.suggestion,
        border: isSelected
          ? '2px solid #1db954'
          : '1px solid rgba(29,185,84,.35)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        background: isSelected
          ? 'rgba(29,185,84,.15)'
          : 'rgba(255,255,255,.05)'
      }}
    >
      {track.image && (
        <img
          src={track.image}
          style={styles.suggestionImage}
          alt=""
        />
      )}

      <div style={styles.suggestionText}>
        <strong>{track.title}</strong>
        <span>{track.artist}</span>
      </div>
    </button>
  );
})}
                  <button type="button" key={track.id} style={styles.suggestion} onClick={() => chooseTrack(track)}>
                    {track.image && <img src={track.image} style={styles.suggestionImage} alt="" />}
                    <div style={styles.suggestionText}>
                      <strong>{track.title}</strong>
                      <span>{track.artist}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedTrack && (
              <div style={styles.selectedSong}>
                {selectedTrack.image && <img src={selectedTrack.image} style={styles.selectedCover} alt="Albumcover" />}
                <div>
                  <div style={styles.selectedLabel}>Ausgewählter Song</div>
                  <h3 style={{ margin: '4px 0' }}>{selectedTrack.title}</h3>
                  <p style={{ margin: 0 }}>{selectedTrack.artist}</p>
                </div>
              </div>
            )}

            <InputCard icon="💬" label="Gruß" optional>
              <textarea style={styles.textarea} name="message" value={form.message} onChange={update} placeholder="Dein Gruß..." />
            </InputCard>

            <button style={styles.button} disabled={status?.type === 'loading'}>
              {status?.type === 'loading' ? '🔎 Suche Song ...' : '🎵 MUSIKWUNSCH SENDEN'}
            </button>
          </form>

          <div style={styles.counter}>
            <span>👥 Gesendete Wünsche</span>
            <strong>{count}/3</strong>
          </div>

          {status && (
            <div style={{
              ...styles.status,
              ...(status.type === 'success' ? styles.success : {}),
              ...(status.type === 'error' ? styles.error : {}),
              ...(status.type === 'loading' ? styles.loading : {})
            }}>
              <strong>{status.text}</strong>

              {status.track && (
                <div style={styles.track}>
                  {status.track.image && <img src={status.track.image} style={styles.cover} alt="Albumcover" />}
                  <div>
                    <h3 style={{ margin: 0 }}>{status.track.artist}</h3>
                    <p>{status.track.title}</p>
                    <small>✅ Zur Spotify-Playlist hinzugefügt</small>
                  </div>
                </div>
              )}
            </div>
          )}

          <footer style={styles.footer}>Powered by Spotify · DJ Dennis</footer>
        </section>
      </main>
    </>
  );
}

function InputCard({ icon, label, optional, children }) {
  return (
    <label style={styles.field}>
      <div style={styles.iconCircle}>{icon}</div>
      <div style={styles.fieldContent}>
        <div style={styles.label}>
          {label} {optional && <span style={styles.optional}>(optional)</span>}
        </div>
        {children}
      </div>
    </label>
  );
}

function Confetti() {
  const colors = ['#1db954', '#35ff75', '#ffffff', '#ffd23f', '#ff4d8d', '#00e5ff'];
  const pieces = Array.from({ length: 45 });

  return (
    <div style={styles.confettiWrap}>
      {pieces.map((_, i) => (
        <span
          key={i}
          style={{
            ...styles.confettiPiece,
            left: `${(i * 23) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 10) * 0.08}s`,
            animationDuration: `${1.8 + (i % 5) * 0.25}s`
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, #1db95455, transparent 30%), radial-gradient(circle at bottom right, #00ff8855, transparent 25%), #020403',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    color: 'white',
    fontFamily: 'Arial, Helvetica, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  app: {
    width: '100%',
    maxWidth: 540,
    borderRadius: 30,
    padding: 22,
    background: 'rgba(3, 10, 7, 0.94)',
    border: '1px solid rgba(29,185,84,.45)',
    boxShadow: '0 0 60px rgba(29,185,84,.25), 0 30px 90px #000',
    position: 'relative',
    zIndex: 2
  },
  header: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 },
  logo: { fontSize: 52, filter: 'drop-shadow(0 0 15px #1db954)' },
  dj: { fontSize: 30, fontWeight: 900, letterSpacing: 1 },
  title: { color: '#1db954', fontSize: 25, fontWeight: 900, letterSpacing: 1 },
  spotify: {
    marginLeft: 'auto',
    border: '1px solid #1db954',
    borderRadius: 14,
    padding: '9px 12px',
    color: '#dfffe8',
    fontSize: 13,
    textAlign: 'center'
  },
  infoBox: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(29,185,84,.35)',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    lineHeight: 1.5
  },
  infoIcon: { fontSize: 40 },
  form: { display: 'grid', gap: 12 },
  field: {
    display: 'flex',
    gap: 14,
    background: 'rgba(255,255,255,.035)',
    border: '1px solid rgba(29,185,84,.35)',
    borderRadius: 18,
    padding: 14
  },
  iconCircle: {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: 999,
    background: 'rgba(29,185,84,.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24
  },
  fieldContent: { flex: 1, display: 'grid', gap: 8 },
  label: { fontWeight: 900 },
  optional: { color: '#aaa', fontWeight: 500 },
  input: {
    background: '#050505',
    color: 'white',
    border: '1px solid rgba(255,255,255,.2)',
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
    outline: 'none',
    width: '100%'
  },
  textarea: {
    background: '#050505',
    color: 'white',
    border: '1px solid rgba(255,255,255,.2)',
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
    minHeight: 95,
    outline: 'none',
    width: '100%'
  },
  searching: { color: '#bfffd0', padding: '8px', fontSize: 14 },
  suggestions: { display: 'grid', gap: 8 },
  suggestion: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: 10,
    borderRadius: 16,
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(29,185,84,.35)',
    cursor: 'pointer',
    color: 'white',
    textAlign: 'left'
  },
  suggestionImage: { width: 55, height: 55, borderRadius: 10, objectFit: 'cover' },
  suggestionText: { display: 'grid', gap: 4 },
  selectedSong: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(29,185,84,.18), rgba(255,255,255,.04))',
    border: '1px solid rgba(29,185,84,.45)',
    borderRadius: 20,
    padding: 14
  },
  selectedCover: {
    width: 86,
    height: 86,
    borderRadius: 16,
    objectFit: 'cover'
  },
  selectedLabel: {
    color: '#1db954',
    fontSize: 13,
    fontWeight: 900
  },
  button: {
    marginTop: 10,
    border: 0,
    borderRadius: 18,
    padding: 18,
    fontSize: 18,
    fontWeight: 900,
    background: 'linear-gradient(135deg,#1db954,#35ff75)',
    color: '#021607',
    cursor: 'pointer'
  },
  counter: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    border: '1px solid rgba(29,185,84,.35)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ddd'
  },
  status: { marginTop: 18, padding: 18, borderRadius: 20 },
  success: { background: 'linear-gradient(135deg,#0d3b1d,#092413)', border: '1px solid #1db954' },
  error: { background: '#3b1010', border: '1px solid #ff5555' },
  loading: { background: '#171717', border: '1px solid #555' },
  track: { marginTop: 14, display: 'flex', gap: 14, alignItems: 'center' },
  cover: { width: 95, height: 95, borderRadius: 14, objectFit: 'cover' },
  footer: { textAlign: 'center', marginTop: 22, color: '#aaa', fontSize: 14 },
  confettiWrap: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 99,
    overflow: 'hidden'
  },
  confettiPiece: {
    position: 'absolute',
    top: -30,
    width: 10,
    height: 18,
    borderRadius: 4,
    animationName: 'confettiFall',
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards'
  }
};
