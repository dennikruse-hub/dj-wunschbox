export default async function handler(req, res) {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ error: 'Missing track id' });
    }

    // aktuell nur LOGIC PLACEHOLDER
    // (Spotify hat kein "played flag", daher simulieren wir es sauber)

    return res.status(200).json({
      ok: true,
      played: id
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
