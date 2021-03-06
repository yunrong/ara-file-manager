const { css } = require('css')
const { fonts } = require('styleUtils')

module.exports = {
  buttonHolder: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      font-family: ${fonts.bold};
    }
  `,

  container: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 547px;
      justify-content: space-around;
      width: 95%;
    }

    :host > * {
      width: 95%;
    }
  `,

  descriptionHolder: css`
    :host {
      font-size: 12px;
      font-family: ${fonts.light};
    }

    :host > b {
      font-family: ${fonts.bold};
    }
  `,

  form: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 190px;
      justify-content: space-between;
      width: 95%;
    }

    :host button {
      width: 100%
    }
  `,

  logo: css`
    :host {
      margin-top: 15px;
      align-content: center;
      display: flex;
      justify-content: center;
    }

    :host > img {
      height: 9px;
    }

    :host > input {
      width: 100%;
    }
  `,

  title: css`
    :host {
      font-family: ${fonts.black};
      font-size: 20px;
    }
  `
}
