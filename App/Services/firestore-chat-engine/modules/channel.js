import firebase from "react-native-firebase"
import { keys } from 'ramda'
import { getUserDetail } from "./user"
import { generateUUID, CHANNEL_TYPE } from "./helper"
import { currentUser } from "../chat-engine"

export let channelList = []
export let channelListCallback = () => null

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