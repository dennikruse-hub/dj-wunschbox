export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { artist, title, guest, message } = req.body;

    if (!artist || !title) {
      return res.status(400).json({ error: 'Artist and title required' });
    }

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
      return res.status(500).json({ error: 'Spotify auth failed' });
    }

    // SONG SUCHEN
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        artist + ' ' + title
      )}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const searchData = await searchRes.json();
    const track = searchData.tracks?.items?.[0];

    if (!track) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // ADD TO PLAYLIST
    await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [track.uri]
        })
      }
    );

    return res.status(200).json({
      track: {
        id: track.id,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        image: track.album?.images?.[0]?.url
      },
      guest,
      message
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
