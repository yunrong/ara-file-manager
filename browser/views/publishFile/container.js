'use strict'

const Button = require('../../components/button')
const { emit } = require('../../lib/tools/windowManagement')
const FileInfo = require('./fileInfo')
const OptionsCheckbox = require('../../components/optionsCheckbox')
const { PUBLISH } = require('../../../lib/constants/stateManagement')
const overlay = require('../../components/overlay')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/container')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const tooltip = require('../../lib/tools/electron-tooltip')

class Container extends Nanocomponent {
	constructor({ did, password }) {
		super()

		this.state = {
			currency: '',
			fileName: '',
			fileList: [],
			price: null,
			priceManagement: true,
			supernode: true,
		}

		this.props = { did, password }

		this.children = {
			fileInfo: new FileInfo({
				parentState: this.state
			}),
			publishButton: new Button({
				children: 'Publish',
				onclick: this.publishFile.bind(this)
			}),
			utilityButton: new UtilityButton({})
		}
	}

	update() {
		return true
	}

	publishFile() {
		const {
			fileName,
			fileList,
			price
		} = this.state
		const { did, password } = this.props
		const paths = fileList.map(file => file.fullPath)
		const load = {
			userAid: did,
			password,
			paths,
			name: fileName || 'Unnamed',
			price
		}

		fileList
			? emit({ event: PUBLISH, load })
			: this.render({ requiredIndicator: true })
	}

	createElement({ spinner = false, requiredIndicator = false }) {
		tooltip({})
		const { children, state } = this
		return html`
			<div>
				${overlay(spinner)}
				<div class="${styles.container} PublishFileContainer-container">
					<div class="${styles.horizontalContainer} ${styles.title} PublishFileContainer-horizontalContainer,title">
						Publish File
						${children.utilityButton.render({ children: '✕' })}
					</div>
					<div class="${styles.content} PublishFileContainer-content">
						Publish your content for distribution on the ARA Network. You can publish a single file or an entire directory as a single
						asset. Once published, use the provided distribution link to allow users to purchase your content.<br><br>
						<b>Note:</b> ARA is a decentralized network. at least one computer or supernode must be connected and hosting this file for users
						to be able to download it.
					</div>
					<div class="${styles.divider} PublishFileContainer-divider"></div>
					${children.fileInfo.render({ requiredIndicator })}
					${children.publishButton.render()}
				</div>
			</div>
		`
	}
}

module.exports = Container