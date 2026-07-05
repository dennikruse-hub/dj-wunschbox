export default async function handler(req, res) {
  try {
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    // TOKEN
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
      return res.status(500).json({ error: 'Auth failed' });
    }

    // PLAYLIST LADEN
    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await result.json();

    const tracks = (data.items || []).map(item => {
      const t = item.track || {};

      return {
        id: t.id,
        title: t.name,
        artist: t.artists?.map(a => a.name).join(', '),
        image: t.album?.images?.[0]?.url || null
      };
    });

    return res.status(200).json({ tracks });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
