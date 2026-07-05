export default function SelectedSong({ track }) {
  if (!track) return null;

  return (
    <div style={styles.box}>
      {track.image && (
        <img src={track.image} alt="Albumcover" style={styles.cover} />
      )}

      <div>
        <div style={styles.label}>Ausgewählter Song</div>
        <h3>{track.title}</h3>
        <p>{track.artist}</p>
      </div>
    </div>
  );
}

const styles = {
  box: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(29,185,84,.18), rgba(255,255,255,.04))',
    border: '1px solid rgba(29,185,84,.45)',
    borderRadius: 20,
    padding: 14
  },
  cover: {
    width: 86,
    height: 86,
    borderRadius: 16,
    objectFit: 'cover',
    boxShadow: '0 0 20px rgba(29,185,84,.35)'
  },
  label: {
    color: '#1db954',
    fontSize: 13,
    fontWeight: 900,
    marginBottom: 4
  }
};
