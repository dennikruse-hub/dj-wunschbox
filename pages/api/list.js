import { getPlaylistTracks, publicTrack } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const tracks = await getPlaylistTracks();

    return res.status(200).json({
      tracks: tracks.map(publicTrack)
    });
  } catch (err) {
    const msg = String(err.message || '');

    if (msg.includes('429') || msg.includes('Too many requests')) {
      return res.status(429).json({
        error: 'Spotify ist gerade kurz ausgelastet. Bitte versuche es gleich erneut.',
        tracks: []
      });
    }

    return res.status(500).json({
      error: 'Warteliste konnte gerade nicht geladen werden.',
      details: msg,
      tracks: []
    });
  }
}
