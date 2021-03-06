const { fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  fonts,
  appInfo: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 45px;
      justify-content: space-around;
      line-height: 15px;
      text-align: center;
    }

    :host .link-holder {
      display: flex;
      justify-content: space-between;
      width: 50%;
    }

    :host a:hover {
      cursor: pointer;
    }
  `,

  accountOverview: css`
    :host {
      padding-bottom: 15px;
      border-bottom: 1px solid var(--ara-grey);
    }
  `,

  balanceSection: css`
    :host {
      border-bottom: 1px solid var(--ara-grey);
      display: flex;
      height: 73px;
      flex-direction: column;
      justify-content: space-between;
      padding: 0px 0 40px 0;
    }

    :host b {
      font-family: ${fonts.black};
    }

    :host span {
      font-family: ${fonts.bold};
    }

    :host span.balance {
      font-size: 27px;
    }

    :host span.ethBalance {
      color: var(--ara-grey);
    }
  `,

  banner: css`
    :host {
      font-family:${fonts.black};
      font-size: 21px;
      margin: 25px 0 15px 0;
    }
  `,

  container: css`
    :host {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      height: 100%;
      justify-content: space-around;
      padding: 0 15px;
      word-wrap: break-word;
    }
  `,

  contentHolder: css`
    :host {
      border-bottom: 1px solid var(--ara-grey);
      display: flex;
      flex-direction: column;
      height: 320px;
      justify-content: space-between;
      padding-top: 10px;
    }
  `,

  idHolder: css`
    :host {
      border-bottom: 1px solid var(--ara-grey);
      height: 120px;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    :host .container {
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  `,

  interactiveSection: css`
    :host {
      display: flex;
      flex-direction: column;
      height: 145px;
      justify-content: space-between;
      padding: 25px 0 10px 0;
    }

    :host .request-container {
      display: flex;
      flex-direction: column;
      height: 60px;
      justify-content: space-between;
    }

    :host .send-container {
      display: flex;
      flex-direction: column;
      height: 60px;
      justify-content: space-between;
    }
  `
}
