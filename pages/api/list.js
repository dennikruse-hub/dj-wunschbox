import { getAccessToken } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;

    if (!playlistId) {
      return res.status(500).json({ error: 'SPOTIFY_PLAYLIST_ID fehlt' });
    }

    const token = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await spotifyRes.json();

    if (!spotifyRes.ok) {
      return res.status(500).json({
        error: data?.error?.message || 'Playlist konnte nicht geladen werden'
      });
    }

    const tracks = (data.items || [])
      .map(item => item.track)
      .filter(Boolean)
      .map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists?.map(a => a.name).join(', '),
        image: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || null
      }));

    return res.status(200).json({ tracks });

  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Fehler beim Laden der Warteliste'
    });
  }
}
