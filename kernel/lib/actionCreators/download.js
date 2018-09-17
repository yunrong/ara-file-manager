'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:download')
const dispatch = require('../reducers/dispatch')
const { afsManager } = require('../actions')
const {
	DOWNLOAD,
	DOWNLOADED,
	DOWNLOADING,
	DOWNLOAD_FAILED,
} = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

ipcMain.on(DOWNLOAD, async (event, load) => {
	debug('%s heard. Load: %O', DOWNLOAD, load)
	try {
		afsManager.download({
			did: load.aid, handler: (load) => {
				if (load.downloadPercent !== 1) {
					debug('Dispatching %s', DOWNLOADING)
					dispatch({ type: DOWNLOADING, load })
					windowManager.pingView({ view: 'filemanager', event: DOWNLOADING })
				} else {
					debug('Dispatching %s . Load: %s', DOWNLOADED, load.aid)
					dispatch({ type: DOWNLOADED, load: load.aid })
					windowManager.pingView({ view: 'filemanager', event: DOWNLOADED })
				}
			}, errorHandler: () => {
				debug('Download failed')
				debug('Dispatching %s . Load: %s', DOWNLOAD_FAILED, load.aid)
				dispatch({ type: DOWNLOAD_FAILED, load: load.aid })
				windowManager.pingView({ view: 'filemanager', event: DOWNLOAD_FAILED })
			}
		})
	} catch (err) {
		debug('Error: %O', err)
	}
})