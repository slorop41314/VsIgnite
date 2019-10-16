export default {
  // Functions return fixtures
  getRoot: () => {
    return {
      ok: true,
      data: require('../Fixtures/root.json')
    }
  },
  getRate: () => {
    return {
      ok: true,
      data: require('../Fixtures/rateLimit.json')
    }
  },
  getUser: (username) => {
    // This fixture only supports gantman or else returns skellock
    const gantmanData = require('../Fixtures/gantman.json')
    const skellockData = require('../Fixtures/skellock.json')
    return {
      ok: true,
      data: username.toLowerCase() === 'gantman' ? gantmanData : skellockData
    }
  },
  getProfileList: (data) => {
    const { page } = data
    if (page === 1) {
      return {
        ok: true,
        data: require('../Fixtures/profile-1.json')
      }
    } else {
      return {
        ok: true,
        data: require('../Fixtures/profile-2.json')
      }
    }
  }
}
