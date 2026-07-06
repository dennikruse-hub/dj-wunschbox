import { useEffect, useState } from 'react';

export default function Debug() {
  const [data, setData] = useState(null);

  async function load() {
    try {
      const res = await fetch('/api/debug-spotify');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setData({ error: err.message });
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>Spotify Diagnose</h1>

        <button onClick={load} style={styles.button}>
          Neu prüfen
        </button>

        {!data && <p>Lade...</p>}

        {data && (
          <pre style={styles.pre}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#050505',
    color: '#fff',
    padding: 20,
    fontFamily: 'Arial'
  },
  card: {
    maxWidth: 900,
    margin: '0 auto',
    background: '#111',
    border: '1px solid #1db954',
    borderRadius: 16,
    padding: 20
  },
  button: {
    background: '#1db954',
    border: 0,
    borderRadius: 10,
    padding: '12px 16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: 20
  },
  pre: {
    background: '#000',
    color: '#7dffad',
    padding: 16,
    borderRadius: 12,
    overflow: 'auto',
    whiteSpace: 'pre-wrap'
  }
};
