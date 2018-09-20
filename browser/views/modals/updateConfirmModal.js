'use strict'

const { CONFIRM_UPDATE } = require('../../../lib/constants/stateManagement')
const { closeModal, emit } = require('../../lib/tools/windowManagement')
const Button = require('../../components/button')
const styles = require('./styles')
const html = require('choo/html')

module.exports = (load) => {
  const updateButton = new Button({
    children: 'Update',
    onclick: () => {
      emit({ event: CONFIRM_UPDATE, load: { ...load, cost: 5 } }),
      closeModal()
    }
  })
  const cancelbutton = new Button({
    ...styles.buttonSelector('cancel'),
    onclick: () => {
      //closeWindow('manageFileView')
      closeModal()
    }
  })

  return html`
    <div class="${styles.container} modals-container">
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin">
          Update File?
        </div>
        <div class="${styles.verticalContainer} modal-verticalContainer">
          <div class="${styles.smallMessage({})} modal-smallMessage">
            This update will be pushed to all users connected to<br>
            the network.<br><br>
            Publishing this file will cost:
          </div>
          <span class="${styles.postheader} modals-postheader">
            5 ARA
          </span>
        </div>
      </div>
      ${updateButton.render()}
      ${cancelbutton.render()}
    </div>
  `
}