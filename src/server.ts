import fs from 'fs'
import Koa from 'koa'
import logger from 'koa-logger'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import playlistRouter from './routes/playlist.js'
import singleRouter from './routes/single.js'

const app = new Koa()
app.use(json())
app.use(logger())
app.use(bodyParser())
app.use(playlistRouter.routes())
app.use(playlistRouter.allowedMethods())
app.use(singleRouter.routes())
app.use(singleRouter.allowedMethods())

if (!fs.existsSync('../music')) { fs.mkdirSync('../music') }

app.listen(3000, () => {
	console.log('Sutarto')
})