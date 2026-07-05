import { getAccessToken } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const token = await getAccessToken();
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;

    const meRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const me = await meRes.json();

    const playlistRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const playlist = await playlistRes.json();

    res.status(200).json({
      spotifyUser: {
        id: me.id,
        display_name: me.display_name,
        email: me.email
      },
      playlist: {
        id: playlist.id,
        name: playlist.name,
        owner_id: playlist.owner?.id,
        owner_name: playlist.owner?.display_name,
        public: playlist.public,
        collaborative: playlist.collaborative
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
