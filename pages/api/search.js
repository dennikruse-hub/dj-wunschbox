export default async function handler(req, res) {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    // Token holen
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
      return res.status(500).json({ error: 'Spotify token failed' });
    }

    // Suche
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await searchRes.json();

    const tracks = (data.tracks?.items || []).map(t => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map(a => a.name).join(', '),
      image: t.album?.images?.[0]?.url || null
    }));

    return res.status(200).json({ tracks });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
