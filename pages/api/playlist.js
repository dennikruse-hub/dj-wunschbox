import { getPlaylistTracks, publicTrack } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const tracks = await getPlaylistTracks(100);
    res.status(200).json({ tracks: tracks.map(publicTrack) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
