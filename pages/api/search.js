import { searchTrack } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({ tracks: [] });
    }

    const track = await searchTrack({ artist: q, title: '' });

    if (!track) {
      return res.status(200).json({ tracks: [] });
    }

    return res.status(200).json({
      tracks: [
        {
          id: track.id,
          title: track.name,
          artist: track.artists?.map(a => a.name).join(', '),
          image:
            track.album?.images?.[1]?.url ||
            track.album?.images?.[0]?.url
        }
      ]
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Search error'
    });
  }
}
