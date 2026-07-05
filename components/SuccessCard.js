export default function SuccessCard({ status }) {
  if (!status) return null;

  const success = status.type === 'success';
  const error = status.type === 'error';
  const loading = status.type === 'loading';

  return (
    <div
      style={{
        ...styles.box,
        ...(success ? styles.success : {}),
        ...(error ? styles.error : {}),
        ...(loading ? styles.loading : {})
      }}
    >
      <strong style={{ fontSize: 18 }}>{status.text}</strong>

      {status.track && (
        <div style={styles.track}>
          {status.track.image && (
            <img
              src={status.track.image}
              alt="Albumcover"
              style={styles.cover}
            />
          )}

          <div>
            <h3 style={{ margin: 0 }}>{status.track.artist}</h3>
            <p style={{ margin: "6px 0" }}>{status.track.title}</p>

            <div style={styles.badge}>
              ✅ Zur Spotify-Playlist hinzugefügt
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  box: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20
  },

  success: {
    background:
      "linear-gradient(135deg,#0d3b1d,#0a2413)",
    border: "1px solid #1db954"
  },

  error: {
    background: "#3b1010",
    border: "1px solid #ff4b4b"
  },

  loading: {
    background: "#181818",
    border: "1px solid #555"
  },

  track: {
    marginTop: 18,
    display: "flex",
    gap: 16,
    alignItems: "center"
  },

  cover: {
    width: 90,
    height: 90,
    borderRadius: 14,
    objectFit: "cover",
    boxShadow: "0 0 20px rgba(29,185,84,.35)"
  },

  badge: {
    display: "inline-block",
    marginTop: 8,
    background: "#1db954",
    color: "#021607",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: "bold",
    fontSize: 13
  }
};
