
import PubNub from 'pubnub'
import PubnubStrings from './PubnubStrings'

const pubKey = 'pub-c-37b2bf05-51bc-4c7e-b88b-476002c80edf'
const subKey = 'sub-c-98c567fe-4b00-11e9-82b8-86fda2e42ae9'

class PubnubManager {
  currentPubnubUser = undefined
  pubnub = undefined

  constructor() {
    this.init = this.init.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)

    // user
    this.createUser = this.createUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.getUserDetail = this.getUserDetail.bind(this)
    this.getListUser = this.getListUser.bind(this)

    // message
    this.getMessage = this.getMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.onReceiveMessage = this.onReceiveMessage.bind(this)
    this.sendTyping = this.sendTyping.bind(this)
    this.updateMessage = this.updateMessage.bind(this)
    this.deleteMessage = this.deleteMessage.bind(this)
    this.getUnreadCount = this.getUnreadCount.bind(this)

    // spaces
    this.subscribeSpaces = this.subscribeSpaces.bind(this)
    this.createSpace = this.createSpace.bind(this)
    this.getSpace = this.getSpace.bind(this)
    this.getAllSpaces = this.getAllSpaces.bind(this)
    this.updateSpace = this.updateSpace.bind(this)
    this.deleteSpace = this.deleteSpace.bind(this)

    this.joinSpace = this.joinSpace.bind(this)
    this.leaveSpace = this.leaveSpace.bind(this)
    this.getMembership = this.getMembership.bind(this)
    this.updateMembership = this.updateMembership.bind(this)
    this.getMembers = this.getMembers.bind(this)
    this.addMembers = this.addMembers.bind(this)
    this.removeMembers = this.removeMembers.bind(this)
  }

  init(user) {
    const { uid, displayName, photoURL, email } = user

    this.pubnub = new PubNub({
      subscribeKey: subKey,
      publishKey: pubKey,
      uuid: uid,
      autoNetworkDetection: true, // enable for non-browser environment automatic reconnection
      restore: true, // enable catchup on missed messages
    });

    this.getUserDetail(uid).then((res) => {
      console.tron.warn('CURRENT PUBNUB USER FOUND')
      this.currentPubnubUser = res.data
    }).catch(async err => {
      console.tron.warn('CURRENT PUBNUB USER NOT FOUND')
      const { status } = err
      if (status.statusCode === 404) {
        try {
          const response = await PubnubManager.createUser({ id: uid, name: displayName, email, profileUrl: photoURL })
          this.currentPubnubUser = res.data
          console.tron.warn('CREATE PUBNUB USER SUCCESS')
        } catch (error) {
          console.tron.warn('CREATE PUBNUB USER FAILURE')
        }
      } else {
        console.tron.warn('SOMETHING ERROR ONCE GET CURRENT USER PUBNUB')
      }
    })
  }

  getCurrentUser() {
    return this.currentPubnubUser
  }

  createUser({ id, name, email, profileUrl }) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.createUser(
        {
          id,
          name,
          email,
          profileUrl,
        },
        (status, response) => {
          if (!status.error) {
            resolve(response)
          } else {
            reject({ status, response })
          }
        }
      )
    })
  }

  deleteUser(uid) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.deleteUser(uid, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      });
    })
  }

  updateUser({ id, name, email, profileUrl }) {
    let user = {}
    if (id) user = { ...user, id }
    if (name) user = { ...user, name }
    if (email) user = { ...user, email }
    if (profileUrl) user = { ...user, profileUrl }

    return new Promise(async (resolve, reject) => {
      this.pubnub.updateUser(user, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      });
    })
  }

  getUserDetail(uid) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.getUser(
        {
          userId: uid,
          include: {
            customFields: true
          }
        },
        (status, response) => {
          if (!status.error) {
            resolve(response)
          } else {
            reject({ status, response })
          }
        }
      );
    })
  }

  getListUser() {
    return new Promise(async (resolve, reject) => {
      this.pubnub.getUsers(
        {
          include: {
            customFields: true
          }
        },
        (status, response) => {
          if (!status.error) {
            resolve(response)
          } else {
            reject({ status, response })
          }
        }
      );
    })
  }

  /** MESSAGES */
  getMessage(channels, limit, start, end) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.fetchMessages(
        {
          channels,
          start,
          end,
          count: limit,
          includeMessageActions: true
        }, (status, response) => {
          if (!status.error) {
            resolve(response)
          } else {
            reject({ status, response })
          }
        });
    })
  }

  sendMessage(channel, message) {
    return new Promise(async (resolve, reject) => {
      const parseMessage = {
        ...message,
        user: this.currentPubnubUser,
      }
      this.pubnub.publish({
        message: parseMessage,
        channel,
      }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      });
    })
  }

  onReceiveMessage(callbackFunction) {
    this.pubnub.addListener({
      message: (message) => {
        // handle message
        // const channelName = message.channel;
        // const channelGroup = message.subscription; 
        // const publishTimetoken = message.timetoken;
        // const msg = message.message;
        // const publisher = message.publisher;
        if (typeof callbackFunction === 'function') {
          callbackFunction(message)
        }
      }
    });
  }

  sendTyping(channel, isTyping) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.signal({
        message: {
          type: PubnubStrings.message.type.typing,
          isTyping: isTyping // indicates typing
        },
        channel,
        storeInHistory: false, // override default storage options
      }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      });
    })
  }

  updateMessage(channel, actionType, timeToken, value) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.addMessageAction(
        {
          channel,
          messageTimetoken: timeToken,
          action: {
            type: actionType,
            value,
          },
        },
        (status, response) => {
          if (!status.error) {
            resolve(response)
          } else {
            reject({ status, response })
          }
        }
      );
    })
  }

  deleteMessage(channel, startAt, endAt) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.deleteMessages(
        {
          channel: channel,
          start: startAt,
          end: endAt
        },
        (result) => {
          console.tron.error({ 'DELETE MESSAGE': result });
        }
      );
    })
  }

  getUnreadCount(channels, timeTokens) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.messageCounts({
        channels,
        channelTimetokens: timeTokens,
      }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  /** SPCES */
  subscribeSpaces(spaces) {
    this.pubnub.subscribe({
      channels: spaces,
      withPresence: true,
    });
  }

  createSpace(uid, name, description, custom) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.createSpace({
        id: uid,
        name,
        description,
        custom,
      }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  getSpace(uid) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.getSpace({
        spaceId: uid,
      }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  getAllSpaces(limit, page) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.getSpaces({
        limit: limit,
        include: {
          totalCount: true,
          customFields: true,
        },
        page,
      }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  updateSpace(uid, name, description, custom) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.updateSpace({
        id: uid, name, description, custom
      }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  deleteSpace(uid) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.deleteSpace(uid, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  /**
   * 
   * @param {string} userId : user id
   * @param {[{id: string}]} spaces : array must contain key "id"
   */
  joinSpace(userId, spaces) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.joinSpaces({ userId, spaces }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }


  /**
   * 
   * @param {string} userId 
   * @param {string[]} spaces 
   */
  leaveSpace(userId, spaces) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.leaveSpaces({ userId, spaces }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  getMembership(userId) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.getMemberships({ userId }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  /**
   * 
   * @param {*} userId : userid
   * @param {space[]} spaces : array of spaces object
   */
  updateMembership(userId, spaces) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.updateMemberships({ userId, spaces }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  getMembers(spaceId) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.getMembers({ spaceId }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  /**
   * 
   * @param {*} spaceId space id
   * @param {user[]} users : array of user object
   */
  addMembers(spaceId, users) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.addMembers({ spaceId, users }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

  /**
   * 
   * @param {*} spaceId 
   * @param {strings[]} users : array of userid
   */
  removeMembers(spaceId, users) {
    return new Promise(async (resolve, reject) => {
      this.pubnub.removeMembers({ spaceId, users }, (status, response) => {
        if (!status.error) {
          resolve(response)
        } else {
          reject({ status, response })
        }
      }
      );
    })
  }

}

export default new PubnubManager()