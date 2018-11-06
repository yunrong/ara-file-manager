'use strict'

const FileSelector = require('../../components/fileSelector')
const FileTable = require('./fileTable')
const Input = require('../../components/input')
const styles = require('./styles/fileInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileInfo extends Nanocomponent {
	constructor({
		parentState
	}) {
		super()

		this.props = { parentState }
		this.children = {
			fileNameInput: new Input({
				field: 'fileName',
				placeholder: 'File Name',
				parentState
			}),
			priceInput: new Input({
				field: 'price',
				parentState,
				placeholder: 'Price',
				type: 'number',
				embeddedButton: {
					option: 'selection',
					optionList: [
						'ARA',
						// 'USD'
					],
					field: 'currency'
				}
			}),
			fileSelector: new FileTable({
				parentState,
				field: 'fileList'
			})
		}
	}

	update(){
		return true
	}

	createElement({ requiredIndicator = false}) {
		const { children } = this
		return html`
			<div class=${styles.container}>
				<div class=${styles.verticalContainer}>
					<div class=${styles.infoTipHolder}>
						${children.fileNameInput.render({})}
						<div class=${styles.infoTip}>
							<div>
								<b>Recommended:</b> If this field is left blank, users will only
								see the file’s generic Ara identity.
							</div>
						</div>
					</div>
					<div class=${styles.infoTipHolder}>
						${children.priceInput.render({})}
						<div class=${styles.infoTip}>
							Price is converted to the equivalent value in Ara Tokens.
							Leave blank if you do not want to charge for this file.
						</div>
					</div>
				</div>
				<div class=${styles.fileDirectoryHolder}>
					${children.fileSelector.render()}
				</div>
			</div>
		`
	}
}

module.exports = FileInfo