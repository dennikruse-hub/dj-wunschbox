import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .eq('is_now_playing', true)
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      return res.status(200).json({ ok: true, nowPlaying: data || null });
    }

    if (req.method === 'POST') {
      const { requestId } = req.body || {};

      if (!requestId) {
        return res.status(400).json({ error: 'requestId fehlt.' });
      }

      await supabase
        .from('song_requests')
        .update({ is_now_playing: false })
        .eq('is_now_playing', true);

      const { data, error } = await supabase
        .from('song_requests')
        .update({ is_now_playing: true })
        .eq('id', requestId)
        .select('*')
        .single();

      if (error) throw error;

      return res.status(200).json({ ok: true, nowPlaying: data });
    }

    return res.status(405).json({ error: 'Methode nicht erlaubt.' });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
