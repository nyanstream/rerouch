'use strict'

process.env.TZ = 'Europe/Moscow'


const project = require('./package.json')

global._app = {}

const auth = require('http-auth')

const path = require('path')

const fs = require('fs')

let parseYAML = require('js-yaml')

let parseYAMLfile = fileName => parseYAML.load(fs.readFileSync(`./${fileName}.yaml`, 'utf8'))

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

const PORT = process.env.PORT || 5000

const server = require('./src/js-modules/express-server-init')

server.get('/', (req, res) => {
	res.render('index')
})

server.get('/api/:apiID', (req, res) => {
	res.set({
		'Access-Control-Allow-Origin': '*'
	})

	res.sendFile(`${req.params.apiID}.json`, {
		root : `${__dirname}/${config.paths.api}/`
	})
})

const authBasic = auth.basic({
	realm: 'PANEL@NYAN.STREAM',
	file: path.join(`${__dirname}/${config.paths.secret}/`, 'users.htpasswd')
})

server.all(`/${config.paths.panel}`, auth.connect(authBasic), (req, res, next) => {
	next()
})

server.get(`/${config.paths.panel}`, (req, res) => {
	let currentUser = req.user in config.users
		? config.users[req.user]
		: false

	if (!currentUser) {
		res.status(403).send('Вашего аккаунта нет в списке пользователей.')
	}

	let panelMode =
		('isAdmin' in currentUser && currentUser.isAdmin)
			? 'admin'
			: 'regular'

	res.render('panel', {
		PANEL: {
			mode: panelMode
		}
	})
})

server.get(`/123${config.paths.panel}`, (req, res) => {
	let panelMode = 'moder'

	if (
		config.users &&
		'admin' in Object.keys(config.users)[req.user] &&
		Object.keys(config.users)[req.user]['admin'] == true
	) {
		panelMode = 'admin'
	}

	let filesData = {
		crude: { sched: [], noti: {} },
		tmp: { sched: [] },
		count: {
			main: { sched: 0 },
			exprs: { sched: 0 }
		}
	}

	Object.keys(filesData.crude).forEach(file => {
		let filePath = path.join(`${__dirname}/${config.paths.api}/`, `${file}.json`)
		filesData.crude[file] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
	})

	for (let item of filesData.crude.sched) {
		if (!item.secret || item.secret != true) {
			filesData.tmp.sched.push(item)
		}
	}

	filesData.count.main.sched = filesData.tmp.sched.length

	for (let item of filesData.tmp.sched) {
		if (item.e < (Date.now() / 1000)) {
			filesData.count.exprs.sched++
		}
	}

	let panelData = { sched: {}, noti: {}, vk: {} }

	panelData.sched = {
		count: {
			main: filesData.count.main.sched,
			exprs: filesData.count.exprs.sched
		}
	}

	if (filesData.count.main.sched != 0) {
		panelData.sched.latest = filesData.tmp.sched[filesData.count.main.sched - 1]
	}

	panelData.noti =
		(panelMode == 'admin')
			? filesData.crude.noti
			: {}

	// res.render('panel.pug', {
	// 	mode: panelMode,
	// 	user: req.user,
	// 	init_data: JSON.stringify(panelData)
	// })
})

server.post(`/${config.panel_path}`, (req, res) => {
	res.send('OK.')
})

server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))

const neededFiles = {
	api: ['sched', 'noti'],
	htpasswd: ['users']
}

neededFiles.api.forEach(file => {
	let filePath = path.join(`${__dirname}/${config.paths.api}/`, `${file}.json`)
	fs.readFile(filePath, { encoding: 'utf-8' }, error => {
		let newFileContent = []

		if (file == 'noti') {
			newFileContent = { enabled: false }
		}

		if (error && error.code == 'ENOENT') {
			fs.writeFile(filePath, JSON.stringify(newFileContent), () => {
				console.log(`Файл "${file}.json" не найден и был создан.`)
			})
		}
	})
})

neededFiles.htpasswd.forEach(file => {
	let filePath = path.join(`${__dirname}/${config.paths.secret}/`, `${file}.htpasswd`)

	fs.readFile(filePath, { encoding: 'utf-8' }, error => {
		let newFileContent = ''

		if (error && error.code == 'ENOENT') {
			fs.writeFile(filePath, newFileContent.toString(), () => {
				console.log(`Файл "${file}.htpasswd" не найден.  Создан пустой файл, но его необходимо заполнить.`)
			})
		}
	})
})
