'use strict'

const fileSystemManager = require('../lib/tools/fileSystemManager')
const Input = require('../components/input')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileSelector extends Nanocomponent {
	constructor({
		field,
		parentState
	}) {
		super()

		this.props = { field, parentState }
		this.state = { filePath: '' }
		this.children = {
			input: new Input({
				placeholder: 'File Directory',
				field,
				parentState,
				embeddedButton: {
					option: 'button',
					children: 'Select',
					onclick: this.selectFile.bind(this)
				}
			})
		}
	}

	update({ filePath }) {
		const { state } = this
		const samePath = state.filePath === filePath
		if (!samePath) {
			state.filePath = filePath
		}
		return !samePath
	}

	selectFile() {
		const { children, props, state } = this
		fileSystemManager.showSelectFileDialog()
			.then(fileNames => {
				state.filePath = fileNames
				children.input.state.value = fileNames
				props.parentState[props.field] = fileNames
				this.rerender()
			})
			.catch(console.log)
	}

	createElement() {
		const { state, children } = this
		return html`
			<div>
				${children.input.render({ value: state.filePath })}
			</div>
		`
	}
}

module.exports = FileSelector