'use strict'

const WebSocket = require('ws')

const fs = require('fs')

const WSServer = new WebSocket.Server({ noServer: true })

const config = global._app.config

const _appRootDir = global._app.rootDir

const files = [
	{
		name: 'noti',
		path: `${_appRootDir}/${config.paths.api}/noti.json`
	}, {
		name: 'schedule',
		path: `${_appRootDir}/${config.paths.api}/sched.json`
	}, {
		name: 'vk',
		path: `${_appRootDir}/${config.paths.api}/vk-news.json`
	}
]

let readFileAndSentIt = (ws, file, updated = false) => {
	fs.readFile(file.path, 'utf8', (err, data) => {
		let fileObject = {
			file: file.name,
			data: JSON.parse(data)
		}

		if (updated) { fileObject.updated = true }

		ws.send(JSON.stringify(fileObject))
	})
}

WSServer.on('connection', (ws, req) => {
	files.forEach(file => {
		if (fs.existsSync(file.path)) {
			readFileAndSentIt(ws, file)

			fs.watchFile(file.path, () => {
				readFileAndSentIt(ws, file, true)
			})
		} else {
			console.warn(`${file.path} не существует`)
		}
	})
})

module.exports = WSServer
