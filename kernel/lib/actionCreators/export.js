'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:export')
const { afsManager } = require('../actions')
const { ipcMain } = require('electron')
const k = require('../../../lib/constants/stateManagement')
const path = require('path')
const windowManager = require('electron-window-manager')

ipcMain.on(k.EXPORT_FILE, async (event, load) => {
	debug('%s heard', k.EXPORT_FILE)
	try {
		const fileDirectory = path.join(...load.parentDirectory)
		const filePath = path.join(fileDirectory, load.subPath)
		const exportPath = path.join(load.folderName[0], load.subPath)
		if (load.isFile) {
			afsManager.exportFile({
				did: load.did,
				exportPath,
				filePath,
				completeHandler
			})
		} else {
			afsManager.exportFolder({
				did: load.did,
				exportPath,
				folderPath: filePath,
				completeHandler
			})
		}
	} catch (err) {
		debug('Error: %O', err)
	}
})

function completeHandler() {
	windowManager.pingView({ view: 'afsExplorerView', event: k.REFRESH })
}