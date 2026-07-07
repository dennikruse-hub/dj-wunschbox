const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';

global.spotifyCache = global.spotifyCache || {
  token: null,
  tokenUntil: 0,
  playlist: [],
  playlistUntil: 0,
  searches: {}
};

const cache = global.spotifyCache;

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function basicAuth() {
  return Buffer.from(
    `${required('SPOTIFY_CLIENT_ID')}:${required('SPOTIFY_CLIENT_SECRET')}`
  ).toString('base64');
}

async function readBody(res) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

async function fetchWithTimeout(url, options = {}, timeout = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function getAccessToken() {
  const now = Date.now();

  if (cache.token && cache.tokenUntil > now) {
    return cache.token;
  }

  const res = await fetchWithTimeout(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: required('SPOTIFY_REFRESH_TOKEN')
    })
  });

  const data = await readBody(res);

  if (!res.ok) {
    throw new Error(data.error_description || data.error || data.raw || 'Spotify Token Fehler');
  }

  cache.token = data.access_token;
  cache.tokenUntil = now + 55 * 60 * 1000;

  return cache.token;
}

async function spotifyFetch(path, options = {}) {
  const token = await getAccessToken();

  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await readBody(res);

  if (res.status === 429) {
    throw new Error('429 Too many requests');
  }

  if (!res.ok) {
    throw new Error(`${res.status} ${JSON.stringify(data)}`);
  }

  return data;
}

export function getLoginUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: required('SPOTIFY_CLIENT_ID'),
    redirect_uri: required('SPOTIFY_REDIRECT_URI'),
    show_dialog: 'true',
    scope: [
      'playlist-modify-public',
      'playlist-modify-private',
      'playlist-read-private',
      'playlist-read-collaborative'
    ].join(' ')
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code) {
  const res = await fetchWithTimeout(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: required('SPOTIFY_REDIRECT_URI')
    })
  });

  const data = await readBody(res);

  if (!res.ok) {
    throw new Error(data.error_description || data.error || data.raw || 'Spotify Login Fehler');
  }

  return data;
}

export async function searchTrack({ artist, title }) {
  const query = `${artist || ''} ${title || ''}`.trim();
  if (!query) throw new Error('Bitte Interpret oder Titel eingeben.');

  const key = query.toLowerCase();
  const now = Date.now();

  if (cache.searches[key] && cache.searches[key].until > now) {
    return cache.searches[key].track;
  }

  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: '5',
    market: 'DE'
  });

  const data = await spotifyFetch(`/search?${params.toString()}`);
  const track = data.tracks?.items?.[0] || null;

  cache.searches[key] = {
    track,
    until: now + 60 * 1000
  };

  return track;
}

export async function getPlaylistTracks() {
  const now = Date.now();

  if (cache.playlist && cache.playlist.length > 0 && cache.playlistUntil > now) {
    return cache.playlist;
  }

  const playlistId = required('SPOTIFY_PLAYLIST_ID');

  try {
    const data = await spotifyFetch(`/playlists/${playlistId}`);

    const tracks =
      data.tracks?.items?.map(entry => entry.track).filter(Boolean) ||
      data.items?.items?.map(entry => entry.item).filter(Boolean) ||
      [];

    cache.playlist = tracks;
    cache.playlistUntil = now + 15000;

    return tracks;
  } catch (err) {
    if (cache.playlist && cache.playlist.length > 0) {
      return cache.playlist;
    }

    throw err;
  }
}

export function clearPlaylistCache() {
  cache.playlist = [];
  cache.playlistUntil = 0;
}

export async function playlistContainsTrack(trackId) {
  const tracks = await getPlaylistTracks();
  return tracks.some(t => t.id === trackId);
}

export async function addTrackToPlaylist(uri) {
  const playlistId = required('SPOTIFY_PLAYLIST_ID');

  const result = await spotifyFetch(`/playlists/${playlistId}/items`, {
    method: 'POST',
    body: JSON.stringify({ uris: [uri] })
  });

  clearPlaylistCache();
  return result;
}

export function publicTrack(track) {
  return {
    id: track.id,
    uri: track.uri,
    title: track.name,
    artist: track.artists?.map(a => a.name).join(', ') || '',
    image:
      track.album?.images?.[1]?.url ||
      track.album?.images?.[0]?.url ||
      null
  };
}
