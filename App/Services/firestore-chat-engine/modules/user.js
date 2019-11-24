import firebase from "react-native-firebase"
import { equals } from 'ramda'
import { channelListCallback, channelList } from "./channel"
import { currentUser } from "../chat-engine"

export async function getUserDetail(userUUID) {
  const user = firebase.firestore().collection('user').doc(userUUID)
  return new Promise((resolve, reject) => {
    user.onSnapshot(snapshot => {
      const userData = snapshot.data()
      if (channelList.length > 0) {
        const userIndex = channelList.findIndex(channel => channel.member[userData.uuid])
        if (userIndex >= 0) {
          const userChannel = channelList[userIndex]
          const newUserChannel = {
            ...userChannel,
            meta: {
              photo: userData.photo,
              name: userData.name
            }
          }

          if (!equals(userChannel, newUserChannel)) {
            channelList.splice(userIndex, 1, newUserChannel)
            channelListCallback(channelList)
          }
        }
      }
      resolve(userData)
    })
  })
}

export async function getUserList(callback) {
  const ref = firebase.firestore().collection('user')
  ref.onSnapshot((snapshot) => {
    if (snapshot.empty) {
      callback([])
    } else {
      Promise.all(snapshot.docs.map(doc => {
        return doc.data()
      })).then(res => callback(res.filter(u => u.uuid !== currentUser.uuid)))
    }
  }, (error) => {
    console.log('Error get user list', error)
  })
}