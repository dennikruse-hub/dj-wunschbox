import { getAccessToken } from '../../lib/spotify';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const id = String(req.query.id || '');
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;

    if (!id) {
      return res.status(400).json({ error: 'Song-ID fehlt.' });
    }

    const { error } = await supabase
      .from('song_requests')
      .update({
        status: 'played',
        played_at: new Date().toISOString(),
        is_now_playing: false
      })
      .eq('track_id', id)
      .eq('status', 'open');

    if (error) throw error;

    try {
      const token = await getAccessToken();

      await fetch(
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
    } catch {}

    return res.status(200).json({ ok: true });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'Fehler bei gespielt.'
    });
  }
}
