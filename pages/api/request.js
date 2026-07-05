import { addTrackToPlaylist, playlistContainsTrack, publicTrack, searchTrack } from '../../lib/spotify';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt.' });
  try {
    const { artist = '', title = '' } = req.body || {};
    if (!artist.trim() && !title.trim()) return res.status(400).json({ error: 'Bitte Interpret oder Songtitel eingeben.' });
    const track = await searchTrack({ artist, title });
    if (!track) return res.status(404).json({ error: 'Kein passender Song bei Spotify gefunden.' });
    const duplicate = await playlistContainsTrack(track.id);
    if (!duplicate) await addTrackToPlaylist(track.uri);
    res.status(200).json({ ok: true, duplicate, track: publicTrack(track) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
