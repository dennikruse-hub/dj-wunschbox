import { useState, useEffect } from 'react';
import PremiumHeader from '../components/PremiumHeader';
import RequestForm from '../components/RequestForm';
import BackgroundGlow from '../components/BackgroundGlow';
import GuestPanel from '../components/GuestPanel';
import LimitDanceOverlay from '../components/LimitDanceOverlay';

const LIMIT_MAX = 3;
const LIMIT_TIME = 25 * 60 * 1000;
const DANCE_TIME = 60 * 1000;
const LIMIT_KEY = 'djwunschbox_limit';

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const min = String(Math.floor(total / 60)).padStart(2, '0');
  const sec = String(total % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function freshLimit() {
  return { count: 0, resetAt: Date.now() + LIMIT_TIME, danceUntil: 0 };
}

function readLimit() {
  try {
    const now = Date.now();
    const saved = JSON.parse(localStorage.getItem(LIMIT_KEY) || 'null');

    if (!saved || !saved.resetAt || now >= saved.resetAt) {
      const fresh = freshLimit();
      localStorage.setItem(LIMIT_KEY, JSON.stringify(fresh));
      return fresh;
    }

    return saved;
  } catch {
    const fresh = freshLimit();
    localStorage.setItem(LIMIT_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export default function Home() {
  const [form, setForm] = useState({ artist: '', title: '', guest: '', message: '' });
  const [status, setStatus] = useState(null);
  const [limit, setLimit] = useState({ count: 0, resetAt: 0, danceUntil: 0 });
  const [now, setNow] = useState(Date.now());
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    setLimit(readLimit());

    const timer = setInterval(() => {
      setNow(Date.now());
      const current = readLimit();
      setLimit(current);
    }, 1000);

    return () => clearInterval(timer);
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

    const current = readLimit();

    if (current.count >= LIMIT_MAX) {
      setStatus({ type: 'error', text: '⏳ Neue Wünsche in ' + formatTime(current.resetAt - Date.now()) });
      setLimit(current);
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

      const nextCount = current.count + 1;
      const nextLimit = {
        count: nextCount,
        resetAt: current.resetAt,
        danceUntil: nextCount >= LIMIT_MAX ? Date.now() + DANCE_TIME : current.danceUntil || 0
      };

      localStorage.setItem(LIMIT_KEY, JSON.stringify(nextLimit));
      setLimit(nextLimit);

      setStatus({
        type: 'success',
        text: nextCount >= LIMIT_MAX
          ? '🎉 Wunsch gesendet! Jetzt ist Tanzzeit 🕺🔥'
          : '🎉 Wunsch erfolgreich gesendet!',
        track: data.track
      });

      setForm({ artist: '', title: '', guest: '', message: '' });
      setSuggestions([]);
      setSelectedTrack(null);
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  }

  const limitReached = limit.count >= LIMIT_MAX;
  const resetText = formatTime(limit.resetAt - now);
  const danceActive = limitReached && limit.danceUntil > now;
  const danceText = formatTime(limit.danceUntil - now);

  return (
    <main style={styles.page}>
      <BackgroundGlow />

      {danceActive && (
        <LimitDanceOverlay resetText={resetText} animationText={danceText} />
      )}

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
          limitReached={limitReached}
        />

        <div style={styles.counterBox}>
          <div>{limitReached ? '⏳ Neue Wünsche in' : 'Gesendete Wünsche in diesem Zeitfenster'}</div>
          <strong>{limitReached ? resetText : `${limit.count} / 3`}</strong>
          <div style={styles.progress}>
            <div style={{ ...styles.progressFill, width: `${Math.min(limit.count / 3, 1) * 100}%` }}></div>
          </div>
          <small>
            {limitReached
              ? 'Bis dahin gilt: Nicht warten – tanzen! 🕺🔥'
              : 'Nach 25 Minuten sind wieder 3 neue Wünsche möglich.'}
          </small>
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
  success: { border: '1px solid #22c55e' },
  error: { border: '1px solid #ff4444', color: '#ffaaaa' }
};
