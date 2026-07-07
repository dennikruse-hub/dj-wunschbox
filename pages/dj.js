import { useEffect, useRef, useState } from 'react';
import BackgroundGlow from '../components/BackgroundGlow';
import LiveDashboard from '../components/LiveDashboard';

const GUEST_URL = 'https://dj-wunschbox.vercel.app';

export default function DJ() {
  const [tracks, setTracks] = useState([]);
  const [likes, setLikes] = useState({});
  const [history, setHistory] = useState([]);
  const [popup, setPopup] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [startedAt] = useState(Date.now());
  const [newIds, setNewIds] = useState({});
  const [soundActive, setSoundActive] = useState(false);
  const [wakeActive, setWakeActive] = useState(false);
  const [liveModeActive, setLiveModeActive] = useState(false);

  const lastIds = useRef([]);
  const wakeLockRef = useRef(null);
  const audioRef = useRef(null);

  function beep() {
    try {
      if (!soundActive) return;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 880;

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.45);
    } catch (err) {
      console.log(err);
    }
  }

  async function activateLiveMode() {
    try {
      setSoundActive(true);
      audioRef.current = true;

      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setLiveModeActive(true);
      }

      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setWakeActive(true);
      }

      setTimeout(beep, 200);
    } catch (err) {
      console.log(err);
    }
  }

  async function load() {
    try {
      const listData = await fetch('/api/list').then(r => r.json());
      const likesData = await fetch('/api/likes').then(r => r.json());
      const historyData = await fetch('/api/history').then(r => r.json()).catch(() => ({ history: [] }));

      const newTracks = listData.tracks || [];
      const oldIds = lastIds.current;
      const freshIds = {};

      newTracks.forEach(t => {
        if (!oldIds.includes(t.id)) freshIds[t.id] = Date.now() + 60000;
      });

      if (Object.keys(freshIds).length > 0 && oldIds.length > 0) {
        const freshTrack = newTracks.find(t => freshIds[t.id]);
        setPopup(freshTrack);
        setTimeout(() => setPopup(null), 6000);
        setNewIds(prev => ({ ...prev, ...freshIds }));
        beep();
      }

      lastIds.current = newTracks.map(t => t.id);

      setTracks(newTracks);
      setLikes(likesData.likes || {});
      setHistory(historyData.history || []);
    } catch (err) {
      console.log(err);
    }
  }

  async function removeTrack(id) {
    await fetch('/api/remove?id=' + encodeURIComponent(id));
    load();
  }

  async function markPlayed(track) {
    setNowPlaying({
      ...track,
      startedAt: Date.now()
    });

    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track })
    });

    await fetch('/api/played?id=' + encodeURIComponent(track.id));
    load();
  }

  function setAsNowPlaying(track) {
    setNowPlaying({
      ...track,
      startedAt: Date.now()
    });
  }

  function openQR() {
    window.open(
      `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(GUEST_URL)}`,
      '_blank'
    );
  }

  function runtimeText() {
    const diff = Date.now() - startedAt;
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} h`;
  }

  useEffect(() => {
    load();

    const loadTimer = setInterval(load, 3000);

    const clockTimer = setInterval(() => {
      setClock(new Date());

      setLiveModeActive(!!document.fullscreenElement);

      setNewIds(prev => {
        const now = Date.now();
        const cleaned = {};
        Object.entries(prev).forEach(([id, until]) => {
          if (until > now) cleaned[id] = until;
        });
        return cleaned;
      });
    }, 1000);

    return () => {
      clearInterval(loadTimer);
      clearInterval(clockTimer);

      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, [soundActive]);

  return (
    <main>
      <BackgroundGlow />

      <LiveDashboard
        tracks={tracks}
        likes={likes}
        history={history}
        popup={popup}
        nowPlaying={nowPlaying}
        clock={clock}
        runtimeText={runtimeText}
        newIds={newIds}
        newCount={Object.keys(newIds).length}
        onQR={openQR}
        onLiveMode={activateLiveMode}
        liveModeActive={liveModeActive}
        soundActive={soundActive}
        wakeActive={wakeActive}
        setAsNowPlaying={setAsNowPlaying}
        markPlayed={markPlayed}
        removeTrack={removeTrack}
      />
    </main>
  );
}
