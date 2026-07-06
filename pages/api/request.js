import { addTrackToPlaylist, publicTrack, searchTrack } from '../../lib/spotify';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt.' });
  }

  try {
    const { artist = '', title = '', guest = '', message = '' } = req.body || {};

    if (!artist.trim() && !title.trim()) {
      return res.status(400).json({
        error: 'Bitte Interpret oder Songtitel eingeben.'
      });
    }

    const track = await searchTrack({ artist, title });

    if (!track) {
      return res.status(404).json({
        error: 'Kein passender Song bei Spotify gefunden.'
      });
    }

    await addTrackToPlaylist(track.uri);

    return res.status(200).json({
      ok: true,
      duplicate: false,
      guest,
      message,
      track: publicTrack(track)
    });

  } catch (err) {
    console.error('API REQUEST ERROR:', err);

    return res.status(500).json({
      error: err.message || 'Unbekannter Serverfehler'
    });
  }
}
