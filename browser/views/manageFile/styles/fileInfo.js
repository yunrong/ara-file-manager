const { colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	fonts,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		:host b {
			font-family: ${fonts.bold};
		}
	`,

	araPriceHolder: css`
		:host {
			display: none;
		}
	`,

	araPrice: css`
		:host {
			color: ${colorSelector('blue')};
			padding-left: 4px;
		}
	`,

	fileTable: css`
		:host {
			height: 380px;
			padding-top: 10px;
			width: 100%;
		}
	`,

	infoTip: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 35%;
			justify-content: start;
		}
	`,

	infoTipHolder: css`
		:host {
			display: flex;
			flex-direction: column;
			font-family: ${fonts.light};
			font-size: 12px;
			height: 110px;
			justify-content: space-between;
			width: 49%;
		}

		:host b {
			font-family: ${fonts.bold};
		}
	`,

	verticalContainer: css`
		:host {
			display: flex;
			justify-content: space-between;
			width: 100%;
		}
	`
}