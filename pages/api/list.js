import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('song_requests')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const tracks = (data || []).map(row => ({
      id: row.track_id,
      uri: row.uri,
      title: row.title,
      artist: row.artist || '',
      image: row.image || null,
      guest: row.guest_name || '',
      message: row.message || '',
      likes: row.likes || 0,
      requestId: row.id
    }));

    return res.status(200).json({ tracks });

  } catch (err) {
    return res.status(500).json({
      error: 'Warteliste konnte gerade nicht geladen werden.',
      details: err.message,
      tracks: []
    });
  }
}
