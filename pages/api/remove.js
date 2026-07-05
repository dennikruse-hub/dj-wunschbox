function basicAuth() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  return Buffer.from(`${id}:${secret}`).toString('base64');
}

async function getToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
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
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
    const trackId = req.query.id;

    if (!trackId) {
      return res.status(400).json({ error: 'Missing track id' });
    }

    const token = await getToken();

    await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tracks: [{ uri: `spotify:track:${trackId}` }]
        })
      }
    );

    return res.status(200).json({ ok: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
