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

      <button style={styles.button} disabled={status?.type === 'loading'}>
        <span style={styles.paper}>✈</span>
        <span>
          {status?.type === 'loading' ? 'BITTE WARTEN...' : 'WUNSCH SENDEN'}
          <small style={styles.small}>Dein Song geht direkt an DJ Dennis</small>
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
    gap: 8
  },
  field: {
    display: 'flex',
    gap: 9,
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    background: 'rgba(0,25,45,.48)',
    border: '1px solid rgba(0,229,255,.32)',
    boxShadow: 'inset 0 0 22px rgba(0,229,255,.08)'
  },
  icon: {
    width: 43,
    height: 43,
    minWidth: 43,
    borderRadius: 12,
    background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    boxShadow: '0 0 16px rgba(0,229,255,.45)'
  },
  fieldContent: {
    flex: 1
  },
  label: {
    fontWeight: 900,
    fontSize: 13,
    marginBottom: 4
  },
  input: {
    width: '100%',
    height: 32,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,.25)',
    background: 'rgba(0,0,0,.58)',
    color: 'white',
    padding: '0 10px',
    fontSize: 13,
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
    padding: 8,
    borderRadius: 16,
    background: 'linear-gradient(135deg,rgba(0,255,120,.2),rgba(0,20,50,.68))',
    border: '1px solid #35ff75',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 0 25px rgba(29,185,84,.35)'
  },
  cover: {
    width: 54,
    height: 54,
    borderRadius: 11,
    objectFit: 'cover'
  },
  artist: {
    opacity: .75,
    marginTop: 3,
    fontSize: 13
  },
  play: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900
  },
  button: {
    marginTop: 2,
    minHeight: 62,
    border: 0,
    borderRadius: 17,
    background: 'linear-gradient(135deg,#1db954 0%,#22c55e 42%,#7c3aed 100%)',
    color: 'white',
    fontWeight: 900,
    fontSize: 19,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    boxShadow: '0 0 35px rgba(29,185,84,.45)'
  },
  paper: {
    fontSize: 27
  },
  small: {
    display: 'block',
    fontSize: 10,
    fontWeight: 500,
    opacity: .85,
    marginTop: 2
  }
};
