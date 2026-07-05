import { getPlaylistTracks, publicTrack } from '../../lib/spotify';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Nur GET erlaubt.' });
  }

  try {
    const tracks = await getPlaylistTracks(100);
    return res.status(200).json({
      tracks: tracks.map(publicTrack)
    });
  } catch (err) {
    console.error('LIST ERROR:', err);
    return res.status(500).json({
      error: err.message || 'Fehler beim Laden der Playlist'
    });
  }
}
