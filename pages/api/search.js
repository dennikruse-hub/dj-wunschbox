import fetch from 'node-fetch';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

function basicAuth() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  return Buffer.from(`${id}:${secret}`).toString('base64');
}

async function getToken() {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });

  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({ tracks: [] });
    }

    const token = await getToken();

    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await result.json();

    const tracks =
      data?.tracks?.items?.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        image:
          track.album?.images?.[1]?.url ||
          track.album?.images?.[0]?.url
      })) || [];

    return res.status(200).json({ tracks });

  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Search error'
    });
  }
}
