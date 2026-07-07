import { getAccessToken } from '../../lib/spotify';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const id = String(req.query.id || '');
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;

    if (!id) return res.status(400).json({ error: 'Song-ID fehlt.' });

    await supabase
      .from('song_requests')
      .update({ status: 'deleted' })
      .eq('track_id', id)
      .eq('status', 'open');

    const token = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/items`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [{ uri: `spotify:track:${id}` }]
        })
      }
    );

    return res.status(200).json({ ok: true, spotifyStatus: spotifyRes.status });

  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Fehler beim Entfernen.'
    });
  }
}
