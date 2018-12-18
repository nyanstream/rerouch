'use strict'

const express = require('express')

const bodyParser = require('body-parser')

const sassMiddleware = require('node-sass-middleware')

const path = require('path')

const server = express()

const config = global._app.config

const _appRootDir = global._app.rootDir

server.use(
	sassMiddleware({
		src: `${_appRootDir}/${config.paths.dev.css}`,
		dest: `${_appRootDir}/${config.paths.public_assets}/css`,
		prefix: '/css',
		outputStyle: 'compressed',
	})
)

server.use(
	express.static(
		path.join(_appRootDir, config.paths.public)
	)
)

server.use(
	bodyParser.urlencoded({ extended: true })
)

server.use((err, req, res, next) => {
	console.error(err.stack)
})

server.use((err, req, res, next) => {
	res.status(404).send('ААА! ОШИБКА СТОП 0000000')
})

server.set('view engine', 'pug')
server.set('views', path.join(_appRootDir, config.paths.views))

module.exports = server
