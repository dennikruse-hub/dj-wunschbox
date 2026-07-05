# DJ Dennis Wunschbox

Eine einfache Spotify-Wunschbox für DJs.

## Vercel Environment Variables

Diese Werte in Vercel unter Project Settings → Environment Variables eintragen:

- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET
- SPOTIFY_REDIRECT_URI = https://DEINE-VERCEL-URL.vercel.app/api/callback
- SPOTIFY_PLAYLIST_ID
- SPOTIFY_REFRESH_TOKEN

## Spotify Redirect URI

Im Spotify Developer Dashboard muss exakt diese URI eingetragen sein:

https://DEINE-VERCEL-URL.vercel.app/api/callback

## Refresh Token erzeugen

Nach dem ersten Deploy öffnen:

https://DEINE-VERCEL-URL.vercel.app/api/login

Mit deinem Spotify-Konto anmelden. Danach zeigt die Seite den Refresh Token an. Diesen in Vercel als SPOTIFY_REFRESH_TOKEN speichern und danach redeployen.
