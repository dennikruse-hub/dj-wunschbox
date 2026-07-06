export default function RequestForm({
  form,
  update,
  submit,
  status,
  searching,
  suggestions,
  chooseTrack,
  selectedTrack
}) {
  return (
    <form onSubmit={submit} style={styles.form}>
      <Field label="👤 Dein Name">
        <input name="guest" value={form.guest} onChange={update} style={styles.input} placeholder="z. B. Dennis" />
      </Field>

      <Field label="🎤 Interpret">
        <input name="artist" value={form.artist} onChange={update} style={styles.input} placeholder="z. B. Roland Kaiser" />
      </Field>

      <Field label="🎵 Songtitel">
        <input name="title" value={form.title} onChange={update} style={styles.input} placeholder="z. B. Warum hast du nicht nein gesagt" />
      </Field>

      {searching && <div style={styles.searching}>🔎 Spotify sucht passende Songs...</div>}

      {suggestions.length > 0 && (
        <div style={styles.suggestionBox}>
          {suggestions.map(track => (
            <button type="button" key={track.id} onClick={() => chooseTrack(track)} style={styles.song}>
              {track.image && <img src={track.image} style={styles.cover} />}
              <div style={{ textAlign: 'left' }}>
                <b>{track.title}</b>
                <div style={styles.artist}>{track.artist}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedTrack && (
        <div style={styles.selected}>
          {selectedTrack.image && <img src={selectedTrack.image} style={styles.selectedCover} />}
          <div>
            <div style={styles.selectedLabel}>✅ Spotify gefunden</div>
            <b>{selectedTrack.title}</b>
            <div style={styles.artist}>{selectedTrack.artist}</div>
          </div>
        </div>
      )}

      <Field label="💬 Gruß optional">
        <textarea
          name="message"
          value={form.message}
          onChange={update}
          style={styles.textarea}
          placeholder="Gruß an DJ Dennis oder das Geburtstagskind..."
        />
      </Field>

      <button style={styles.button} disabled={status?.type === 'loading'}>
        {status?.type === 'loading' ? 'Bitte warten...' : '🎵 WUNSCH SENDEN'}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <div style={styles.label}>{label}</div>
      {children}
    </label>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: 14
  },
  field: {
    display: 'grid',
    gap: 8,
    background: 'rgba(0,0,0,.28)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 20,
    padding: 14,
    boxShadow: 'inset 0 0 25px rgba(255,255,255,.025)'
  },
  label: {
    fontWeight: 900,
    fontSize: 14,
    color: '#eafff1'
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 15,
    border: '1px solid rgba(255,255,255,.16)',
    background: 'rgba(0,0,0,.6)',
    color: 'white',
    outline: 'none',
    fontSize: 16
  },
  textarea: {
    width: '100%',
    padding: 14,
    borderRadius: 15,
    border: '1px solid rgba(255,255,255,.16)',
    background: 'rgba(0,0,0,.6)',
    color: 'white',
    outline: 'none',
    fontSize: 16,
    minHeight: 86
  },
  searching: {
    padding: 13,
    borderRadius: 16,
    background: 'rgba(29,185,84,.14)',
    border: '1px solid rgba(29,185,84,.35)',
    color: '#b7ffd0',
    fontWeight: 800
  },
  suggestionBox: {
    display: 'grid',
    gap: 10
  },
  song: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    background: 'rgba(255,255,255,.065)',
    border: '1px solid rgba(29,185,84,.28)',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(0,0,0,.25)'
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 12,
    objectFit: 'cover'
  },
  artist: {
    fontSize: 13,
    opacity: .72,
    marginTop: 3
  },
  selected: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    background: 'linear-gradient(135deg,rgba(29,185,84,.2),rgba(124,58,237,.16))',
    border: '1px solid rgba(29,185,84,.6)',
    boxShadow: '0 0 30px rgba(29,185,84,.18)'
  },
  selectedCover: {
    width: 76,
    height: 76,
    borderRadius: 16,
    objectFit: 'cover'
  },
  selectedLabel: {
    color: '#1db954',
    fontWeight: 900,
    fontSize: 12,
    marginBottom: 5
  },
  button: {
    padding: 18,
    borderRadius: 20,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 17,
    cursor: 'pointer',
    boxShadow: '0 0 38px rgba(29,185,84,.38)'
  }
};
