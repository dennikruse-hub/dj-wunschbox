let globalStore = global.djwunschboxLikes || {};
global.djwunschboxLikes = globalStore;

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ likes: globalStore });
  }

  if (req.method === 'POST') {
    const { id } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'Song-ID fehlt.' });
    }

    globalStore[id] = (globalStore[id] || 0) + 1;

    return res.status(200).json({
      ok: true,
      likes: globalStore
    });
  }

  return res.status(405).json({ error: 'Methode nicht erlaubt.' });
}
