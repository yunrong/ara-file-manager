'use strict'

const afs = require('ara-filesystem')

module.exports = {
  async addCreateEstimate({ did, password, paths }) {
    const arafs = await afs.create({ owner: did, password })
    const { afs: { did: id }, mnemonic } = arafs
    arafs.afs.close()

    try {
      await afs.add({
        did: id,
        paths: ['README.md', '.ararc'],
        password
      })
      console.log('added file succesfully')
    } catch (e) {
      console.warn('error in adding')
    }

    let gasEstimate
    try {
      gasEstimate = await afs.estimateCommitGasCost({ did: id, password })
    } catch (err) {
      console.log({ err })
    }

    return { did: id, mnemonic, gasEstimate }
  },

  async commit({ did, password, gasEstimate }){
    console.log({did,password,gasEstimate})
    const result = await afs.commit({ did, password, gasEstimate })
    if (result instanceof Error) {
      console.log(result)
    } else {
      console.log("file(s) successfully committed")
    }
    return result
  }
}