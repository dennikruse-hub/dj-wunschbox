import { useState, useEffect } from 'react';

export default function Home() {
  const [form, setForm] = useState({ artist: '', title: '', guest: '', message: '' });
  const [status, setStatus] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(Number(localStorage.getItem('djwunschbox_count') || '0'));
  }, []);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: 'loading', text: 'Suche Song bei Spotify ...' });
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
      setStatus({ type: 'success', text: data.duplicate ? 'Der Song ist schon in der Wunschliste.' : 'Wunsch wurde zur Spotify-Playlist hinzugefügt!', track: data.track });
      setForm({ artist: '', title: '', guest: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  }

  return (
    <main className="page">
      <section className="card">
        <div className="badge">🎧 DJ Dennis</div>
        <h1>Wunschbox</h1>
        <p className="muted">Scanne den QR-Code, sende deinen Musikwunsch und ich packe ihn in meine Spotify-Wunschliste.</p>
        <form onSubmit={submit} className="form">
          <label>Interpret<input name="artist" value={form.artist} onChange={update} placeholder="z. B. Roland Kaiser" /></label>
          <label>Songtitel<input name="title" value={form.title} onChange={update} placeholder="z. B. Warum hast du nicht nein gesagt" /></label>
          <label>Dein Name optional<input name="guest" value={form.guest} onChange={update} placeholder="z. B. Dennis" /></label>
          <label>Gruß optional<textarea name="message" value={form.message} onChange={update} placeholder="Gruß an das Brautpaar oder Geburtstagskind" /></label>
          <button disabled={status?.type === 'loading'}>{status?.type === 'loading' ? 'Bitte warten ...' : '🎵 Musikwunsch senden'}</button>
        </form>
        <p className="counter">Gesendete Wünsche auf diesem Gerät: {count}/3</p>
        {status && <div className={`status ${status.type}`}>
          <strong>{status.text}</strong>
          {status.track && <p>{status.track.artist} – {status.track.title}</p>}
        </div>}
      </section>
    </main>
  );
}
