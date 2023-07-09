import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private'
import { error, json } from '@sveltejs/kit'

export const load = (async ({ params }) => {
  if(params.slug == undefined || params.slug.length != 22){
    throw error(404, 'Spotify Playlist Not Found')
  }

  const accessToken = (await (await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  })).json()).access_token

  let nextPage = 'https://api.spotify.com/v1/playlists/' + params.slug + '/tracks'
  let playlistTracks = []
  let limit = 10

  while(nextPage && limit--){
    const playlistData = await (await fetch(nextPage, {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + accessToken}
    })).json()

    if(playlistData.error){
      throw error(404, 'Spotify Playlist Not Found')
    }

    nextPage = playlistData.next
    playlistTracks = [...playlistTracks, ...playlistData.items.map(i => i.track)]
  }

  return { data: playlistTracks }
})