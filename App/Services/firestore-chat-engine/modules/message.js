import firebase from "react-native-firebase"
import { generateUUID } from "./helper"
import { currentUser } from "../chat-engine"
import { getUserDetail } from "./user"

export let messageList = []
export let messageListCallback = () => null

export async function createOrGetMessageList(channel, callback) {
  try {
    messageListCallback = callback
    const ref = firebase.firestore().collection(`message.${channel.uuid}`)
    ref.orderBy('timestamp', 'ASC').onSnapshot((snapshot) => {
      if (snapshot.empty) {
        callback([])
      } else {
        Promise.all(snapshot.docs.map(async doc => {
          let message = {
            ...doc.data()
          }
          const userData = await getUserDetail(message.sender)
          message = {
            ...message,
            user: userData
          }
          return message
        })).then(async res => {
          messageList = res
          callback(res)
        })
      }
    }, (error) => {
      console.log('Error get channel list', error)
    })
  } catch (error) {
    console.log('Error get message', error)
  }
}

export async function sendMessage(channel, message, callback) {
  try {
    const uuid = generateUUID(channel.uuid)
    const ref = firebase.firestore().collection(`message.${channel.uuid}`).doc(uuid)
    ref.set({
      message: message.message,
      attachments: message.attachments,
      sender: currentUser.uuid,
      read_ids: [currentUser.uuid],
      receive_ids: [currentUser.uuid],
      timestamp: new Date().valueOf()
    })
  } catch (error) {
    console.log('Error send message', error)
  }
}