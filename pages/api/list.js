import { getAccessToken } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
    const token = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Spotify liefert bei deiner Playlist die Songs unter items.items[].item
    const rawItems = data.items?.items || [];

    const tracks = rawItems
      .map(entry => entry.item)
      .filter(Boolean)
      .map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists?.map(a => a.name).join(', ') || '',
        image:
          track.album?.images?.[1]?.url ||
          track.album?.images?.[0]?.url ||
          null
      }));

    return res.status(200).json({ tracks });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
}
