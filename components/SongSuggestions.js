export default function SongSuggestions({ searching, suggestions, chooseTrack }) {
  if (searching) {
    return <div style={styles.searching}>🔎 Suche passende Songs...</div>;
  }

  if (!suggestions.length) return null;

  return (
    <div style={styles.list}>
      {suggestions.map(track => (
        <button
          key={track.id}
          type="button"
          style={styles.item}
          onClick={() => chooseTrack(track)}
        >
          {track.image && <img src={track.image} alt="" style={styles.image} />}

          <div style={styles.text}>
            <strong>{track.title}</strong>
            <span>{track.artist}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

const styles = {
  searching: {
    color: '#bfffd0',
    padding: '8px',
    fontSize: 14
  },
  list: {
    display: 'grid',
    gap: 8
  },
  item: {
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
  image: {
    width: 55,
    height: 55,
    borderRadius: 10,
    objectFit: 'cover'
  },
  text: {
    display: 'grid',
    gap: 4
  }
};
