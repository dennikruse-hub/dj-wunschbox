export default async function handler(req, res) {
  try {
    const trackId = req.query.id;

    // nur "simuliert gespielt"
    // (optional später Spotify Playlist Verschiebung)

    return res.status(200).json({
      ok: true,
      played: trackId
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
