import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('song_requests')
        .select('track_id, likes');

      if (error) throw error;

      const likes = {};
      (data || []).forEach(row => {
        likes[row.track_id] = (likes[row.track_id] || 0) + (row.likes || 0);
      });

      return res.status(200).json({ likes });
    }

    if (req.method === 'POST') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Song-ID fehlt.' });

      const { data, error } = await supabase
        .from('song_requests')
        .select('id, likes')
        .eq('track_id', id)
        .eq('status', 'open')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;

      const nextLikes = (data.likes || 0) + 1;

      const { error: updateError } = await supabase
        .from('song_requests')
        .update({ likes: nextLikes })
        .eq('id', data.id);

      if (updateError) throw updateError;

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Methode nicht erlaubt.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
