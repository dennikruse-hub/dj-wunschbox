export default function RequestForm({
  form,
  update,
  submit,
  status,
  searching,
  suggestions,
  chooseTrack,
  selectedTrack,
  limitReached
}) {
  const visibleTracks = selectedTrack ? [selectedTrack] : suggestions.slice(0, 1);

  return (
    <form onSubmit={submit} style={styles.form}>
      <Field icon="👤" label="Dein Name">
        <input name="guest" value={form.guest} onChange={update} style={styles.input} placeholder="z. B. Dennis" />
      </Field>

      <Field icon="🎙️" label="Interpret">
        <input name="artist" value={form.artist} onChange={update} style={styles.input} placeholder="z. B. Roland Kaiser" />
      </Field>

      <Field icon="🎵" label="Songtitel">
        <input name="title" value={form.title} onChange={update} style={styles.input} placeholder="z. B. Warum hast du nicht nein gesagt" />
      </Field>

      <div style={styles.suggestionHead}>
        <span>🎧 SPOTIFY VORSCHLÄGE</span>
        <span style={styles.searchText}>{searching ? 'Suche läuft...' : ''}</span>
      </div>

      {visibleTracks.map(track => (
        <button type="button" key={track.id} onClick={() => chooseTrack(track)} style={styles.song}>
          {track.image && <img src={track.image} style={styles.cover} />}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <b>{track.title}</b>
            <div style={styles.artist}>{track.artist}</div>
          </div>
          <div style={styles.play}>▶</div>
        </button>
      ))}

      <button style={{
        ...styles.button,
        ...(limitReached ? styles.disabled : {})
      }} disabled={status?.type === 'loading' || limitReached}>
        <span style={styles.paper}>✈</span>
        <span>
          {limitReached ? 'LIMIT ERREICHT' : status?.type === 'loading' ? 'BITTE WARTEN...' : 'WUNSCH SENDEN'}
          <small style={styles.small}>
            {limitReached ? 'Nicht warten – tanzen! 🕺🔥' : 'Dein Song geht direkt an DJ Dennis'}
          </small>
        </span>
      </button>
    </form>
  );
}

function Field({ icon, label, children }) {
  return (
    <label style={styles.field}>
      <div style={styles.icon}>{icon}</div>
      <div style={styles.fieldContent}>
        <div style={styles.label}>{label}</div>
        {children}
      </div>
    </label>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: 9
  },
  field: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: 9,
    borderRadius: 18,
    background:
      'linear-gradient(135deg,rgba(0,229,255,.12),rgba(0,25,45,.48))',
    border: '1px solid rgba(0,229,255,.36)',
    boxShadow: 'inset 0 0 22px rgba(0,229,255,.08), 0 0 20px rgba(0,0,0,.25)'
  },
  icon: {
    width: 46,
    height: 46,
    minWidth: 46,
    borderRadius: 14,
    background: 'linear-gradient(135deg,#0ea5e9,#1db954,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    boxShadow: '0 0 18px rgba(0,229,255,.45)'
  },
  fieldContent: {
    flex: 1
  },
  label: {
    fontWeight: 900,
    fontSize: 13,
    marginBottom: 5,
    color: '#eafff1'
  },
  input: {
    width: '100%',
    height: 34,
    borderRadius: 11,
    border: '1px solid rgba(255,255,255,.25)',
    background: 'rgba(0,0,0,.62)',
    color: 'white',
    padding: '0 11px',
    fontSize: 14,
    outline: 'none'
  },
  suggestionHead: {
    marginTop: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#35ff75',
    fontWeight: 900,
    fontSize: 12
  },
  searchText: {
    color: '#ddd',
    fontWeight: 500,
    fontSize: 11
  },
  song: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 9,
    borderRadius: 18,
    background:
      'linear-gradient(135deg,rgba(0,255,120,.22),rgba(0,20,50,.72))',
    border: '1px solid #35ff75',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 0 26px rgba(29,185,84,.35)'
  },
  cover: {
    width: 58,
    height: 58,
    borderRadius: 13,
    objectFit: 'cover'
  },
  artist: {
    opacity: .75,
    marginTop: 3,
    fontSize: 13
  },
  play: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900
  },
  button: {
    marginTop: 4,
    minHeight: 66,
    border: 0,
    borderRadius: 20,
    background:
      'linear-gradient(135deg,#1db954 0%,#22c55e 40%,#00e5ff 70%,#7c3aed 100%)',
    color: 'white',
    fontWeight: 900,
    fontSize: 19,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    boxShadow: '0 0 38px rgba(29,185,84,.48), inset 0 1px 0 rgba(255,255,255,.35)'
  },
  disabled: {
    opacity: .75,
    filter: 'grayscale(.15)'
  },
  paper: {
    fontSize: 28
  },
  small: {
    display: 'block',
    fontSize: 10,
    fontWeight: 500,
    opacity: .88,
    marginTop: 2
  }
};
