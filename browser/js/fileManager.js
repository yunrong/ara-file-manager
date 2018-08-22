'use strict'

const {
  DOWNLOADED,
  DOWNLOADING,
  DOWNLOAD_FAILED,
  PUBLISHED,
  PUBLISHING,
  UPLOAD_COMPLETE
} = require('../../lib/constants/stateManagement')

const { ipcRenderer, remote } = require('electron')
const isDev = require('electron-is-dev')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const FileManager = require('../views/fileManager/container')
const fileManager = new FileManager(store)
document.getElementById('container').appendChild(fileManager.render(store))

ipcRenderer.on(DOWNLOADING, () => fileManager.render(store))
ipcRenderer.on(DOWNLOAD_FAILED, () => fileManager.render(store))
ipcRenderer.on(DOWNLOADED, () => fileManager.render(store))
ipcRenderer.on(PUBLISHING, () => fileManager.render(store))
ipcRenderer.on(PUBLISHED, () => fileManager.render(store))
ipcRenderer.on(UPLOAD_COMPLETE, () => fileManager.render(store))

isDev && (window.components = { fileManager })