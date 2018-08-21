'use strict'

const Checkbox = require('./checkbox')
const optionsTitleProvider = require('../lib/tools/optionsTitleProvider')
const styles = require('./styles/optionsCheckbox')
const Tooltip = require('./tooltip')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class OptionsCheckbox extends Nanocomponent {
	constructor({
		field = '',
		parentState = {}
	}) {
		super()
		this.props = { ...optionsTitleProvider(field) }
		this.children = {
			tooltip: new Tooltip({
				args: { optionType: field, cssClass: 'optionsTooltip' },
				component: 'optionsTextProvider',
				id: field,
				opts: { maxWidth: 300 }
			}),
			checkbox: new Checkbox({
				field,
				parentState
			})
		}
	}

	update() {
		return true
	}

	createElement() {
		const { children, props } = this
		return html`
			<div class="${styles.container} OptionsCheckbox-container">
				${children.checkbox.render({})}
				<div class="${styles.textContainer} OptionsCheckbox-textContainer">
					<div class="${styles.topContainer} OptionsCheckbox-topContainer">
						<div class="${styles.title} OptionsCheckbox-title">
							${props.title}
						</div>
							${children.tooltip.render()}
					</div>
					<div class="${styles.description} OptionsCheckbox-description">
						${props.description}
					</div>
				</div>
			</div>
		`
	}
}

module.exports = OptionsCheckbox