const { stateManagement: k } = require('k')

module.exports = (state, { load = null, type }) => {
  switch (type) {
    case k.CANCEL_SUBSCRIPTION:
      state.transfer = null
      state.transferEth = null
      state.published = []
      state.rewards = []
      break
    case k.FAUCET_ARA_RECEIVED:
      state.faucet = null
      break
    case k.GOT_FAUCET_SUB:
      state.faucet = load.faucetSub
      break
    case k.GOT_PURCHASED_SUBS:
      state.rewards.push(load.rewardsSub)
      state.updates.push(load.updateSub)
      break
    case k.GOT_REGISTRATION_SUBS:
      Object.assign(state, load)
      break
    case k.GOT_SUBSCRIPTIONS:
      state.published.push(...load.publishedSubs)
      state.rewards.push(...load.rewardsSubs)
      state.transfer = load.transferSub
      state.transferEth = load.transferEthSub
      state.updates.push(...load.updateSubs)
      break
    case k.GOT_PUBLISHED_SUB:
      state.published.push(load.publishedSub)
      state.rewards.push(load.rewardsSub)
      break
    case k.GOT_PURCHASED_SUBS:
      state.rewards.push(load.rewardsSub)
      state.updates.push(load.updateSub)
      break
    case k.LOGOUT:
      state.published = []
      state.rewards = []
      break
    default:
      return state
  }
}