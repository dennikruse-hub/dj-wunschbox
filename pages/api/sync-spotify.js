import { addTrackToPlaylist } from '../../lib/spotify';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('song_requests')
      .select('id, uri, title, artist, spotify_added, spotify_last_error')
      .eq('status', 'open')
      .eq('spotify_added', false)
      .not('uri', 'is', null)
      .order('created_at', { ascending: true })
      .limit(3);

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
          ok: true,
          status: 'synchronisiert'
        });
      } catch (err) {
        const msg = String(err.message || 'Spotify Sync Fehler');

        await supabase
          .from('song_requests')
          .update({
            spotify_last_error: msg
          })
          .eq('id', song.id);

        results.push({
          id: song.id,
          title: song.title,
          ok: false,
          status: msg.includes('429') ? 'wartet_auf_spotify' : 'fehler',
          error: msg
        });

        if (msg.includes('429') || msg.includes('Too many requests')) {
          break;
        }
      }
    }

    return res.status(200).json({
      ok: true,
      waiting: results.filter(r => !r.ok).length,
      synced: results
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
