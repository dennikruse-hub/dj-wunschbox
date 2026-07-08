import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('song_requests')
      .select('*')
      .eq('status', 'played')
      .order('played_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    const history = (data || []).map(row => ({
      id: row.track_id,
      uri: row.uri,
      title: row.title,
      artist: row.artist || '',
      image: row.image || null,
      guest: row.guest_name || '',
      message: row.message || '',
      likes: row.likes || 0,
      playedAt: row.played_at
    }));

    return res.status(200).json({ history });
  } catch (err) {
    return res.status(500).json({
      error: 'Historie konnte nicht geladen werden.',
      details: err.message,
      history: []
    });
  }
}
