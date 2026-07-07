import { searchTrack, addTrackToPlaylist, publicTrack } from '../../lib/spotify';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Methode nicht erlaubt.' });
    }

    const { artist, title, guest, message } = req.body || {};

    if (!artist && !title) {
      return res.status(400).json({ error: 'Bitte Interpret oder Songtitel eingeben.' });
    }

    const track = await searchTrack({ artist, title });

    if (!track) {
      return res.status(404).json({ error: 'Song wurde nicht gefunden.' });
    }

    await addTrackToPlaylist(track.uri);

    const clean = publicTrack(track);

    await supabase.from('song_requests').insert({
      track_id: clean.id,
      uri: clean.uri,
      title: clean.title,
      artist: clean.artist,
      image: clean.image,
      guest_name: guest || null,
      message: message || null,
      status: 'open',
      likes: 0
    });

    return res.status(200).json({
      ok: true,
      track: clean
    });

  } catch (err) {
    const msg = String(err.message || '');

    if (msg.includes('429') || msg.includes('Too many requests')) {
      return res.status(429).json({
        error: 'Spotify ist gerade kurz ausgelastet. Bitte versuche es in wenigen Sekunden erneut.'
      });
    }

    return res.status(500).json({
      error: 'Wunsch konnte gerade nicht gesendet werden. Bitte kurz erneut versuchen.',
      details: msg
    });
  }
}
