import { getAccessToken } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const id = String(req.query.id || '');
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;

    if (!id) {
      return res.status(400).json({ error: 'Song-ID fehlt.' });
    }

    const token = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/items`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            {
              uri: `spotify:track:${id}`
            }
          ]
        })
      }
    );

    const data = await spotifyRes.json();

    if (!spotifyRes.ok) {
      return res.status(spotifyRes.status).json({
        error: data?.error?.message || 'Song konnte nicht entfernt werden.',
        details: data
      });
    }

    return res.status(200).json({ ok: true, result: data });

  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Fehler beim Entfernen.'
    });
  }
}
