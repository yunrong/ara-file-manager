'use strict'

const Button = require('../../components/button')
const { fileSystemManager, windowManagement } = require('../../lib/tools')
const FileInfo = require('./fileInfo')
const overlay = require('../../components/overlay')
const { UPDATE_FILE, PUBLISH } = require('../../../lib/constants/stateManagement')
const styles = require('./styles/container')
const UtilityButton = require('../../components/utilityButton')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Container extends Nanocomponent {
	constructor(opts) {
		super()

		this.props = { account: opts.account }
		this.state = {
			afsContents: opts.fileList,
			did: opts.did,
			name: opts.name,
			fileList: opts.fileList,
			oldPrice: opts.price,
			price: opts.price,
			uncommitted: opts.uncommitted
		}

		this.children = {
			fileInfo: new FileInfo({
				addItems: this.addItems.bind(this),
				did: opts.did,
				parentState: this.state,
				renderView: this.renderView.bind(this)
			}),
			publishButton: new Button({
				children: 'Publish Update',
				cssClass: { name: 'thinBorder' },
				onclick: this.updateFile.bind(this)
			}),
			utilityButton: new UtilityButton({})
		}
		this.getPathDiff = this.getPathDiff.bind(this)
		this.fileInfoChanged = this.fileInfoChanged.bind(this)
	}

	addItems(items) {
		const itemsInfo = items.map(fileSystemManager.getFileInfo)
		this.state.fileList.push(...itemsInfo)
		this.rerender()
	}

	fileInfoChanged() {
		const { state, props } = this
		const { addPaths, removePaths } = this.getPathDiff()
		const priceChanged = state.oldPrice != state.price
		const shouldCommit = !(addPaths.length == 0 && removePaths.length == 0)
		const notEmpty = state.fileList.length != 0
		return (priceChanged || shouldCommit) && notEmpty && !props.account.pendingTransaction && state.price >= 0
	}

	renderView() {
		this.render({})
	}

	update({ fileList }){
		const { state } = this
		if (fileList != null && state.afsContents.length == 0) {
			state.fileList = fileList
			state.afsContents = fileList
		}
		return true
	}

	getPathDiff() {
		const { state } = this
		const subPaths = state.fileList.map(file => file.subPath)
		const removePaths = state.afsContents.filter(file =>
			!subPaths.includes(file.subPath) && file.fullPath == null
		).map(file => file.subPath)
		const addPaths = state.fileList.filter(file =>
			file.fullPath != null
		).map(file => file.fullPath)
		const allPaths = state.fileList.map(file => file.fullPath)
		return {
			addPaths,
			allPaths,
			removePaths
		}
	}

	updateFile() {
		const { state } = this
		const {
			addPaths,
			allPaths,
			removePaths
		} = this.getPathDiff()

		const load = {
			addPaths,
			did: state.did,
			name: state.name,
			paths: allPaths,
			password: account.password,
			removePaths,
			size: state.fileList.reduce((sum, file) => sum += file.size, 0),
			shouldCommit: !(addPaths.length == 0 && removePaths.length == 0),
			shouldUpdatePrice: state.oldPrice != state.price,
			price: state.price == "" ? null : state.price,
			userAid: account.userAid
		}
		this.fileInfoChanged() && state.uncommitted
			? windowManagement.emit({ event: PUBLISH, load })
			: windowManagement.emit({ event: UPDATE_FILE, load })
	}

	renderDescription() {
		const { state } = this
		const manageFileText = html`<div>This package has been published to the Ara Network. You can edit and update the package here. The changes will be pushed to all users on the network.<br><br>
		<b>Note:</b> Ara is a decentralized network. at least one computer must be connected and hosting this file for users
			to be able to download it.</div>`
		const publishFileText = html`<div>Publish your package for distribution on the Ara Network. You can publish a single file or an entire directory as a single
			asset. Once published, use the provided distribution link to allow users to purchase your package.<br><br>
			<b>Note:</b> Ara is a decentralized network. at least one computer must be connected and hosting this file for users
			to be able to download it.</div>`
		return state.uncommitted ? publishFileText : manageFileText
	}

	createElement({ spinner = false }) {
		const { children, state, fileInfoChanged } = this
		return html`
			<div class="${styles.container} ManageFileContainer-container">
				${overlay(spinner)}
				<div class="${styles.horizontalContainer} ${styles.title} ManageFileContainer-horizontalContainer,title">
					${state.uncommitted ? 'Publish Package' : 'Manage Package'}
					${children.utilityButton.render({ children: 'close' })}
				</div>
				<div class="${styles.content} ManageFileContainer-content">
					${this.renderDescription()}
				</div>
				<div class="${styles.divider} ManageFileContainer-divider"></div>
				${children.fileInfo.render({ parentState: state })}
				${children.publishButton.render({
					cssClass: fileInfoChanged() ? { name: 'standard' } : { name: 'thinBorder' },
					children: [
							'Publish',
							html`
								<span style="font-family: ProximaNova-light;">
									(${ filesize(state.fileList.reduce((sum, file) => sum += file.size, 0)) })
								</span>`
						]
				})}
			</div>
		`
	}
}

module.exports = Container