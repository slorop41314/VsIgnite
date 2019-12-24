import QiscusSDK from "qiscus-sdk-core";
import QiscusStrings from "./QiscusStrings";
import apisauce from 'apisauce'

const appId = "test-qisc-tkfoim909xj";

class QiscusManager {
  qiscus = undefined
  activeRoom = undefined
  loggedUser = undefined
  errorCallback = () => { }
  user = {}
  fcmToken = undefined

  constructor() {
    this.qiscus = new QiscusSDK();
    this.qiscus.debugMode = true

    this.init = this.init.bind(this)
    this.setUser = this.setUser.bind(this)

    // user
    this.updateProfile = this.updateProfile.bind(this)
    this.blockUser = this.blockUser.bind(this)
    this.unblockUser = this.unblockUser.bind(this)
    this.getBlockUser = this.getBlockUser.bind(this)
    this.getUsers = this.getUsers.bind(this)

    // chat room
    this.createOrGetSingleRoom = this.createOrGetSingleRoom.bind(this)
    this.createGroupChatRoom = this.createGroupChatRoom.bind(this)
    this.createOrGetChannelRoom = this.createOrGetChannelRoom.bind(this)

    this.setActiveRoom = this.setActiveRoom.bind(this)
    this.getRoomsInfo = this.getRoomsInfo.bind(this)
    this.getChatRoomList = this.getChatRoomList.bind(this)
    this.getParticipantsRoom = this.getParticipantsRoom.bind(this)

    this.updateChatRoom = this.updateChatRoom.bind(this)

    this.addParticipantToRoom = this.addParticipantToRoom.bind(this)
    this.removeParticipantsFromRoom = this.removeParticipantsFromRoom.bind(this)

    this.getTotalUnreadCount = this.getTotalUnreadCount.bind(this)

    this.subscribeEvent = this.subscribeEvent.bind(this)
    this.unsubscribeEvent = this.unsubscribeEvent.bind(this)
    this.exitRoom = this.exitRoom.bind(this)

    this.publishTyping = this.publishTyping.bind(this)
    this.publishEvent = this.publishEvent.bind(this)

    // messages
    this.sendMessage = this.sendMessage.bind(this)
    this.readMessage = this.readMessage.bind(this)
    this.getMessages = this.getMessages.bind(this)
    this.deleteMessages = this.deleteMessages.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.clearAllMessages = this.clearAllMessages.bind(this)

    // instance
    this.getInstance = this.getInstance.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.isLogin = this.isLogin.bind(this)

    this.diconnect = this.diconnect.bind(this)

    // notification
    this.setDeviceToken = this.setDeviceToken.bind(this)
    this.removeDeviceToken = this.removeDeviceToken.bind(this)
  }

  /**
   * Function to init qiscus
   * @param {
      errorCallback: (error) => void, 
      loginSuccess: (authData) => void,  
      commentDeleted: (data) => void, 
      commentDelivered: (data) => void, 
      commentRead: (data) => void, 
      presence: (data, userId) => void, 
      typing: (data) => void, 
      onReconnect: (data) => void, 
      newMessages: (messages) => void, 
      roomCleared: (data) => void;
    } callback: parameter to set qiscuss callback
   */
  init(callback = {}) {
    const { errorCallback, loginSuccess, commentDeleted, commentDelivered, commentRead, presence, typing, onReconnect, newMessages, roomCleared } = callback

    if (errorCallback) {
      this.errorCallback = errorCallback
    }

    this.qiscus.init({
      AppId: appId,
      options: {
        loginSuccessCallback: loginSuccess ? (authData) => {
          this.loggedUser = authData.user
          loginSuccess(authData)
        } : () => { },
        commentDeletedCallback: commentDeleted ? (data) => commentDeleted(data) : () => { },
        commentDeliveredCallback: commentDelivered ? (data) => commentDelivered(data) : () => { },
        commentReadCallback: commentRead ? (data) => commentRead(data) : () => { },
        presenceCallback: presence ? (data, userId) => presence(data, userId) : () => { },
        typingCallback: typing ? (data) => typing(data) : () => { },
        onReconnectCallback: onReconnect ? (data) => onReconnect(data) : () => { },
        newMessagesCallback: newMessages ? (messages) => newMessages(messages) : () => { },
        roomClearedCallback: roomCleared ? (data) => roomCleared(data) : () => { }
      }
    });
  }

  /**
   * Function to login / set user
   * @param {string} userId 
   * @param {string} userKey 
   * @param {string} username 
   * @param {string} avatarUrl 
   * @param {object} extras 
   */
  async setUser(userId, userKey, username, avatarUrl, extras) {
    try {
      this.user = { userId, userKey, username, avatarUrl, extras }
      this.qiscus.setUser(userId, userKey, username, avatarUrl, extras)
    } catch (error) {
      this.errorCallback({ type: QiscusStrings.errors.loginFailure, error })
    }
  }

  /**
   * Function to update user profile
   * @param {string} username 
   * @param {string} avatarUrl 
   * @param {object} extras 
   */
  async updateProfile(username, avatarUrl, extras) {
    try {
      await this.qiscus.updateProfile({
        name: username ? username : this.user.username,
        avatar_url: avatarUrl ? avatarUrl : this.user.avatarUrl,
        extras: extras ? extras : this.user.extras,
      })

      if (username) {
        this.user = { ...this.user, username }
      }

      if (avatarUrl) {
        this.user = { ...this.user, avatarUrl }
      }

      if (extras) {
        this.extras = { ...this.extras, extras }
      }

    } catch (error) {
      this.errorCallback({ type: QiscusStrings.errors.updateProfileFailure, error })
    }
  }

  /**
   * Function to block user
   * @param {string} userId 
   */
  blockUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.qiscus.blockUser(userId)
        resolve(user)
      } catch (error) {
        reject({ type: QiscusStrings.errors.blockUserFailure, error })
      }
    })
  }

  /**
   * Function to unblock user
   * @param {string} userId 
   */
  unblockUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.qiscus.unblockUser(userId)
        resolve(user)
      } catch (error) {
        reject({ type: QiscusStrings.errors.blockUserFailure, error })
      }
    })
  }

  /**
   * Function to get bloked users
   * @param {number} page 
   * @param {number} limit 
   */
  getBlockUser(page, limit) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.qiscus.getBlockedUser(page, limit)
        resolve(users)
      } catch (error) {
        reject({ type: QiscusStrings.errors.getBlockUsersFailure, error })
      }
    })
  }

  /**
   * Function to get user list
   * @param {string} searchQuery : username to search
   * @param {number} page 
   * @param {number} limit 
   */
  getUsers(searchQuery, page, limit) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.qiscus.getUsers(searchQuery, page, limit)
        resolve(users)
      } catch (error) {
        reject({ type: QiscusStrings.errors.getUsersFailure, error })
      }
    })
  }

  /**
   * Function to create or get single chat room
   * @param {strings} userId 
   * @param {object} options : any field that required
   */
  createOrGetSingleRoom(userId, options) {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await this.qiscus.chatTarget(userId, options)
        resolve(room)
      } catch (error) {
        reject({ type: QiscusStrings.errors.createOrGetSingleFailure, error })
      }
    })
  }

  /**
   * Function to crate group chat room
   * @param {string} roomName 
   * @param {string[]} userIds 
   * @param {
     avatarURL: string,
   } options : you can add any field if required.
   */
  createGroupChatRoom(roomName, userIds, options) {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await this.qiscus.createGroupRoom(roomName, userIds, options)
        resolve(room)
      } catch (error) {
        reject({ type: QiscusStrings.errors.createOrGetGroupFailure, error })
      }
    })
  }

  /**
   * Function to create or get channel room
   * @param {string} uniqueId 
   * @param {string} name 
   * @param {string} avatarURL 
   */
  createOrGetChannelRoom(uniqueId, name, avatarURL) {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await this.qiscus.getOrCreateRoomByChannel(uniqueId, name, avatarURL)
        resolve(room)
      } catch (error) {
        reject({ type: QiscusStrings.errors.crateOrgetChannelFailure, error })
      }
    })
  }

  /**
   * Function to get chats by room id
   * @param {string} roomId 
   */
  setActiveRoom(roomId) {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await this.qiscus.getRoomById(roomId)
        this.activeRoom = room
        resolve(room)
      } catch (error) {
        reject({ type: QiscusStrings.errors.setActiveRoomFailure, error })
      }
    })
  }

  exitRoom() {
    return new Promise(async (resolve, reject) => {
      try {
        this.qiscus.exitChatRoom();
        this.activeRoom = undefined
        resolve()
      } catch (error) {
        reject({ type: QiscusStrings.errors.exitActiveRoomFailure, error })
      }
    })
  }

  /**
   * Function to get rooms info
   * @param {
    room_ids: string[],
    room_unique_ids: string[],
    show_participants: boolean,
    show_removed: boolean
    } params : parameter to get rooms info
   */
  getRoomsInfo(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const rooms = await this.qiscus.getRoomsInfo(params)
        resolve(rooms)
      } catch (error) {
        reject({ type: QiscusStrings.errors.getRoomsInfoFailure, error })
      }
    })
  }

  /**
   * Function to get user roomlist
   * @param {
      page: number,
      limit: number,
      show_participants: boolean,
      show_empty: boolean
    } parmas : parameter to get roomlist
   */
  getChatRoomList(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const rooms = await this.qiscus.loadRoomList(params)
        resolve(rooms)
      } catch (error) {
        reject({ type: QiscusStrings.errors.getRoomListFailure, error })
      }
    })
  }

  /**
   * Function to get room participat, by default it will return all participants
   * @param {string} roomId 
   * @param {number} limit 
   */
  getParticipantsRoom(roomId, limit) {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await this.qiscus.getRoomParticpants(roomId, limit)
        resolve(room)
      } catch (error) {
        reject({ type: QiscusStrings.errors.getRoomParticipantsFailure, error })
      }
    })
  }

  /**
   * 
   * @param {
      room_id: number,
      room_name: string,
      avatar_url: string,
      options: object
    } params: parameter to update room info
   */
  updateChatRoom(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await this.qiscus.updateRoom(params)
        resolve(room)
      } catch (error) {
        reject({ type: QiscusStrings.errors.updateRoomFailure, error })
      }
    })
  }

  /**
   * function to remove participats from room
   * @param {string} roomId : roomID
   * @param {strings[]} userIds : userdIds in array
   */
  addParticipantToRoom(roomId, userIds) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.qiscus.addParticipantsToGroup(roomId, userIds)
        resolve(users)
      } catch (error) {
        reject({ type: QiscusStrings.errors.addParticipantsFailure, error })
      }
    })
  }

  /**
   * function to remove participats from room
   * @param {string} roomId : roomID
   * @param {strings[]} userIds : userdIds in array
   */
  removeParticipantsFromRoom(roomId, userIds) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.qiscus.removeParticipantsFromGroup(roomId, userIds)
        resolve(users)
      } catch (error) {
        reject({ type: QiscusStrings.errors.removeParticipantsFailure, error })
      }
    })
  }

  /**
   * Function to get all total unread count from all room
   */
  getTotalUnreadCount() {
    return new Promise(async (resolve, reject) => {
      try {
        const unreadCount = await this.qiscus.getTotalUnreadCount()
        resolve(unreadCount)
      } catch (error) {
        reject({ type: QiscusStrings.errors.getUnreadCountFailure, error })
      }
    })
  }

  publishTyping(status) {
    this.qiscus.publishTyping(status)
  }

  publishEvent(roomId, payload) {
    this.qiscus.publishEvent(roomId, payload)
  }

  subscribeEvent(roomId, callback) {
    this.qiscus.subscribeEvent(roomId, callback)
  }

  unsubscribeEvent(roomId) {
    this.qiscus.unsubscribeEvent(roomId)
  }

  /**
   * function to send message
   * @param {string} roomId : chat room Identity (Id), you can get this Id in chat room object
   * @param {string} text : message text that you send to other participant
   * @param {string} uniqueId : temporary id to identify comment data, should be unique value, example you can use timestamp.
   * @param {string} type : message type, that you can define freely, there are reserved rich messages type, for example: text, file_attachment, account_linking, buttons, button_postback_response, reply, system_event, card, custom, location, contact_person, carousel. These type have been taken, if you use it you may face your structured data will not work, these type for bot API, hence you need define other type name.
   * @param {objext} payload : Payload for defining the structured message data, for example you want to create your own file message, you can fill the content using this example JSON 
   * @param {string} extras : You can add extras before sending a message, by intercepting the object into a valid JSON string,
   */
  sendMessage(roomId, text, uniqueId, type, payload, extras) {
    return new Promise(async (resolve, reject) => {
      try {
        const message = await this.qiscus.sendComment(roomId, text, uniqueId, type, payload, extras)
        resolve(message)
      } catch (error) {
        reject({ type: QiscusStrings.errors.sendMessageFailure, error })
      }
    })
  }

  /**
 * You can set your message status into read. The ideal case of this, is to notify other participants that a message has been read. You need to pass roomId and commentId.
 * @param {string} roomId 
 * @param {string} lastReadMessageId 
 */
  readMessage(roomId, lastReadMessageId) {
    return new Promise(async (resolve, reject) => {
      try {
        this.qiscus.readComment(roomId, lastReadMessageId)
        resolve()
      } catch (error) {
        reject({ type: QiscusStrings.errors.readMessageFailure, error })
      }
    })
  }
  /**
   * funtion to get messages by romom id
   * @param {string} roomId 
   * @param {
    last_comment_id: number,
    limit: number
   } options 
   */
  getMessages(roomId, options) {
    return new Promise(async (resolve, reject) => {
      try {
        const messages = await this.qiscus.loadComments(roomId, options)
        console.tron.log({ messages })
        resolve(messages)
      } catch (error) {
        console.tron.error({ getMessages: error })
        reject({ type: QiscusStrings.errors.getMessagesFailure, error })
      }
    })
  }

  /**
   * Function to delete messages
   * @param {string} roomId 
   * @param {string[]} messageUniqueIds 
   */
  deleteMessages(roomId, messageUniqueIds) {
    return new Promise(async (resolve, reject) => {
      try {
        const messages = await this.qiscus.deleteComment(roomId, messageUniqueIds)
        resolve(messages)
      } catch (error) {
        reject({ type: QiscusStrings.errors.deleteMessagesFailure, error })
      }
    })
  }

  /**
   * Function to upload file
   * @param {file} file 
   * @param {function} errorCallback 
   * @param {functionm} progressCallback 
   * @param {function} successCallback 
   */
  uploadFile(file, errorCallback, progressCallback, successCallback) {
    this.qiscus.upload(file, function (error, progress, url) {
      if (error) {
        if (typeof errorCallback === 'function') errorCallback(error)
      }
      if (progress) {
        if (typeof progressCallback === 'function') progressCallback(progress)
      }
      if (url) {
        if (typeof successCallback === 'function') successCallback(url)
      }
    })
  }

  /**
   * Function to clear messages in rooms
   * @param {string[]} roomIds 
   */
  clearAllMessages(roomIds) {
    return new Promise(async (resolve, reject) => {
      try {
        const rooms = await this.qiscus.clearRoomMessages(roomIds)
        resolve(rooms)
      } catch (error) {
        reject({ type: QiscusStrings.errors.clearMessagesFailure, error })
      }
    })
  }

  /**
   * function to get auth status
   */
  isLogin() {
    return this.qiscus.isLogin
  }

  /**
   * function to get current login user
   */
  getCurrentUser() {
    return this.qiscus.userData
  }

  /**
   * function to get qiscus instance
   */
  getInstance() {
    return this.qiscus
  }

  /**
   * finction to disconect qiscus instance
   */
  async diconnect() {
    this.loggedUser = undefined
    await this.removeDeviceToken()
    this.qiscus.disconnect()
  }

  setDeviceToken(token) {
    this.fcmToken = token
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.qiscus.registerDeviceToken(token, __DEV__)
        resolve(response)
      } catch (error) {
        reject({ type: QiscusStrings.errors.setDeviceTokenFailure, error })
      }
    })
  }

  removeDeviceToken() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.qiscus.removeDeviceToken(this.fcmToken, __DEV__)
        resolve(response)
      } catch (error) {
        reject({ type: QiscusStrings.errors.removeDeviceTokenFailure, error })
      }
    })
  }
}

export default new QiscusManager()