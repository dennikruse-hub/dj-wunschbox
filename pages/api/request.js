import { searchTrack, addTrackToPlaylist, publicTrack } from '../../lib/spotify';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Methode nicht erlaubt.' });
    }

    const { artist, title, guest, message } = req.body || {};

    if (!artist && !title) {
      return res.status(400).json({
        error: 'Bitte Interpret oder Songtitel eingeben.'
      });
    }

    let cleanTrack = null;
    let spotifyAdded = false;
    let spotifyError = null;

    try {
      const track = await searchTrack({ artist, title });

      if (track) {
        cleanTrack = publicTrack(track);

        try {
          await addTrackToPlaylist(track.uri);
          spotifyAdded = true;
        } catch (err) {
          spotifyError = err.message || 'Spotify konnte den Song nicht hinzufügen.';
        }
      }
    } catch (err) {
      spotifyError = err.message || 'Spotify Suche nicht möglich.';
    }

    if (!cleanTrack) {
      cleanTrack = {
        id: `manual-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        uri: null,
        title: title || 'Unbekannter Titel',
        artist: artist || 'Unbekannter Interpret',
        image: null
      };
    }

    const { error } = await supabase.from('song_requests').insert({
      track_id: cleanTrack.id,
      uri: cleanTrack.uri,
      title: cleanTrack.title,
      artist: cleanTrack.artist,
      image: cleanTrack.image,
      guest_name: guest || null,
      message: message || null,
      status: 'open',
      likes: 0,
      spotify_added: spotifyAdded,
      spotify_last_error: spotifyError,
      spotify_synced_at: spotifyAdded ? new Date().toISOString() : null
    });

    if (error) throw error;

    return res.status(200).json({
      ok: true,
      track: cleanTrack,
      spotifyAdded,
      spotifyError
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Wunsch konnte gerade nicht gespeichert werden.',
      details: err.message
    });
  }
}
