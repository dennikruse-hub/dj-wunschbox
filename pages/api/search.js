import { getAccessToken } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const q = String(req.query.q || '').trim();

    if (q.length < 2) {
      return res.status(200).json({ tracks: [] });
    }

    const token = await getAccessToken();

    const params = new URLSearchParams({
      q,
      type: 'track',
      limit: '5',
      market: 'DE'
    });

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await spotifyRes.json();

    if (!spotifyRes.ok) {
      return res.status(500).json({
        error: data?.error?.message || 'Spotify-Suche fehlgeschlagen'
      });
    }

    const tracks = data.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      image: track.album.images?.[1]?.url || track.album.images?.[0]?.url || null
    }));

    return res.status(200).json({ tracks });

  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Fehler bei der Suche'
    });
  }
}
