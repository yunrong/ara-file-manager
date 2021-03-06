const { events } = require('k')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { application } = windowManager.sharedData.fetch('store')
const LoginView = require('../views/login')
const { account } = windowManager.sharedData.fetch('store')

const loginView = new LoginView({ userDID: application.cachedUserDid || '' })
const customTitlebar = require('custom-electron-titlebar')
new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.WHITE,
    shadow: false,
    menu: null,
    titleHorizontalAlignment: process.platform === 'win32' ? 'left' : 'center',
    maximizable: false,
}).updateTitle(' ')
document.getElementById('container').appendChild(loginView.render())
const refreshListener = ipcRenderer.on(events.REFRESH, (_, load) => loginView.render(load ? { userDID: load.userDID } : { userDID: account.cachedUserDid }))
window.onunload = () => {
	ipcRenderer.removeListener(events.REFRESH, refreshListener)
}
