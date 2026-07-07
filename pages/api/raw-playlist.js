import { getAccessToken } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
    const token = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const text = await spotifyRes.text();

    return res.status(200).json({
      status: spotifyRes.status,
      raw: text
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
