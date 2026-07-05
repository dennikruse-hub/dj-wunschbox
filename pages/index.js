import { useState, useEffect } from 'react';
import Header from '../components/Header';
import InputCard from '../components/InputCard';
import Confetti from '../components/Confetti';
import SongSuggestions from '../components/SongSuggestions';
import SelectedSong from '../components/SelectedSong';
import SuccessCard from '../components/SuccessCard';

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
    <main style={styles.page}>
      {confetti && <Confetti />}

      <section style={styles.app}>
        <Header />

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

          <SongSuggestions
            searching={searching}
            suggestions={suggestions}
            chooseTrack={chooseTrack}
          />

          <SelectedSong track={selectedTrack} />

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

        <SuccessCard status={status} />

        <footer style={styles.footer}>Powered by Spotify · DJ Dennis</footer>
      </section>
    </main>
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
  button: {
    marginTop: 10,
    border: 0,
    borderRadius: 18,
    padding: 18,
    fontSize: 18,
    fontWeight: 900,
    background: 'linear-gradient(135deg,#1db954,#35ff75)',
    color: '#021607',
    boxShadow: '0 0 35px rgba(29,185,84,.55)',
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
  footer: {
    textAlign: 'center',
    marginTop: 22,
    color: '#aaa',
    fontSize: 14
  }
};
