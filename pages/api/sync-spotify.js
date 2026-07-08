
import { addTrackToPlaylist } from '../../lib/spotify';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('song_requests')
      .select('id, uri, title, artist')
      .eq('status', 'open')
      .eq('spotify_added', false)
      .not('uri', 'is', null)
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) throw error;

    const results = [];

    for (const song of data || []) {
      try {
        await addTrackToPlaylist(song.uri);

        await supabase
          .from('song_requests')
          .update({
            spotify_added: true,
            spotify_last_error: null,
            spotify_synced_at: new Date().toISOString()
          })
          .eq('id', song.id);

        results.push({
          id: song.id,
          title: song.title,
          ok: true
        });
      } catch (err) {
        await supabase
          .from('song_requests')
          .update({
            spotify_last_error: err.message || 'Spotify Sync Fehler'
          })
          .eq('id', song.id);

        results.push({
          id: song.id,
          title: song.title,
          ok: false,
          error: err.message
        });
      }
    }

    return res.status(200).json({
      ok: true,
      synced: results
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
