import { getPlaylistTracks, publicTrack } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const tracks = await getPlaylistTracks(50);

    return res.status(200).json({
      tracks: tracks.map(publicTrack)
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Fehler beim Laden der Warteliste'
    });
  }
}
