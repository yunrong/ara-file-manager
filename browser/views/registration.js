'use strict'

const Button = require('../components/button')
const { closeWindow, openWindow } = require('../lib/tools/windowManagement')
const Input = require('../components/input')
const overlay = require('../components/overlay')
const register = require('../lib/register')
const styles = require('./styles/registration')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')


class Registration extends Nanocomponent {
  constructor() {
    super()

    this.state = { password: '' }

    this.passwordInput = new Input({
      placeholder: 'Password',
      parentState: this.state,
      field: 'password',
      type: 'password'
    })

    this.submitButton = new Button({
      children: 'Register',
      type: 'submit'
    })

    this.cancelButton = new Button({
      children: 'Cancel',
      cssClass: {
        name: 'smallInvisible',
        opts: {
          color: 'blue',
          weight: 'light'
        }
      },
      onclick: closeWindow
    })

    this.render = this.render.bind(this)
  }

  update() {
    return true
  }

  createElement(pending = false) {
    const {
      cancelButton,
      passwordInput,
      render,
      submitButton,
      state
    } = this

    return html`
      <div class="modal">
        ${overlay(pending)}
        <div class=${styles.header}>LTLSTAR</div>
        <div class=${styles.header}>Register</div>
        <p class=${styles.description}>
          To use the <b>Littlstar Media Manager</b>, you'll need to create an ARA id. We will generate the ID
          for you, but save your password somewhere safe, as <b>there is no way to recover it if lost</b>.
        </p>
        <form class=${styles.registerForm} onsubmit=${onsubmit}>
          ${passwordInput.render({})}
          ${submitButton.render({})}
        </form>
        ${cancelButton.render({})}
      </div>
    `
    function onsubmit(e) {
      e.preventDefault()
      // state.registering = true
      // register()
      render(true)
    }
  }
}

const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

windowManager.bridge.on('REGISTERED', () => {
  openWindow('filemanager')
  windowManager.get('registration').close()
})
module.exports = Registration