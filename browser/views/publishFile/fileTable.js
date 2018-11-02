'use strict'


const AfsFileRow = require('../../components/afsFileTable/afsFileRow')
const k = require('../../../lib/constants/stateManagement')
const styles = require('./styles/fileTable')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileTable extends Nanocomponent {
	constructor({
		field,
		parentState
	}) {
		super()
		this.props = {
			field,
			parentState
		}
		this.onFileDrop = this.onFileDrop.bind(this)
		this.preventDefault = this.preventDefault.bind(this)
		this.deleteFile = this.deleteFile.bind(this)
	}

	update(){
		return true
	}

	makeFileRows() {
		const { props, deleteFile } = this
		return props.parentState[props.field].map(fileInfo => new AfsFileRow({
			fileInfo,
			deleteFile,
			rowType: k.PUBLISH
		}))
	}

	preventDefault(e) {
		e.preventDefault()
		e.stopPropagation()
	}

	onFileDrop(e) {
		this.preventDefault(e)
		const { props } = this
		const rawFileData = e.dataTransfer.files
		const fileData = Array.from(rawFileData).map(file => {
			return {
				isFile: file.type !== "",
				subPath: file.name,
				fullPath: file.path,
				size: file.size
			}
		})
		props.parentState[props.field].push(...fileData)
		this.render()
	}

	deleteFile(fileFullPath) {
		const { props } = this
		props.parentState[props.field] = props.parentState[props.field].filter(file =>
			file.fullPath !== fileFullPath
		)
		this.render()
	}

	createElement() {
		const { preventDefault, onFileDrop } = this
 		const fileRows = this.makeFileRows()
		return html`
		<div class=${styles.container}
			ondrop=${onFileDrop}
			ondragover=${preventDefault}
			ondragenter=${preventDefault}
			ondragleave=${preventDefault}
		>
			<table class="${styles.fileTable} FileTable-container">
				<colgroup>
					<col span="1" style="width: 40%;">
					<col span="1" style="width: 30%;">
					<col span="1" style="width: 30%;">
				</colgroup>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Size</th>
				</tr>
				${fileRows.map(fileRow => fileRow.render())}
			</table>
		</div>
		`
	}
}

module.exports = FileTable