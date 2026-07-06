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
      <Input label="👤 Dein Name">
        <input name="guest" value={form.guest} onChange={update} style={styles.input} placeholder="z. B. Dennis" />
      </Input>

      <Input label="🎤 Interpret">
        <input name="artist" value={form.artist} onChange={update} style={styles.input} placeholder="z. B. Roland Kaiser" />
      </Input>

      <Input label="🎵 Songtitel">
        <input name="title" value={form.title} onChange={update} style={styles.input} placeholder="z. B. Warum hast du nicht nein gesagt" />
      </Input>

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
            <div style={styles.selectedLabel}>Spotify gefunden</div>
            <b>{selectedTrack.title}</b>
            <div style={styles.artist}>{selectedTrack.artist}</div>
          </div>
        </div>
      )}

      <Input label="💬 Gruß optional">
        <textarea name="message" value={form.message} onChange={update} style={styles.textarea} placeholder="Gruß an DJ Dennis oder das Geburtstagskind..." />
      </Input>

      <button style={styles.button} disabled={status?.type === 'loading'}>
        {status?.type === 'loading' ? 'Bitte warten...' : '🎵 WUNSCH SENDEN'}
      </button>
    </form>
  );
}

function Input({ label, children }) {
  return (
    <label style={styles.inputWrap}>
      <div style={styles.inputLabel}>{label}</div>
      {children}
    </label>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: 13
  },
  inputWrap: {
    display: 'grid',
    gap: 7,
    background: 'rgba(0,0,0,0.24)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 18,
    padding: 13
  },
  inputLabel: {
    fontWeight: 800,
    fontSize: 14,
    color: '#eafff1'
  },
  input: {
    width: '100%',
    padding: 13,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(0,0,0,0.55)',
    color: 'white',
    outline: 'none',
    fontSize: 16
  },
  textarea: {
    width: '100%',
    padding: 13,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(0,0,0,0.55)',
    color: 'white',
    outline: 'none',
    fontSize: 16,
    minHeight: 82
  },
  searching: {
    padding: 12,
    borderRadius: 16,
    background: 'rgba(29,185,84,0.14)',
    border: '1px solid rgba(29,185,84,0.35)',
    color: '#b7ffd0'
  },
  suggestionBox: {
    display: 'grid',
    gap: 9
  },
  song: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    padding: 11,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(29,185,84,0.25)',
    color: 'white',
    cursor: 'pointer'
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 10,
    objectFit: 'cover'
  },
  artist: {
    fontSize: 13,
    opacity: 0.72,
    marginTop: 3
  },
  selected: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    background: 'linear-gradient(135deg,rgba(29,185,84,0.18),rgba(124,58,237,0.16))',
    border: '1px solid rgba(29,185,84,0.55)'
  },
  selectedCover: {
    width: 72,
    height: 72,
    borderRadius: 15,
    objectFit: 'cover'
  },
  selectedLabel: {
    color: '#1db954',
    fontWeight: 900,
    fontSize: 12,
    marginBottom: 4
  },
  button: {
    padding: 17,
    borderRadius: 18,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 17,
    cursor: 'pointer',
    boxShadow: '0 0 35px rgba(29,185,84,0.35)'
  }
};
