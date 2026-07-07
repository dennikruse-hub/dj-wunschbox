import { searchTrack, publicTrack } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const q = String(req.query.q || '').trim();

    if (!q || q.length < 2) {
      return res.status(200).json({ tracks: [] });
    }

    const track = await searchTrack({ artist: '', title: q });

    return res.status(200).json({
      tracks: track ? [publicTrack(track)] : []
    });

  } catch (err) {
    if (String(err.message).includes('429')) {
      return res.status(429).json({
        error: 'Spotify ist gerade kurz ausgelastet. Bitte versuche es in wenigen Sekunden erneut.'
      });
    }

    return res.status(500).json({
      error: 'Song-Suche aktuell nicht möglich.'
    });
  }
}
