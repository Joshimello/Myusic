import Router from 'koa-router'
const router = new Router({ prefix: '/playlist' })

import fs from 'fs'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import dotenv from 'dotenv'
import SpotifyWebApi from 'spotify-web-api-node'

dotenv.config({ path: '../.env' })

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENTID,
	clientSecret: process.env.CLIENTSECRET
})

interface playlist { id: string }

router.post('/', async (ctx, next) => {
	let rawdata = <playlist>ctx.request.body

	await spotifyApi.clientCredentialsGrant().then(
        res => { spotifyApi.setAccessToken(res.body['access_token']); console.log(res.body['access_token']) },
        err => { console.log('Error', err) }
    )

	let data = await Promise.all(
		(await getPlaylist(rawdata.id)).map(async song => {
			return {
				'name': song.track.name.replace(/[/\\?%*:|"<>]/g, '-'),
				'artist': song.track.artists[0].name.replace(/[/\\?%*:|"<>]/g, '-'),
				'album': song.track.album.name,
				'cover': song.track.album.images[0].url,
				'id': fs.existsSync(`../music/${song.track.artists[0].name} - ${song.track.name}.mp3`) ? 'exists' : 
					  (await yts(`${song.track.name} ${song.track.artists[0].name} audio`)).all[0].url
			}
		})
	)
	
	let list = []
	data.forEach(song => {
		list.push(new Promise(resolve => {
			if (song.id == 'exists') { resolve(`${song.artist} - ${song.name}.mp3`) }
			else {
				ytdl(song.id, {filter: 'audioonly'})
				.pipe(fs.createWriteStream(`../music/${song.artist} - ${song.name}.mp3`))
				.on('finish', () => { resolve(`${song.artist} - ${song.name}.mp3`) })	
			}
		}))
	})

	ctx.body = await Promise.all(list)
	await next()
})

async function getPlaylist(id:string) {
	let length = (await spotifyApi.getPlaylistTracks(id)).body.total

	let promises = []
	for (let i = 0; i < Math.floor(length / 100) + 1; i++) {
	    promises.push(await spotifyApi.getPlaylistTracks(id, { offset: Math.floor(length / 100) * 100 }))
	}

	let data = await Promise.all(promises)

	let songs:any = []
	for (let i = 0; i < data.length; i++) {
	    songs = songs.concat(data[i].body.items)
	}

	return songs
}

export default router