const account = require('./account')
const styles = require('./styles/sidebarSection')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const box = require('component-box')

box.use({ account })

class SidebarSection extends Nanocomponent {
  constructor({ type = '' }) {
    super()
    this.props = { typeRow: type }
    this.makeRows = this.makeRows.bind(this)
    this.box = box
  }

  makeRows(account) {
    const { typeRow } = this.props
    const constructorArgs = [{ account, typeRow }]
    return box('account', { key: account, constructorArgs })
      .render()
  }

  update() {
    return true
  }

  createElement({ account }) {
    const { props, makeRows, } = this
    return (html`
      <div >
        <div class="${styles.header} section-header">
          ${props.typeRow === 'accounts' ? 'Accounts' : props.typeRow === 'addAccount' ? '+ Add Account' : '+ Add Tokens'}
        </div>
        ${props.typeRow === 'accounts' ? makeRows(account) : html`<div></div>`}
      </div>
    `)
  }
}

module.exports = SidebarSection
