import {
  searchTrack,
  addTrackToPlaylist,
  playlistContainsTrack,
  publicTrack
} from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Methode nicht erlaubt.' });
    }

    const { artist, title } = req.body || {};

    if (!artist && !title) {
      return res.status(400).json({
        error: 'Bitte Interpret oder Songtitel eingeben.'
      });
    }

    const track = await searchTrack({ artist, title });

    if (!track) {
      return res.status(404).json({
        error: 'Song wurde nicht gefunden.'
      });
    }

    const exists = await playlistContainsTrack(track.id);

    if (!exists) {
      await addTrackToPlaylist(track.uri);
    }

    return res.status(200).json({
      ok: true,
      track: publicTrack(track),
      alreadyExists: exists
    });

  } catch (err) {
    if (String(err.message).includes('429')) {
      return res.status(429).json({
        error: 'Spotify ist gerade kurz ausgelastet. Bitte versuche es in wenigen Sekunden erneut.'
      });
    }

    return res.status(500).json({
      error: 'Wunsch konnte gerade nicht gesendet werden. Bitte kurz erneut versuchen.'
    });
  }
}
