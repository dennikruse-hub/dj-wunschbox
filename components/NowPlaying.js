export default function NowPlaying({ track }) {
  if (!track) return null;

  return (
    <div style={styles.box}>
      <div style={styles.label}>🎧 JETZT LÄUFT</div>

      <div style={styles.content}>
        {track.image && (
          <img src={track.image} style={styles.img} />
        )}

        <div>
          <h2 style={{ margin: 0 }}>{track.title}</h2>
          <p style={{ margin: '5px 0' }}>{track.artist}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  box: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    background: 'linear-gradient(135deg,#1db95422,#000)',
    border: '1px solid #1db954',
    boxShadow: '0 0 30px rgba(29,185,84,0.3)'
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 10
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: 15
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 10
  }
};
