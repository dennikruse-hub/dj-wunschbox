import { getAccessToken } from '../../lib/spotify';

export default async function handler(req, res) {
  try {
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
    const token = await getAccessToken();

    const meRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const me = await meRes.json();

    const playlistRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const playlist = await playlistRes.json();

    const tracksFromPlaylist = playlist.tracks?.items || [];

    return res.status(200).json({
      playlistId,
      meStatus: meRes.status,
      spotifyUser: {
        id: me.id,
        display_name: me.display_name
      },
      playlistStatus: playlistRes.status,
      playlist: {
        id: playlist.id,
        name: playlist.name,
        owner: playlist.owner?.id,
        public: playlist.public,
        collaborative: playlist.collaborative,
        tracksTotal: playlist.tracks?.total,
        tracksItemsLength: tracksFromPlaylist.length
      },
      tracks: tracksFromPlaylist.map(item => ({
        id: item.track?.id,
        title: item.track?.name,
        artist: item.track?.artists?.map(a => a.name).join(', '),
        image:
          item.track?.album?.images?.[1]?.url ||
          item.track?.album?.images?.[0]?.url ||
          null
      })),
      error: playlist.error || null
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
