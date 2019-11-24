import { is, keys, equals } from 'ramda'
import NavigationServices from '../Services/NavigationServices'
import firebase from "react-native-firebase";
import { call } from '@redux-saga/core/effects';

let currentUser = undefined
let channelList = []
let channelListCallback = () => null

export const CHANNEL_TYPE = {
  single: 'single',
  group: 'group',
}

export async function setUser({ id, email, fullname, photo }, callback) {
  try {
    const ref = firebase.firestore().collection('user')
    const user = await ref.where('email', '==', email).get()
    let uuid = id

    if (user.empty) {
      if (uuid === undefined) {
        uuid = generateUUID(email)
      }
      const newUser = { name: fullname, email, uuid, photo }
      const ref2 = firebase.firestore().collection('user').doc(uuid)
      ref2.set(newUser)
      currentUser = newUser
    } else {
      currentUser = user.docs[0].data()
    }

    if (is(Function, callback)) {
      callback(currentUser)
    }
  } catch (error) {
    console.log('Error Set User', error)
  }
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

export async function getChannelList(callback) {
  channelListCallback = callback
  const ref = firebase.firestore().collection('channels')
  ref.where(`member.${currentUser.uuid}.uuid`, '==', currentUser.uuid).onSnapshot((snapshot) => {
    if (snapshot.empty) {
      callback([])
    } else {
      Promise.all(snapshot.docs.map(async doc => {
        let channel = {
          ...doc.data()
        }
        if (channel.type === CHANNEL_TYPE.single) {
          const memberIds = keys(channel.member)
          const memberId = memberIds.find(id => id !== currentUser.uuid)
          const userData = await getUserDetail(memberId)
          channel = {
            ...channel,
            meta: {
              photo: userData.photo,
              name: userData.name
            }
          }
        }
        return channel
      })).then(async res => {
        channelList = res
        channelListCallback(res)
      })
    }
  }, (error) => {
    console.log('Error get channel list', error)
  })
}

/**
 * @param {*} users user object can be array or target channel
 * @param {*} type channel type (group | single)
 * @param {*} meta meta information required {creator, photo, name}
 */
export async function createOrgetChannel(user, type, meta, callback) {
  try {
    const ref = firebase.firestore().collection('channels')
    if (type === CHANNEL_TYPE.single) {
      const userData = await getUserDetail(user.uuid)
      const channel = await ref.where('type', '==', CHANNEL_TYPE.single).where(`member.${currentUser.uuid}.uuid`, '==', currentUser.uuid).where(`member.${user.uuid}.uuid`, '==', user.uuid).get()
      if (channel.empty) {
        const newChannel = {
          uuid: generateUUID(`${currentUser.uuid}-${user.uuid}`),
          type,
          member: {
            [currentUser.uuid]: currentUser,
            [user.uuid]: user,
          },
          meta,
        }
        const ref2 = firebase.firestore().collection('channels').doc(newChannel.uuid)
        await ref2.set(newChannel)
        const currentChannel = {
          ...newChannel,
          meta: {
            photo: userData.photo,
            name: userData.name,
          }
        }
        callback(currentChannel)
      } else {
        let currentChannel = channel.docs[0].data()
        currentChannel = {
          ...currentChannel,
          meta: {
            photo: userData.photo,
            name: userData.name,
          }
        }
        callback(currentChannel)
      }
    } else {

    }
  } catch (error) {
    console.log('Error crate channel', error)
  }
}

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

export function generateUUID(namespace) {
  const uuidv1 = require('uuid/v1');
  const uuidv3 = require('uuid/v3');
  const MY_NAMESPACE = uuidv1()
  return uuidv3(namespace, MY_NAMESPACE);
}

