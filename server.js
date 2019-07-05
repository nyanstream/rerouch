'use strict'

process.env.TZ = 'Europe/Moscow'

const project = require('./package.json')

global._app = {}

const auth = require('http-auth')

const http = require('spdy')

const path = require('path')

const fs = require('fs')

let parseYAML = require('js-yaml')

let parseYAMLfile = fileName =>
	parseYAML.load(
		fs.readFileSync(`./${fileName}.yaml`, 'utf8')
	)

/*
 * TODO: Сделать создание полной конфигурации приложения при первой загрузке
 */

try {
	let config = parseYAMLfile('config')
	global._app.config = config
} catch (e) {
	console.log('Не найден файл с конфигурацией приложения (config.yaml). Необходимо создать его.')
	console.log(e)
	process.exit()
}

global._app.rootDir = __dirname

const config = global._app.config

let neededFilesCheck = require('./src/server-modules/needed-files-check')()

void(() => {
	// TODO: fs.stat()
	let kaminaPath = path.dirname(require.resolve('kamina-js/package.json'))

	let jsPath = path.normalize(`${__dirname}/${config.paths.public}/${config.paths.public_assets}/js/`)

	let vendorsPath = path.join(jsPath, 'vendors')

	if (!fs.existsSync(jsPath)) { fs.mkdirSync(jsPath) }

	if (!fs.existsSync(vendorsPath)) { fs.mkdirSync(vendorsPath) }

	fs.copyFileSync(
		path.normalize(`${kaminaPath}/dist/kamina.min.js`),
		path.normalize(`${vendorsPath}/kamina.min.js`)
	)
})()

const PORT = process.env.PORT || 8433

const expressServer = require('./src/server-modules/express-server-init')

expressServer.get('/', (req, res) => {
	res.render('index')
})

expressServer.get('/api/:apiID', (req, res) => {
	res.set({
		'Access-Control-Allow-Origin': '*'
	})

	res.sendFile(`${req.params.apiID}.json`, {
		root: path.normalize(`${__dirname}/${config.paths.api}/`)
	})
})

expressServer.get(`/${config.paths.public_assets}/js/:fileName`, (req, res) => {
	res.sendFile(req.params.fileName, {
		root: path.normalize(`${__dirname}/src/js/`)
	})
})

const authBasic = auth.basic({
	realm: 'PANEL@NYAN.STREAM',
	file: path.join(`${__dirname}/${config.paths.secret}/`, 'users.htpasswd')
})

expressServer.all(`/${config.paths.panel}`, auth.connect(authBasic), (req, res, next) => {
	next()
})

expressServer.get(`/${config.paths.panel}`, (req, res) => {
	let currentUser = req.user in config.users
		? config.users[req.user]
		: false

	if (!currentUser) {
		res.status(403).send('Вашего аккаунта нет в списке пользователей.')
		res.end();

		return
	}

	let userStatus =
		('isAdmin' in currentUser && currentUser.isAdmin)
			? 'admin'
			: 'regular'

	res.render('panel', {
		VERSION: project.version,

		PANEL: {
			user: {
				name: currentUser.userName,
				status: userStatus
			}
		},

		LIBS: config.vendors,

		NONCE: res.locals.nonce,
	})
})

expressServer.post(`/${config.paths.panel}`, (req, res) => {
	console.log(res)
})

// expressServer.get(`/${config.paths.panel}`, (req, res) => {
// 	let panelMode = 'moder'

// 	if (
// 		config.users &&
// 		'admin' in Object.keys(config.users)[req.user] &&
// 		Object.keys(config.users)[req.user]['admin'] == true
// 	) {
// 		panelMode = 'admin'
// 	}

// 	let filesData = {
// 		crude: { sched: [], noti: {} },
// 		tmp: { sched: [] },
// 		count: {
// 			main: { sched: 0 },
// 			exprs: { sched: 0 }
// 		}
// 	}

// 	Object.keys(filesData.crude).forEach(file => {
// 		let filePath = path.join(`${__dirname}/${config.paths.api}/`, `${file}.json`)
// 		filesData.crude[file] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
// 	})

// 	for (let item of filesData.crude.sched) {
// 		if (!item.secret || item.secret != true) {
// 			filesData.tmp.sched.push(item)
// 		}
// 	}

// 	filesData.count.main.sched = filesData.tmp.sched.length

// 	for (let item of filesData.tmp.sched) {
// 		if (item.e < (Date.now() / 1000)) {
// 			filesData.count.exprs.sched++
// 		}
// 	}

// 	let panelData = { sched: {}, noti: {}, vk: {} }

// 	panelData.sched = {
// 		count: {
// 			main: filesData.count.main.sched,
// 			exprs: filesData.count.exprs.sched
// 		}
// 	}

// 	if (filesData.count.main.sched != 0) {
// 		panelData.sched.latest = filesData.tmp.sched[filesData.count.main.sched - 1]
// 	}

// 	panelData.noti =
// 		(panelMode == 'admin')
// 			? filesData.crude.noti
// 			: {}

// 	res.render('panel.pug', {
// 		mode: panelMode,
// 		user: req.user,
// 		init_data: JSON.stringify(panelData)
// 	})
// })

expressServer.post(`/${config.panel_path}`, (req, res) => {
	res.send('OK.')
})

const server = http.createServer({
	cert: fs.readFileSync(config.paths.https.cert),
	key: fs.readFileSync(config.paths.https.key),
	//-ca: fs.readFileSync(config.paths.https.ca)
}, expressServer)

const WSServer = require('./src/server-modules/ws-server-init')

server.on('upgrade', (request, socket, head) => {
	if (request.url == '/wss') {
		WSServer.handleUpgrade(request, socket, head, (ws) => {
			WSServer.emit('connection', ws, request)
		})
	} else {
		socket.destroy()
	}
})

server.listen(PORT, (err) => {
	if (err) {
		console.log(err)
		throw new Error(err);
	}

	console.log(`Сервер запущен.`)
})
