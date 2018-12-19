'use strict'

const express = require('express')

const bodyParser = require('body-parser')

const sassMiddleware = require('node-sass-middleware')

const path = require('path')

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
