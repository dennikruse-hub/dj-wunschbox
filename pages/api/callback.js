import { exchangeCodeForToken } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const { code, error } = req.query;
    if (error) throw new Error(String(error));
    if (!code) throw new Error('Kein Spotify-Code erhalten.');
    const token = await exchangeCodeForToken(String(code));
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<!doctype html><html><head><title>Spotify verbunden</title><style>body{font-family:Arial;background:#111;color:white;padding:30px}code{display:block;background:#222;padding:16px;border-radius:10px;word-break:break-all;color:#1db954}</style></head><body><h1>Spotify verbunden ✅</h1><p>Kopiere diesen Refresh Token in Vercel als <b>SPOTIFY_REFRESH_TOKEN</b>:</p><code>${token.refresh_token || 'Kein refresh_token erhalten. Bitte /api/login erneut öffnen.'}</code><p>Danach in Vercel speichern und Redeploy starten.</p></body></html>`);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
