let fireInstance = undefined

function setInstance(instance) {
  fireInstance = instance
}

function getInstance() {
  return fireInstance
}

export default {
  setInstance,
  getInstance
}