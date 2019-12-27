import ChatEngineCore from 'chat-engine'
import ChatEngineStrings from './ChatEngineStrings'
import { isFunction } from './ChatEngineHelper'

const subKey = 'sub-c-98c567fe-4b00-11e9-82b8-86fda2e42ae9'
const pubKey = 'pub-c-37b2bf05-51bc-4c7e-b88b-476002c80edf'

class ChatEngineManager {
  ChatEngine = undefined
  ChatMe = undefined

  constructor() {
    this.ChatEngine = ChatEngineCore.create({
      subscribeKey: subKey,
      publishKey: pubKey,
      ssl: true,
    });

    // instance function
    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.getChatEngine = this.getChatEngine.bind(this)
    this.updateUser = this.updateUser.bind(this)

    // listener
    this.onReady = this.onReady.bind(this)
    this.onStateChange = this.onStateChange.bind(this)

    // user
    this.getUser = this.getUser.bind(this)
    this.isUserOnline = this.isUserOnline.bind(this)
  }

  /** INSTANCE FUNCTION */
  connect(uuid, state) {
    this.ChatEngine.connect(uuid, state);
  }

  disconnect() {
    this.ChatEngine.disconnect();
  }

  getChatEngine() {
    return this.ChatEngine
  }

  updateUser(state) {
    this.ChatMe.update(state);
  }

  /** LISTENER */
  onReady(callback) {
    if (this.ChatEngine) {
      this.ChatEngine.on(ChatEngineStrings.event.ready, (payload) => {
        this.ChatMe = payload.me
        if (isFunction(callback)) callback(payload)
      });
    } else {
      console.log('ChatEngine instance not exist')
    }
  }

  onStateChange(callback) {
    if (this.ChatEngine) {
      this.ChatEngine.global.on(ChatEngineStrings.event.state, (payload) => {
        if (isFunction(callback)) callback(payload)
      });
    } else {
      console.log('ChatEngine instance not exist')
    }
  }

  /** USER */
  getUser(uuid) {
    return new this.ChatEngine.User(uuid);
  }

  isUserOnline(uuid) {
    let user = this.ChatEngine.users[uuid];
    return user.state
  }
}

export default new ChatEngineManager()