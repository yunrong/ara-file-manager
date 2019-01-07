'use strict'

const { css } = require('css')
const { colors, fonts } = require('styleUtils')

module.exports = {
  colors,
  fonts,

  container: css`
    :host {
      display: flex;
      flex-direction: column;
      font-family: ${fonts.light};
      height: 150px;
      justify-content: space-between;
      margin-bottom: 65px;
      -webkit-app-region: drag;
    }

    :host:before {
      content: "";
      height: 160px;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      -webkit-app-region: drag;
      z-index: -1;
    }
  `,

  didHolder: css`
    :host {
      border-radius: 7px;
      cursor: pointer;
      margin-bottom: 5px;
      padding: 0 6px;
    }
  `,

  iconHolder: css`
    :host {
      margin-right: 3px;
      width: 15px;
      vertical-align: top;
    }
  `,

  subHeader: css`
    :host {
      display: flex;
      font-size: 14px;
      justify-content: space-between;
    }
  `,

  tabHolder: css`
    :host {
      display: flex;
    }

    :host div {
      cursor: pointer;
      margin-right: 30px;
    }
  `,

  titleHolder: css`
    :host {
      font-size: 40px;
      font-family: ${fonts.black};
      margin-top: 3px;
    }
  `,

  userHolder: css`
    :host {
      align-items: flex-end;
      display: flex;
      flex-direction: column;
      font-size: 16px;
    }

    :host b {
      font-family: ${fonts.bold};
    }
  `,

  publishFilebuttonHolder: css`
    :host {
      width: 100%;
      left: 0;
      position: absolute;
      top: 24%;
    }

    :host button {
      width: 100%;
    }
  `,

  windowControlsHolder: css`
    :host {
      display: flex;
      justify-content: space-between;
      width: 30px;
    }
  `
}