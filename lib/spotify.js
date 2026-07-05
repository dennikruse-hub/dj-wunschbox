const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function basicAuth() {
  const id = required('SPOTIFY_CLIENT_ID');
  const secret = required('SPOTIFY_CLIENT_SECRET');
  return Buffer.from(`${id}:${secret}`).toString('base64');
}

export function getLoginUrl() {
  const clientId = required('SPOTIFY_CLIENT_ID');
  const redirectUri = required('SPOTIFY_REDIRECT_URI');

  const scope = [
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private',
    'playlist-read-collaborative'
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code) {
  const redirectUri = required('SPOTIFY_REDIRECT_URI');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'Spotify token exchange failed');
  }

  return data;
}

export async function getAccessToken() {
  const refreshToken = required('SPOTIFY_REFRESH_TOKEN');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'Spotify refresh failed');
  }

  return data.access_token;
}

async function spotifyFetch(path, options = {}) {
  const token = await getAccessToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const text = await res.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    console.error('========================');
    console.error('SPOTIFY API ERROR');
    console.error('Status:', res.status);
    console.error('Path:', path);
    console.error('Response:', data);
    console.error('========================');

    throw new Error(`${res.status} ${JSON.stringify(data)}`);
  }

  return data;
}

export async function searchTrack({ artist, title }) {
  const query = `${artist || ''} ${title || ''}`.trim();

  if (!query) {
    throw new Error('Bitte Interpret oder Titel eingeben.');
  }

  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: '5',
    market: 'DE'
  });

  const data = await spotifyFetch(`/search?${params.toString()}`);

  return data.tracks?.items?.[0] || null;
}

export async function getPlaylistTracks(limit = 100) {
  const playlistId = required('SPOTIFY_PLAYLIST_ID');

  const params = new URLSearchParams({
    limit: String(limit),
    fields: 'items(track(id,name,uri,artists(name),album(images)))'
  });

  const data = await spotifyFetch(
    `/playlists/${playlistId}/tracks?${params.toString()}`
  );

  return data.items?.map(i => i.track).filter(Boolean) || [];
}

export async function playlistContainsTrack(trackId) {
  const tracks = await getPlaylistTracks(100);
  return tracks.some(t => t.id === trackId);
}

export async function addTrackToPlaylist(uri) {
  const playlistId = required('SPOTIFY_PLAYLIST_ID');

  return spotifyFetch(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({
      uris: [uri]
    })
  });
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
