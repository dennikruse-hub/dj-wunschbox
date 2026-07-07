import { useState, useEffect } from 'react';
import PremiumHeader from '../components/PremiumHeader';
import RequestForm from '../components/RequestForm';
import BackgroundGlow from '../components/BackgroundGlow';
import GuestPanel from '../components/GuestPanel';

const LIMIT_MAX = 3;
const LIMIT_TIME = 25 * 60 * 1000;
const LIMIT_KEY = 'djwunschbox_limit';

function getLimitData() {
  const now = Date.now();

  try {
    const saved = JSON.parse(localStorage.getItem(LIMIT_KEY) || 'null');

    if (!saved || !saved.resetAt || now >= saved.resetAt) {
      const fresh = { count: 0, resetAt: now + LIMIT_TIME };
      localStorage.setItem(LIMIT_KEY, JSON.stringify(fresh));
      return fresh;
    }

    return saved;
  } catch {
    const fresh = { count: 0, resetAt: now + LIMIT_TIME };
    localStorage.setItem(LIMIT_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export default function Home() {
  const [form, setForm] = useState({ artist: '', title: '', guest: '', message: '' });
  const [status, setStatus] = useState(null);
  const [count, setCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    const limit = getLimitData();
    setCount(limit.count);
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
    setForm({ ...form, artist: track.artist, title: track.title });
    setSuggestions([]);
  }

  async function submit(e) {
    e.preventDefault();

    const limit = getLimitData();

    if (limit.count >= LIMIT_MAX) {
      setStatus({
        type: 'error',
        text: 'Maximal 3 Wünsche erreicht. Nach 25 Minuten sind wieder neue Wünsche möglich.'
      });
      setCount(limit.count);
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

      const nextLimit = {
        count: limit.count + 1,
        resetAt: limit.resetAt
      };

      localStorage.setItem(LIMIT_KEY, JSON.stringify(nextLimit));
      setCount(nextLimit.count);

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

        <div style={styles.counterBox}>
          <div>Gesendete Wünsche in diesem Zeitfenster</div>
          <strong>{count} / 3</strong>
          <div style={styles.progress}>
            <div style={{ ...styles.progressFill, width: `${Math.min(count / 3, 1) * 100}%` }}></div>
          </div>
          <small>Nach 25 Minuten sind wieder 3 neue Wünsche möglich.</small>
        </div>

        {status && (
          <div style={{
            ...styles.status,
            ...(status.type === 'success' ? styles.success : {}),
            ...(status.type === 'error' ? styles.error : {})
          }}>
            <b>{status.text}</b>
          </div>
        )}

        <GuestPanel />
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#02030a',
    color: 'white',
    fontFamily: 'Arial, Helvetica, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    position: 'relative',
    overflow: 'auto'
  },
  app: {
    width: '100%',
    maxWidth: 420,
    marginTop: 6,
    padding: 14,
    borderRadius: 28,
    background:
      'radial-gradient(circle at 20% 15%,rgba(29,185,84,.26),transparent 30%), radial-gradient(circle at 90% 55%,rgba(124,58,237,.30),transparent 40%), rgba(2,6,23,.88)',
    border: '1px solid rgba(255,255,255,.18)',
    boxShadow: '0 0 50px rgba(29,185,84,.22), 0 25px 80px rgba(0,0,0,.85)',
    backdropFilter: 'blur(18px)',
    position: 'relative',
    zIndex: 2
  },
  counterBox: {
    marginTop: 10,
    padding: 11,
    borderRadius: 16,
    background: 'rgba(0,0,0,.35)',
    border: '1px solid rgba(255,255,255,.16)',
    display: 'grid',
    gap: 7,
    color: '#ddd'
  },
  progress: {
    height: 7,
    borderRadius: 999,
    background: 'rgba(255,255,255,.12)',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: '#22c55e',
    borderRadius: 999
  },
  status: {
    marginTop: 10,
    padding: 11,
    borderRadius: 14,
    background: 'rgba(0,0,0,.42)',
    border: '1px solid rgba(255,255,255,.14)'
  },
  success: {
    border: '1px solid #22c55e'
  },
  error: {
    border: '1px solid #ff4444',
    color: '#ffaaaa'
  }
};
