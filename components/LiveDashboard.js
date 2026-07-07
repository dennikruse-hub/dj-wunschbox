export default function LiveDashboard({
  tracks,
  likes,
  history,
  popup,
  nowPlaying,
  clock,
  runtimeText,
  newIds,
  newCount,
  onQR,
  onLiveMode,
  liveModeActive,
  soundActive,
  wakeActive,
  setAsNowPlaying,
  markPlayed,
  removeTrack
}) {
  const nextSong = tracks[0];
  const queue = tracks.slice(1);
  const totalLikes = Object.values(likes).reduce((a, b) => a + b, 0);
  const topLiked = [...tracks]
    .sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0))
    .slice(0, 5);

  return (
    <main style={styles.page}>
      {popup && (
        <div style={styles.popup}>
          🔔 NEUER WUNSCH
          <strong>{popup.title}</strong>
          <span>{popup.artist}</span>
        </div>
      )}

      <section style={styles.dashboard}>
        <header style={styles.header}>
          <div>
            <div style={styles.live}>● LIVE AUFTRITTSMODUS</div>
            <h1 style={styles.title}>🎧 DJ Dennis Arbeitsplatz</h1>
          </div>

          <div style={styles.timeBox}>
            <strong>{clock.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</strong>
            <span>Auftritt: {runtimeText()}</span>
          </div>

          <div style={styles.headerButtons}>
            <button style={styles.liveButton} onClick={onLiveMode}>
              🎛 Live-Modus
            </button>
            <button style={styles.qrButton} onClick={onQR}>📱 QR-Code</button>
            <a href="/" style={styles.guestButton}>Gäste-App</a>
          </div>
        </header>

        <div style={styles.modeBar}>
          <span>{liveModeActive ? '🟢 Vollbild aktiv' : '⚪ Vollbild bereit'}</span>
          <span>{soundActive ? '🔊 Ton aktiv' : '🔇 Ton aus'}</span>
          <span>{wakeActive ? '🔒 Tablet bleibt wach' : '🔓 Wake-Lock bereit'}</span>
        </div>

        <div style={styles.stats}>
          <Stat label="Wünsche" value={tracks.length} />
          <Stat label="Likes" value={totalLikes} />
          <Stat label="Gespielt" value={history.length} />
          <Stat label="Neu" value={newCount} />
        </div>

        <section style={styles.liveGrid}>
          <div style={styles.nowPlaying}>
            <div style={styles.sectionLabel}>🎶 JETZT LÄUFT</div>

            {nowPlaying ? (
              <div style={styles.nowInner}>
                {nowPlaying.image && <img src={nowPlaying.image} style={styles.nowImg} />}
                <h2>{nowPlaying.title}</h2>
                <p>{nowPlaying.artist}</p>
                <div style={styles.fakeProgress}>
                  <div style={styles.fakeProgressFill}></div>
                </div>
              </div>
            ) : (
              <Empty text="Noch kein Song als „Jetzt läuft“ gesetzt." />
            )}
          </div>

          <div style={styles.nextBox}>
            <div style={styles.sectionLabel}>⏭ ALS NÄCHSTES</div>

            {nextSong ? (
              <div style={styles.nextContent}>
                {nextSong.image && <img src={nextSong.image} style={styles.nextCover} />}

                <div style={styles.nextInfo}>
                  <h2>{nextSong.title}</h2>
                  <p>{nextSong.artist}</p>
                  <strong>❤️ {likes[nextSong.id] || 0} Likes</strong>
                </div>

                <div style={styles.bigActions}>
                  <button style={styles.nowBtn} onClick={() => setAsNowPlaying(nextSong)}>▶ Jetzt läuft</button>
                  <button style={styles.played} onClick={() => markPlayed(nextSong)}>✔ Gespielt</button>
                  <button style={styles.delete} onClick={() => removeTrack(nextSong.id)}>🗑 Löschen</button>
                </div>
              </div>
            ) : (
              <Empty text="Keine weiteren Wünsche vorhanden." />
            )}
          </div>
        </section>

        <section style={styles.columns}>
          <Panel title="📋 Warteschlange">
            {queue.length === 0 && <Empty text="Keine weiteren Songs in der Liste." />}
            {queue.map((track, index) => (
              <SongRow
                key={track.id + index}
                number={index + 2}
                track={track}
                likes={likes[track.id] || 0}
                fresh={!!newIds[track.id]}
                onNow={() => setAsNowPlaying(track)}
                onPlayed={() => markPlayed(track)}
                onDelete={() => removeTrack(track.id)}
              />
            ))}
          </Panel>

          <Panel title="❤️ Top Likes">
            {topLiked.length === 0 && <Empty text="Noch keine Likes." />}
            {topLiked.map((track, index) => (
              <TopRow
                key={track.id + index}
                number={index + 1}
                track={track}
                likes={likes[track.id] || 0}
              />
            ))}
          </Panel>
        </section>

        <Panel title="📜 Gespielte Songs">
          {history.length === 0 && <Empty text="Noch keine Songs gespielt." />}
          <div style={styles.historyGrid}>
            {history.slice(0, 12).map((track, index) => (
              <div key={track.id + index} style={styles.historyCard}>
                {track.image && <img src={track.image} style={styles.historyCover} />}
                <div>
                  <b>{track.title}</b>
                  <span>{track.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div style={styles.panel}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return <div style={styles.empty}>{text}</div>;
}

function SongRow({ number, track, likes, fresh, onNow, onPlayed, onDelete }) {
  return (
    <div style={{ ...styles.row, ...(fresh ? styles.fresh : {}) }}>
      <div style={styles.number}>{number}</div>
      {track.image && <img src={track.image} style={styles.cover} />}
      <div style={styles.info}>
        <b>{track.title}</b>
        <span>{track.artist}</span>
        <small>{fresh ? '🔔 Neuer Wunsch · ' : ''}❤️ {likes}</small>
      </div>
      <button style={styles.smallNow} onClick={onNow}>▶</button>
      <button style={styles.smallPlayed} onClick={onPlayed}>✔</button>
      <button style={styles.smallDelete} onClick={onDelete}>🗑</button>
    </div>
  );
}

function TopRow({ number, track, likes }) {
  return (
    <div style={styles.row}>
      <div style={styles.number}>{number}</div>
      {track.image && <img src={track.image} style={styles.cover} />}
      <div style={styles.info}>
        <b>{track.title}</b>
        <span>{track.artist}</span>
      </div>
      <strong style={styles.like}>❤️ {likes}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#02030a',
    color: 'white',
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: 14
  },
  dashboard: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1400,
    margin: '0 auto',
    padding: 18,
    borderRadius: 30,
    background: 'rgba(2,6,23,.9)',
    border: '1px solid rgba(255,255,255,.16)',
    boxShadow: '0 0 70px rgba(29,185,84,.22)'
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 180px auto',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10
  },
  live: {
    color: '#7dffad',
    fontWeight: 900,
    letterSpacing: 2
  },
  title: {
    margin: '4px 0 0',
    fontSize: 38
  },
  timeBox: {
    padding: 12,
    borderRadius: 18,
    background: 'rgba(0,0,0,.38)',
    border: '1px solid rgba(255,255,255,.14)',
    display: 'grid',
    gap: 4,
    textAlign: 'center'
  },
  headerButtons: {
    display: 'flex',
    gap: 10
  },
  liveButton: {
    padding: '13px 18px',
    borderRadius: 16,
    border: 0,
    background: 'linear-gradient(135deg,#00e5ff,#7c3aed)',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },
  qrButton: {
    padding: '13px 18px',
    borderRadius: 16,
    border: 0,
    background: 'linear-gradient(135deg,#1db954,#7c3aed)',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },
  guestButton: {
    padding: '13px 18px',
    borderRadius: 16,
    background: 'rgba(255,255,255,.08)',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 900
  },
  modeBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 10,
    marginBottom: 12
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: 12,
    marginBottom: 14
  },
  stat: {
    padding: 16,
    borderRadius: 20,
    background: 'rgba(0,0,0,.38)',
    border: '1px solid rgba(255,255,255,.14)',
    textAlign: 'center',
    display: 'grid',
    gap: 4
  },
  liveGrid: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    gap: 14,
    marginBottom: 14
  },
  nowPlaying: {
    padding: 18,
    borderRadius: 26,
    background: 'linear-gradient(135deg,rgba(0,229,255,.22),rgba(124,58,237,.24))',
    border: '1px solid rgba(0,229,255,.45)',
    minHeight: 230
  },
  nowInner: {
    textAlign: 'center'
  },
  nowImg: {
    width: 130,
    height: 130,
    borderRadius: 24,
    objectFit: 'cover',
    boxShadow: '0 0 35px rgba(0,229,255,.35)'
  },
  fakeProgress: {
    height: 8,
    borderRadius: 999,
    background: 'rgba(255,255,255,.16)',
    marginTop: 16,
    overflow: 'hidden'
  },
  fakeProgressFill: {
    height: '100%',
    width: '45%',
    borderRadius: 999,
    background: '#00e5ff'
  },
  nextBox: {
    padding: 18,
    borderRadius: 26,
    background: 'linear-gradient(135deg,rgba(29,185,84,.26),rgba(124,58,237,.22))',
    border: '1px solid rgba(53,255,117,.55)',
    boxShadow: '0 0 40px rgba(29,185,84,.28)'
  },
  sectionLabel: {
    color: '#7dffad',
    fontWeight: 900,
    marginBottom: 12
  },
  nextContent: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr 190px',
    gap: 18,
    alignItems: 'center'
  },
  nextCover: {
    width: 150,
    height: 150,
    borderRadius: 24,
    objectFit: 'cover'
  },
  nextInfo: {
    display: 'grid',
    gap: 6
  },
  bigActions: {
    display: 'grid',
    gap: 10
  },
  nowBtn: {
    padding: 15,
    borderRadius: 18,
    border: 0,
    background: '#00e5ff',
    color: '#001018',
    fontWeight: 900,
    fontSize: 16,
    cursor: 'pointer'
  },
  played: {
    padding: 15,
    borderRadius: 18,
    border: 0,
    background: '#1db954',
    color: '#001b09',
    fontWeight: 900,
    fontSize: 16,
    cursor: 'pointer'
  },
  delete: {
    padding: 15,
    borderRadius: 18,
    border: 0,
    background: '#ff4444',
    color: 'white',
    fontWeight: 900,
    fontSize: 16,
    cursor: 'pointer'
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: 14
  },
  panel: {
    padding: 16,
    borderRadius: 24,
    background: 'rgba(0,0,0,.35)',
    border: '1px solid rgba(255,255,255,.14)',
    marginBottom: 14
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    marginTop: 8,
    borderRadius: 18,
    background: 'rgba(255,255,255,.06)'
  },
  fresh: {
    border: '1px solid #35ff75',
    boxShadow: '0 0 30px rgba(53,255,117,.35)'
  },
  number: {
    width: 30,
    height: 30,
    minWidth: 30,
    borderRadius: '50%',
    background: '#1db954',
    color: '#001b09',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 14,
    objectFit: 'cover'
  },
  info: {
    flex: 1,
    minWidth: 0,
    display: 'grid',
    gap: 3
  },
  like: {
    color: '#7dffad'
  },
  smallNow: {
    width: 48,
    height: 48,
    borderRadius: 16,
    border: 0,
    background: '#00e5ff',
    cursor: 'pointer',
    fontWeight: 900
  },
  smallPlayed: {
    width: 48,
    height: 48,
    borderRadius: 16,
    border: 0,
    background: '#1db954',
    cursor: 'pointer',
    fontWeight: 900
  },
  smallDelete: {
    width: 48,
    height: 48,
    borderRadius: 16,
    border: 0,
    background: '#ff4444',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 900
  },
  historyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))',
    gap: 10
  },
  historyCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 18,
    background: 'rgba(255,255,255,.06)'
  },
  historyCover: {
    width: 46,
    height: 46,
    borderRadius: 12,
    objectFit: 'cover'
  },
  empty: {
    padding: 14,
    borderRadius: 18,
    background: 'rgba(255,255,255,.06)',
    opacity: .8
  },
  popup: {
    position: 'fixed',
    top: 18,
    right: 18,
    zIndex: 9999,
    padding: 18,
    borderRadius: 20,
    background: '#1db954',
    color: '#001b09',
    display: 'grid',
    gap: 5,
    fontWeight: 900,
    boxShadow: '0 0 50px rgba(29,185,84,.8)'
  }
};
