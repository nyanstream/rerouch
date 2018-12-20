'use strict'

const express = require('express')

const bodyParser = require('body-parser')

const sassMiddleware = require('node-sass-middleware')

const path = require('path')

const csp = require('helmet-csp')

const uuidv4 = require('uuid/v4')

const server = express()

const config = global._app.config

const _appRootDir = global._app.rootDir

server.enable('trust proxy')

let assetsPath = path.join(
	config.paths.public,
	config.paths.public_assets
)

let cssPath = path.join(
	assetsPath,
	config.paths.public_assets_css
)

let cssPathPrefix = cssPath
	.substring((config.paths.public).length)
	.replace(/\\/g, '/')

server.use(
	sassMiddleware({
		root: _appRootDir,
		src: config.paths.dev.css,
		dest: cssPath,
		prefix: cssPathPrefix,
		outputStyle: 'compressed',
		//debug: true,
	})
)

server.use((req, res, next) => {
	res.locals.nonce = uuidv4()
	next()
})

server.use(csp({
	directives: {
		defaultSrc: ["'self'"],

		scriptSrc: [
			"'self'",
			"https://cdnjs.cloudflare.com",
			(req, res) => `'nonce-${res.locals.nonce}'`,
		],

		styleSrc: [
			"'self'",
			"https://fonts.googleapis.com",
		],

		fontSrc: [
			"'self'",
			'https://fonts.gstatic.com',
		],

		imgSrc: [
			"'self'",
			"data:",
			"https://nyan.stream",
			"https://favicon.yandex.net",
		],

		frameAncestors: ["'self'"],

		blockAllMixedContent: true,
	}
}))

server.disable('x-powered-by')

server.use(
	bodyParser.urlencoded({ extended: true })
)

server.use(
	express.static(
		path.join(_appRootDir, config.paths.public)
	)
)

server.use((err, req, res, next) => {
	console.error(err.stack)
})

server.use((err, req, res, next) => {
	res.status(404).send('ААА! ОШИБКА СТОП 0000000')
})

server.set('view engine', 'pug')
server.set('views', path.join(_appRootDir, config.paths.dev.views))

module.exports = server
