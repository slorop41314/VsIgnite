import firebase from "react-native-firebase";
import { includes, equals, values, keys } from 'ramda'
import { generateUUID } from "./modules/helper";
import strings from "./strings";
import { IUser, IChannel, IMessage, IChannelStore } from "./interface";
import { CHANNEL_TYPE } from "./const";

class FireEngine {
  private user: IUser = {};
  private isReady: boolean = false;
  private users: Record<string, IUser> = {}
  private channels: Record<string, IChannel> = {}
  private messages: Record<string, IMessage> = {}

  private onReadyCallback: (user: IUser) => void;
  private onInitFailureCallback: (error: string) => void;
  private onErrorCallback: (error: string) => void;
  private userListCallback: (userList: IUser[]) => void;
  private channelListCallback: (channelList: IChannel[]) => void;
  private messageListCallback: (messageList: IMessage[]) => void;
  private receiveMessageCallback: (channel: IChannel, message: IMessage) => void;
  private sendMessageCallback: (channel: IChannel, message: IMessage) => void;

  constructor({ email, fullname }) {
    this.user = { email, fullname }

    /*
    * PRIVATE FUNCTION 
    */
    this.init = this.init.bind(this)
    this.getUserList = this.getUserList.bind(this)
    this.getUserByIds = this.getUserByIds.bind(this)
    this.getChannelList = this.getChannelList.bind(this)
    this.getChannel = this.getChannel.bind(this)
    this.createChannel = this.createChannel.bind(this)
    this.getMessageList = this.getMessageList.bind(this)

    /*
    * PUBLIC FUNCTION 
    */

    // SET LISTENER
    this.onReady = this.onReady.bind(this)
    this.onError = this.onError.bind(this)
    this.onUserList = this.onUserList.bind(this)
    this.onChannelList = this.onChannelList.bind(this)
    this.onReceiveMessage = this.onReceiveMessage.bind(this)
    this.onSendMessage = this.onSendMessage.bind(this)
    // METHOD
    this.getChannelFromuser = this.getChannelFromuser.bind(this)
    this.sendMessage = this.sendMessage.bind(this)

    this.init().then((user: IUser) => {
      this.user = user
      this.isReady = true
      if (this.onReadyCallback) this.onReadyCallback(this.user)
      this.getUserList()
      this.getChannelList()
    }).catch((error) => {
      if (this.onInitFailureCallback) this.onInitFailureCallback(strings.error.init)
    })
  }

  private init() {
    return new Promise(async (resolve, reject) => {
      if (this.user && this.user.email && this.user.fullname) {
        const getUserRef = firebase.firestore().collection('user')
        const user = await getUserRef.where('email', '==', this.user.email).get()

        if (user.empty) {
          let uuid = generateUUID(this.user.email)
          const newUser = { uuid, ...this.user, photo: undefined }
          const createUserRef = firebase.firestore().collection('user').doc(uuid)
          createUserRef.set(newUser)
          this.user = newUser
        } else {
          this.user = user.docs[0].data() as IUser
        }

        resolve(this.user)
      } else {
        if (this.onErrorCallback) this.onErrorCallback(strings.error.init_required)
      }
    })
  }

  private getUserList() {
    if (this.isReady) {
      const userListRef = firebase.firestore().collection('user')
      userListRef.orderBy('fullname', 'ASC').onSnapshot((snapshot) => {
        if (snapshot.empty) {
          if (this.userListCallback) this.userListCallback([])
        } else {
          Promise.all(snapshot.docs.map(doc => {
            const user = doc.data() as IUser
            if (!equals(user, this.user)) {
              if (this.users[user.uuid]) {
                this.users[user.uuid] = {
                  ...this.users[user.uuid],
                  ...user
                }
              } else {
                this.users[user.uuid] = user
              }
            }
          })).then(() => {
            if (this.userListCallback) this.userListCallback(values(this.users))
          })
        }
      }, (error) => {
        if (this.onErrorCallback) this.onErrorCallback(strings.error.userlist_failure)
      })
    } else {
      if (this.onErrorCallback) this.onErrorCallback(strings.error.not_ready)
    }
  }

  private async getUserByIds(uuids) {
    return await Promise.all(uuids.map(async uuid => {
      const userListRef = firebase.firestore().collection('user').doc(uuid)
      const users = await userListRef.get()
      return users.data()
    }))
  }

  private async getChannelList() {
    if (this.isReady) {
      const channelRef = firebase.firestore().collection('channels').where(`member_ids.${this.user.uuid}`, '==', true)
      channelRef.onSnapshot((snapshot) => {
        if (snapshot.empty) {
          if (this.channelListCallback) this.channelListCallback([])
        } else {
          Promise.all(snapshot.docs.map(async doc => {
            const channel = doc.data() as IChannelStore
            const localChannel = {
              uuid: channel.uuid,
              last_message: channel.last_message,
              timestamp: channel.timestamp,
              type: channel.type,
              members: await this.getUserByIds(keys(channel.member_ids))
            } as IChannel

            if (this.channels[localChannel.uuid]) {
              this.channels[localChannel.uuid] = {
                ...this.channels[channel.uuid],
                ...localChannel
              }
            } else {
              this.channels[localChannel.uuid] = localChannel
            }
          })).then(() => {
            if (this.channelListCallback) this.channelListCallback(values(this.channels))
          })
        }
      }, (error) => {
        if (this.onErrorCallback) this.onErrorCallback(strings.error.userlist_failure)
      })
    } else {
      if (this.onErrorCallback) this.onErrorCallback(strings.error.not_ready)
    }
  }

  private async getChannel(recipient: IUser) {
    if (this.isReady) {
      const channelRef = firebase.firestore().collection('channels')
      const channels = await channelRef.where('type', '==', CHANNEL_TYPE.single).where(`member_ids.${this.user.uuid}`, '==', true).where(`member_ids.${recipient.uuid}`, '==', true).get()
      if (channels.empty) {
        const channel = {
          uuid: generateUUID(`${CHANNEL_TYPE.single}:${this.user.uuid}-${recipient.uuid}`),
          last_message: undefined,
          members: [this.user, recipient],
          type: CHANNEL_TYPE.single,
        }
        return channel
      } else {
        const channel = channels.docs[0].data() as IChannel
        return channel
      }
    } else {
      if (this.onErrorCallback) this.onErrorCallback(strings.error.not_ready)
    }
  }

  private async createChannel(channel: IChannel) {
    if (this.isReady) {
      const channelRef = firebase.firestore().collection('channels')
      const channels = await channelRef.where('type', '==', CHANNEL_TYPE.single).where(`member_ids.${channel.members[0].uuid}`, '==', true).where(`member_ids.${channel.members[1].uuid}`, '==', true).get()
      if (channels.empty) {
        const savedChannel = {
          uuid: channel.uuid,
          member_ids: {
            [channel.members[0].uuid]: true,
            [channel.members[1].uuid]: true
          },
          type: CHANNEL_TYPE.single,
          last_message: undefined,
          timestamp: new Date().valueOf().toString(),
        } as IChannelStore
        channelRef.doc(channel.uuid).set(savedChannel)
      }
    } else {
      if (this.onErrorCallback) this.onErrorCallback(strings.error.not_ready)
    }
  }

  private getMessageList(channel: IChannel) {
    if (this.isReady) {
      const messageListRef = firebase.firestore().collection(`messages-${channel.uuid}`)
      messageListRef.orderBy('timestamp', 'DESC').onSnapshot((snapshot) => {
        if (snapshot.empty) {
          if (this.messageListCallback) this.messageListCallback([])
        } else {
          Promise.all(snapshot.docs.map(doc => {
            // do something
          })).then(() => {
            if (this.messageListCallback) this.messageListCallback([])
          })
        }
      }, (error) => {
        if (this.onErrorCallback) this.onErrorCallback(strings.error.messagelist_failure)
      })
    } else {
      if (this.onErrorCallback) this.onErrorCallback(strings.error.not_ready)
    }
  }

  onReady(callback) {
    this.onReadyCallback = callback
  }

  onInitFailure(callback) {
    this.onInitFailureCallback = callback
  }

  onError(callback) {
    this.onErrorCallback = callback
  }

  onUserList(callback) {
    this.userListCallback = callback
  }

  onChannelList(callback) {
    this.channelListCallback = callback
  }

  onMessageList(callback) {
    this.messageListCallback = callback
  }

  onReceiveMessage(callback) {
    this.receiveMessageCallback = callback
  }

  onSendMessage(callback) {
    this.sendMessageCallback = callback
  }

  async getChannelFromuser(recipient: IUser) {
    const channel = await this.getChannel(recipient)
    return channel
  }

  sendMessage(channel: IChannel, message: IMessage) {
    return new Promise(async (resolve, reject) => {
      try {
        this.createChannel(channel)
        const uuid = generateUUID(channel.uuid)
        const ref = firebase.firestore().collection(`message.${channel.uuid}`).doc(uuid)
        ref.set({
          message: message.message,
          attachments: message.attachments,
          sender: this.user.uuid,
          read_ids: [this.user.uuid],
          receive_ids: [this.user.uuid],
          timestamp: new Date().valueOf()
        })
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default FireEngine