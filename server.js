'use strict'

/*
 * Сделать создание полной конфигурации приложения при первой загрузке
 */

try {
	const config = require('./secret/config.json')
} catch (e) {
	console.log('Не найден файл с конфигурацией приложения (config.json). Необходимо создать его.')
	process.exit()
}

process.env.TZ = 'Europe/Moscow'

const
	project =  require('./package.json'),
	config =   require('./secret/config.json')

const
	express =     require('express'),
	bodyParser =  require('body-parser'),
	auth =        require('http-auth'),
	path =        require('path'),
	fs =          require('fs')

const PORT = process.env.PORT || 5000

const authBasic = auth.basic({
	realm: 'API@nyan.stream',
	file: path.join(`${__dirname}/secret/`, 'users.htpasswd')
})

const server = express()

server.use(express.static(path.join(__dirname, 'public')))

server.use(bodyParser.urlencoded({ extended: true }))

server.set('view engine', 'pug')
server.set('views', path.join(__dirname, 'views'))

server.get('/', (req, res) => {
	res.render('index')
})

server.get('/api/:apiID', (req, res) => {
	res.set({
		'Access-Control-Allow-Origin': '*'
	})
	res.sendFile(`${req.params.apiID}.json`, {
		root : `${__dirname}/api-sources/`
	})
})

server.all(`/${config.panel_path}`, auth.connect(authBasic), (req, res, next) => {
	next()
})

server.get(`/${config.panel_path}`, (req, res) => {
	let panelMode = 'moder'
	if (config.admins && config.admins.includes(req.user)) {
		panelMode = 'admin'
	}

	let panelData = { sched: {}, noti: {} }

	let filesData = {
		crude: { sched: [], noti: {} },
		tmp: { sched: [] },
		count: {
			main: { sched: 0 },
			exprs: { sched: 0 }
		}
	}

	Object.keys(filesData.crude).forEach(file => {
		let filePath = path.join(`${__dirname}/api-sources/`, `${file}.json`)
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

	panelData.sched = {
		count: {
			main: filesData.count.main.sched,
			exprs: filesData.count.exprs.sched
		}
	}

	if (filesData.count.main.sched != 0) {
		panelData.sched.latest = filesData.tmp.sched[filesData.count.main.sched - 1]
	}

	panelData.noti = (panelMode == 'admin')
	? filesData.crude.noti
	: {}

	res.render('panel', { mode: panelMode, user: req.user, init_data: JSON.stringify(panelData) })
})

server.post(`/${config.panel_path}`, (req, res) => {
	res.send('OK.')
})

server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))

server.use((err, req, res, next) => {
	res.status(404).send('ААА! ОШИБКА СТОП 0000000')
})

const neededFiles = {
	api: ['sched', 'noti'],
	htpasswd: ['users']
}

neededFiles.api.forEach(file => {
	let filePath = path.join(`${__dirname}/api-sources/`, `${file}.json`)
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
	let filePath = path.join(`${__dirname}/secret/`, `${file}.htpasswd`)
	fs.readFile(filePath, { encoding: 'utf-8' }, error => {
		let newFileContent = ''

		if (error && error.code == 'ENOENT') {
			fs.writeFile(filePath, newFileContent.toString(), () => {
				console.log(`Файл "${file}.htpasswd" не найден.  Создан пустой файл, но его необходимо заполнить.`)
			})
		}
	})
})
