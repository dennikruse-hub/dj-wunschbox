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
    }, 400);

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
      setStatus({ type: 'error', text: 'Du hast bereits 3 Wünsche gesendet.' });
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
      <section style={styles.card}>

        <h1>🎧 DJ Wunschbox</h1>
        <p>Gib deinen Songwunsch ein</p>

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

          {/* SEARCH */}
          {searching && <p>🔎 Suche...</p>}

          {suggestions.map(track => {
            const active = selectedTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => chooseTrack(track)}
                style={{
                  ...styles.item,
                  border: active ? '2px solid #1db954' : '1px solid #333'
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
            );
          })}

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

        <p>{count}/3 Wünsche</p>

        {status && (
          <div style={styles.status}>
            <b>{status.text}</b>
            {status.track && (
              <p>
                {status.track.artist} - {status.track.title}
              </p>
            )}
          </div>
        )}

      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0b0b0b',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '90%',
    maxWidth: 500,
    background: '#111',
    padding: 20,
    borderRadius: 16
  },
  form: {
    display: 'grid',
    gap: 10
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid #333',
    background: '#000',
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
    alignItems: 'center'
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 6
  },
  status: {
    marginTop: 15,
    padding: 10,
    background: '#222',
    borderRadius: 10
  }
};
