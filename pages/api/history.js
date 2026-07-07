let historyStore = global.djwunschboxHistory || [];
global.djwunschboxHistory = historyStore;

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ history: historyStore });
  }

  if (req.method === 'POST') {
    const track = req.body?.track;

    if (!track?.id) {
      return res.status(400).json({ error: 'Track fehlt.' });
    }

    historyStore.unshift({
      ...track,
      playedAt: new Date().toISOString()
    });

    return res.status(200).json({ ok: true, history: historyStore });
  }

  return res.status(405).json({ error: 'Methode nicht erlaubt.' });
}
