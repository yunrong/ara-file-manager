const debug = require('debug')('ara:fm:kernel:ipc:update')

const araFilesystem = require('ara-filesystem')
const { ipcMain } = require('electron')
const { events } = require('k')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')

const {
  act,
  afs,
  rewardsDCDN,
  utils: daemonsUtil
} = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')
const { pause } = require('../lib')

const store = windowManager.sharedData.fetch('store')

const GAS_TIMEOUT = 10000

let updated = false
let errored = false

ipcMain.on(events.LOAD_MANAGE_FILE_UPDATE, async (_, { did, name }) => {
  debug('%s heard', events.LOAD_MANAGE_FILE_UPDATE)
  const { farmer } = store
  try {
    dispatch({
      type: events.LOAD_MANAGE_FILE_UPDATE,
      load: {
        did,
        price: 0,
        name: name || '',
        fileList: [],
        uncommitted: false
      }
    })
    windowManager.openWindow('manageFileView')

    dispatch({ type: events.CHANGE_BROADCASTING_STATE, load: { did, shouldBroadcast: false } })
    await rewardsDCDN.unjoinBroadcast({ farmer: farmer.farm, did })

    dispatch({
      type: events.LOAD_MANAGE_FILE_UPDATE,
      load: {
        did,
        fileList: await afs.getFileList(did),
        name,
        price: await act.getAFSPrice({ did }),
        uncommitted: false
      }
    })
    windowManager.pingView({ view: 'manageFileView', event: events.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

ipcMain.on(events.UPDATE_META, async (_, load) => {
  debug('%s heard', events.UPDATE_META)
  const { account } = store
  const { name, did } = load

  const waitModalLoad = { load: { packageName: load.name }, modalName: 'updatingName' }
  dispatch({ type: events.FEED_MODAL, load: waitModalLoad })
  windowManager.closeWindow('manageFileView')
  windowManager.openModal('generalPleaseWaitModal')

  await pause(2000)

  try {
    await daemonsUtil.writeFileMetaData({
      did,
      title: name,
      password: account.password
    })

    dispatch({ type: events.UPDATE_META, load: { name, did } })
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'nameUpdated' } })

    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    windowManager.closeWindow('generalPleaseWaitModal')
    windowManager.openModal('generalMessageModal')
  } catch (err) {
    debug('Error in %s: %o', events.UPDATE_META, err)
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'failureModal2' } })
    windowManager.openModal('generalMessageModal')
  }
})

ipcMain.on(events.UPDATE_FILE, async (_, load) => {
  debug('%s heard', events.UPDATE_FILE)
  const { account } = store
  try {
    updated = false
    errored = false

    dispatch({ type: events.FEED_MODAL, load: { load: { fileName: load.name } } })
    windowManager.openModal('generalPleaseWaitModal')
    windowManager.closeWindow('manageFileView')

    await daemonsUtil.writeFileMetaData({
      did: load.did,
      size: load.size,
      title: load.name,
      password: account.password
    })

    const gasPrice = await daemonsUtil.requestGasPrice()
    const { average, fast, fastest } = gasPrice
    dispatch({ type: events.UPDATE_FILE_LOAD, load })
    dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step: 'update' } })
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('setGasModal')
  } catch (err) {
    debug('Error: %O', err)
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.closeModal('setGasModal')
  }
})

internalEmitter.on(events.UPDATE_NEW_GAS, async (_, { step }) => {
  await _onNewGas(step)
})

ipcMain.on(events.UPDATE_NEW_GAS, async (_, { step }) => {
  await _onNewGas(step)
})

async function _onNewGas(step) {
  debug('%s heard', events.UPDATE_NEW_GAS)
  dispatch({ type: events.FEED_MODAL, load: { modalName: 'suggestingGasPrices' } })
  windowManager.openModal('generalPleaseWaitModal')
  const gasPrice = await daemonsUtil.requestGasPrice()
  const { average, fast, fastest } = gasPrice
  dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step: getStepName(step) } })
  windowManager.closeModal('generalPleaseWaitModal')
  windowManager.openModal('setGasModal')
}

ipcMain.on(events.GAS_PRICE, async(_, load) => {
  const { step, gasPrice } = load
  const { account, modal } = store
  if (step && !step.includes('update'))
    return

  dispatch({ type: events.FEED_MODAL, load: { load: { fileName: load.name } } })
  windowManager.openModal('generalPleaseWaitModal')
  load = Object.assign(load, modal.updateFileData)

  debug('%s heard', events.GAS_PRICE, load)
  let estimate
    if (load.shouldUpdatePrice && !load.shouldCommit) {
      debug('Estimating gas for set price')
      estimate = await araFilesystem.setPrice({ did: load.did, password: account.password, price: Number(load.price), estimate: true, gasPrice })
    } else {
      if (load.addPaths.length != 0) {
        await (await araFilesystem.add({ did: load.did, paths: load.addPaths, password: account.password })).close()
      }
      if (load.removePaths.length != 0) {
        await (await araFilesystem.remove({ did: load.did, paths: load.removePaths, password: account.password })).close()
      }
      if (load.shouldUpdatePrice) {
        debug('Estimate gas for commit and set price')
        estimate = await araFilesystem.commit({ did: load.did, password: account.password, price: Number(load.price), estimate: true, gasPrice })
      } else {
        debug('Estimating gas for commit only')
        estimate = await araFilesystem.commit({ did: load.did, password: account.password, estimate: true, gasPrice })
      }
    }

    const dispatchLoad = {
      did: load.did,
      gasEstimate: Number(estimate),
      name: load.name,
      price: load.price,
      gasPrice,
      size: load.size,
      shouldUpdatePrice: load.shouldUpdatePrice,
      shouldCommit: load.shouldCommit,
      step
    }

    dispatch({ type: events.FEED_MODAL, load: dispatchLoad })
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('updateConfirmModal')
})

ipcMain.on(events.CONFIRM_UPDATE_FILE, async (_, load) => {
  debug('%s heard', events.CONFIRM_UPDATE_FILE)
  const { account, account: { autoQueue } } = store
  const { step } = load
  try {
    dispatch({
      type: events.UPDATING_FILE,
      load: {
        did: load.did,
        name: load.name,
        price: load.price,
        size: load.size
      }
    })

    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    windowManager.closeWindow('manageFileView')

    this.startTimer = (progressStep) => {
      setTimeout(
        () => {
          let trigger = !(updated || errored)
          debug('timeout', trigger)
          let view
          let type
          switch (progressStep) {
            case 'retryStepOne':
            case 'retryStepTwo':
              type = events.TWO_STEP_PROGRESS
              view = 'twoStepProgressModal'
              break
            case 'retryPrice':
            case 'retryCommit':
              type = events.ONE_STEP_PROGRESS
              view = 'oneStepProgressModal'
              break
          }
          if (trigger) {
            dispatch({ type, load: { step: progressStep } })
            windowManager.pingView({ view, event: events.REFRESH })
          }
        }, GAS_TIMEOUT
      )
    }

    autoQueue.clear()
    if (load.shouldUpdatePrice && !load.shouldCommit || 'updatePrice' === step) {
      this.startTimer('retryPrice')
      debug('Updating price only')
      await autoQueue.push(() => araFilesystem.setPrice({
          did: load.did,
          password: account.password,
          price: Number(load.price),
          gasPrice: load.gasPrice,
          onhash: hash => {
            debug('price tx hash: %s', hash)
            dispatch({
              type: events.ONE_STEP_PROGRESS,
              load: {
                modalName: 'Updating',
                hash,
                network: store.application.network,
                retryEvent: events.UPDATE_NEW_GAS,
                stepName: 'Updating Price'
              }
            })
            windowManager.openModal('oneStepProgressModal')
          },
          onreceipt: receipt => {
            debug('price tx receipt:', receipt)
            updated = true
            windowManager.closeModal('oneStepProgressModal')
          },
          onerror: error => {
            debug('price tx error:', error)
            errored = true
            windowManager.closeModal('oneStepProgressModal')
          }
        })
      )
    } else if (!load.shouldUpdatePrice && load.shouldCommit || 'updateCommit' === step) {
      this.startTimer('retryCommit')
      debug('Updating Files')
      await autoQueue.push(() => araFilesystem.commit({
          did: load.did,
          password: account.password,
          gasPrice: load.gasPrice,
          writeCallbacks: {
            onhash: hash => {
              debug('write tx hash: %s', hash)
              dispatch({
                type: events.ONE_STEP_PROGRESS,
                load: {
                  modalName: 'Updating',
                  hash,
                  network: store.application.network,
                  retryEvent: events.UPDATE_NEW_GAS,
                  stepName: 'Writing'
                }
              })
              windowManager.openModal('oneStepProgressModal')
            },
            onreceipt: receipt => {
              debug('write tx receipt:', receipt)
              updated = true
              windowManager.closeModal('oneStepProgressModal')
            },
            onerror: error => {
              debug('write tx error:', error)
              errored = true
              windowManager.closeModal('oneStepProgressModal')
            }
          }
        })
      )
    } else {
      this.startTimer('retryStepOne')
      debug('Updating Files and Price')
      await autoQueue.push(() => araFilesystem.commit({
          did: load.did,
          password: account.password,
          price: Number(load.price),
          gasPrice: load.gasPrice,
          writeCallbacks: {
            onhash: hash => {
              debug('write tx hash: %s', hash)
              dispatch({
                type: events.TWO_STEP_PROGRESS,
                load: {
                  modalName: 'Updating',
                  stepOneHash: hash,
                  step: 'stepOne',
                  network: store.application.network,
                  retryEvent: events.UPDATE_NEW_GAS,
                  stepNames: {
                    1: 'Writing',
                    2: 'Finalizing'
                  }
                }
              })
              windowManager.openModal('twoStepProgressModal')
            },
            onreceipt: receipt => {
              debug('write tx receipt:', receipt)
              updated = true
              this.startTimer('retryStepTwo')
            },
            onerror: error => {
              debug('write tx error:', error)
              errored = true
              windowManager.closeModal('twoStepProgressModal')
            }
          },
          priceCallbacks: {
            onhash: hash => {
              debug('price tx hash: %s', hash)
              const load = {
                modalName: 'Updating',
                stepTwoHash: hash,
                step: 'stepTwo',
                network: store.application.network,
                retryEvent: events.UPDATE_NEW_GAS
              }
              dispatch({ type: events.TWO_STEP_PROGRESS, load })
              windowManager.openModal('twoStepProgressModal')
              windowManager.pingView({ view: 'twoStepProgressModal', event: events.REFRESH, load })
            },
            onreceipt: receipt => {
              debug('price tx receipt:', receipt)
              updated = true
              windowManager.closeModal('twoStepProgressModal')
            },
            onerror: error => {
              debug('price tx error:', error)
              errored = true
              windowManager.closeModal('twoStepProgressModal')
            }
          }
        })
      )
    }

    if (updated) {
      dispatch({ type: events.UPDATED_FILE, load })

      internalEmitter.emit(events.START_SEEDING, load)

      dispatch({ type: events.FEED_MODAL, load: { modalName: 'updateSuccessModal', load: { fileName: load.name } } })
      windowManager.openModal('generalMessageModal')
    }
  } catch (err) {
    debug('Error: %O', err)
  }
})

function getStepName(step) {
  switch (step) {
    case 'stepOne':
      step = 'update'
      break
    case 'retryPrice':
      step = 'updatePrice'
      break
    case 'stepTwo':
    case 'retryCommit':
      step = 'updateCommit'
      break
  }
  return step
}