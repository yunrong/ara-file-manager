const MnemonicWarning = require('../views/mnemonicWarning')
const { ipcRenderer, remote } = require('electron')
const { events } = require('k')

const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const { modal } = store
const mnemonicWarning = new MnemonicWarning(modal.data)
document.getElementById('container').appendChild(mnemonicWarning.render())

const view = modal.data.isAFS ? 'mnemonicWarning/AFS' : 'mnemonicWarning'
ipcRenderer.send(events.PAGE_VIEW, { view })
