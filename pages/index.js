import { useState, useEffect } from 'react';
import PremiumHeader from '../components/PremiumHeader';
import PayPalSupport from '../components/PayPalSupport';
import RequestForm from '../components/RequestForm';
import BackgroundGlow from '../components/BackgroundGlow';

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
    setForm({ ...form, artist: track.artist, title: track.title });
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

      if (!res.ok) throw new Error(data.error || 'Fehler beim Senden.');

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
      <BackgroundGlow />

      <section style={styles.app}>
        <PremiumHeader />

        <RequestForm
          form={form}
          update={update}
          submit={submit}
          status={status}
          searching={searching}
          suggestions={suggestions}
          chooseTrack={chooseTrack}
          selectedTrack={selectedTrack}
        />

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

        <PayPalSupport />
      </section>
    </main>
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
  app: {
    width: '100%',
    maxWidth: 570,
    background: 'rgba(255,255,255,.065)',
    border: '1px solid rgba(255,255,255,.16)',
    borderRadius: 30,
    padding: 24,
    backdropFilter: 'blur(20px)',
    boxShadow: '0 0 70px rgba(29,185,84,.2), 0 30px 95px rgba(0,0,0,.78)',
    position: 'relative',
    zIndex: 2
  },
  counter: {
    marginTop: 14,
    opacity: .72,
    fontSize: 13
  },
  status: {
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    background: 'rgba(0,0,0,.38)',
    border: '1px solid rgba(255,255,255,.14)'
  },
  success: {
    border: '1px solid rgba(29,185,84,.8)'
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
  cover: {
    width: 50,
    height: 50,
    borderRadius: 12,
    objectFit: 'cover'
  }
};
