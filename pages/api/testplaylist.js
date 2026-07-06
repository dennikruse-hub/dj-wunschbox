import { getAccessToken } from '../../lib/spotify';

export default async function handler(req, res) {
  const token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${process.env.SPOTIFY_PLAYLIST_ID}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const text = await response.text();

  res.status(200).json({
    status: response.status,
    body: text
  });
}
