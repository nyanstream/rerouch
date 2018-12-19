'use strict'

const fs = require('fs')

const path = require('path')

const config = global._app.config

const _appRootDir = global._app.rootDir

let neededFilesCheck = () => {
	let neededFiles = {
		api: ['sched', 'noti', 'vk-news'],
		htpasswd: ['users']
	}

	neededFiles.api.forEach(file => {
		let filePath = path.join(`${_appRootDir}/${config.paths.api}/`, `${file}.json`)

		fs.readFile(filePath, { encoding: 'utf-8' }, error => {
			let newFileContent = []

			switch (file) {
				case 'noti':
					newFileContent = { enabled: false }; break
				case 'vk-news':
					newFileContent = { com: {}, posts: [] }; break
			}

			// TODO: go to fs.stat()
			if (error && error.code == 'ENOENT') {
				fs.writeFile(filePath, JSON.stringify(newFileContent), () => {
					console.log(`Файл "${file}.json" не найден и был создан.`)
				})
			}
		})
	})

	neededFiles.htpasswd.forEach(file => {
		let filePath = path.join(`${_appRootDir}/${config.paths.secret}/`, `${file}.htpasswd`)

		fs.readFile(filePath, { encoding: 'utf-8' }, error => {
			let newFileContent = ''

			if (error && error.code == 'ENOENT') {
				fs.writeFile(filePath, newFileContent.toString(), () => {
					console.log(`Файл "${file}.htpasswd" не найден.  Создан пустой файл, но его необходимо заполнить.`)
				})
			}
		})
	})
}

module.exports = neededFilesCheck
