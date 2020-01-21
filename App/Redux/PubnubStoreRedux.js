import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { convertArrToObj, isSingleChat, convertTimestampToDate } from '../Pubnub/PubnubHelper'
import R from 'ramda'
import PubnubStrings from '../Pubnub/PubnubStrings'
import { Method } from 'react-native-awesome-component'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  //  SAVE
  saveUser: ['data'],
  saveSpaces: ['data'],
  saveMessages: ['data', 'isInit'],
  saveMembers: ['data'],
  saveOnlineUser: ['data'],

  // action message count
  decreaseMessageCount: ['data'],
  increaseMessageCount: ['data'],
  setMessageCount: ['data'],

  // LISTENER
  onReceiveStatus: ['data'],
  onReceivePresence: ['data'],
  onReceiveMessage: ['data'],
  onReceiveSignal: ['data'],
  onReceiveMessageAction: ['data'],
  onReceiveUser: ['data'],
  onReceiveSpace: ['data'],
  onReceiveMembership: ['data'],

  // RESET
  resetStore: null,

  // MESSAGE QUEUE
  addMessageQueue: ['data'],
  messageQueueSuccess: ['data'],
  messageQueueFailure: ['data'],
  resendQueueMessage: ['data'],

  // CACHE IMAGE
  putLocalImageMessage: ['data'],
  putLocalImageUser: ['data'],
})

export const PubnubStoreTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  pubnubUser: {},
  spaces: {},
  typings: {},
  userPresence: {},
  messageQueue: {},
})

/* ------------- Selectors ------------- */

export const PubnubStoreSelectors = {
  getData: state => state.data,
  getSingleSpaceByUserId: ({ pubnubStore }, id) => {
    const { spaces } = pubnubStore
    const single = R.values(spaces).filter(space => (space.id.includes('single-') && (space.custom[id] !== undefined)))
    if (single.length > 0) {
      return single[0]
    } else {
      return undefined
    }
  },
  getChannelsToken: ({ pubnubStore }) => {
    const { spaces } = pubnubStore
    const channelWithTimetoken = R.values(spaces).filter(space => (space.lastReadMessageTimetoken !== null))
    return channelWithTimetoken.map(space => { return { channel: space.id, timetoken: space.lastReadMessageTimetoken } })
  },
  getMessageQueue: ({ pubnubStore }, spaceId) => {
    if (spaceId) {
      return R.values(pubnubStore.messageQueue).filter((m) => m.channel === spaceId)
    } else {
      return R.values(pubnubStore.messageQueue)
    }
  },
  getPubnubUser: ({ pubnubStore }) => pubnubStore.pubnubUser,
}

/* ------------- Reducers ------------- */

// request the data from an api
export const saveUserReducer = (state, { data }) => {
  return state.merge({ ...state, user: data })
}

export const saveSpacesReducer = (state, { data }) => {
  let spaces = { ...state.spaces }
  for (let i = 0; i < data.length; i++) {
    if (spaces[data[i].id]) {
      spaces = {
        ...spaces,
        [data[i].id]: {
          ...spaces[data[i].id],
          ...data[i],
        }
      }
    } else {
      spaces = {
        ...spaces,
        [data[i].id]: {
          ...data[i],
          messages: {},
          lastReadMessageTimetoken: null,
          lastMessage: null,
          lastMessageTimetoken: new Date(data[i].updated).valueOf(),
          unreadCount: 0,
          members: [],
        }
      }
    }
  }

  return state.merge({ ...state, spaces })
}

export const saveMessagesReducer = (state, { data, isInit }) => {
  let spaces = { ...state.spaces }
  const channelsIds = R.keys(data)
  for (let i = 0; i < channelsIds.length; i++) {
    if (spaces[channelsIds[i]]) {
      let lastMessageTimetoken = spaces[channelsIds[i]].lastMessageTimetoken
      let nextMessageTimetoken = null

      if (isInit) {
        nextMessageTimetoken = convertTimestampToDate(data[channelsIds[i]][0].timetoken).valueOf()

        if (nextMessageTimetoken > lastMessageTimetoken) {
          lastMessageTimetoken = nextMessageTimetoken
        }

        spaces = {
          ...spaces,
          [channelsIds[i]]: {
            ...spaces[channelsIds[i]],
            lastMessageTimetoken,
            lastMessage: data[channelsIds[i]][0]
          }
        }
      } else {
        const messages = R.mergeDeepRight(spaces[channelsIds[i]].messages, convertArrToObj(data[channelsIds[i]], 'timetoken'))
        const lastMessage = R.values(messages).sort(Method.Array.compareValues('timetoken', 'desc', true, true))[0]
        nextMessageTimetoken = convertTimestampToDate(lastMessage.timetoken).valueOf()
        if (nextMessageTimetoken > lastMessageTimetoken) {
          lastMessageTimetoken = nextMessageTimetoken
        }

        spaces = {
          ...spaces,
          [channelsIds[i]]: {
            ...spaces[channelsIds[i]],
            messages,
            lastMessageTimetoken,
            lastMessage,
          }
        }
      }
    }
  }

  return state.merge({ ...state, spaces })
}

export const saveMembers = (state, { data }) => {
  const { channel, members } = data
  let spaces = { ...state.spaces }
  if (spaces[channel] && spaces[channel].members) {
    spaces = {
      ...spaces,
      [channel]: {
        ...spaces[channel],
        members: Method.Array.mergeAndReplace(spaces[channel].members, members, 'id')
      }
    }
  } else {
    spaces = {
      ...spaces,
      [channel]: {
        ...spaces[channel],
        members,
      }
    }
  }

  return state.merge({ ...state, spaces })
}

export const saveOnlineUserReducer = (state, { data }) => {
  let userPresence = { ...state.userPresence }
  const { channels } = data
  const channelKeys = R.keys(channels)
  for (let i = 0; i < channelKeys.length; i++) {
    const channel = channels[channelKeys[i]]
    const { occupants } = channel
    for (let j = 0; j < occupants.length; j++) {
      userPresence = {
        ...userPresence,
        [channelKeys[i]]: {
          ...userPresence[channelKeys[i]],
          [occupants[j].uuid]: {
            uuid: occupants[j].uuid,
            timestamp: new Date().valueOf(),
            online: true,
          }
        }
      }
    }
  }


  return state.merge({ ...state, userPresence })
}

export const onReceiveStatusReducer = (state, { data }) => {
  return state.merge({ ...state, })
}

export const onReceivePresenceReducer = (state, { data }) => {
  const { channel, uuid, action, timestamp } = data
  let userPresence = { ...state.userPresence }
  if (action === PubnubStrings.presence.join) {
    userPresence = {
      ...userPresence,
      [channel]: {
        ...userPresence[channel],
        [uuid]: {
          uuid,
          timestamp,
          online: true,
        }
      }
    }
  }

  if ((action === PubnubStrings.presence.leave) || (action === PubnubStrings.presence.timeout)) {
    userPresence = {
      ...userPresence,
      [channel]: {
        ...userPresence[channel],
        [uuid]: {
          uuid,
          timestamp,
          online: false,
        }
      }
    }
  }

  return state.merge({ ...state, userPresence })
}

export const onReceiveMessageReducer = (state, { data }) => {
  const { channel, timetoken, message } = data
  let spaces = { ...state.spaces }
  if (spaces[channel]) {
    spaces = {
      ...spaces,
      [channel]: {
        ...spaces[channel],
        messages: {
          ...spaces[channel].messages,
          [timetoken]: {
            channel,
            timetoken,
            message,
          }
        },
        lastMessage: {
          channel,
          timetoken,
          message,
        },
        lastMessageTimetoken: convertTimestampToDate(timetoken).valueOf(),
      }
    }
  }

  return state.merge({ ...state, spaces })
}

export const onReceiveSignalReducer = (state, { data }) => {
  const { channel, publisher, message } = data
  let typings = { ...state.typings }
  if (message[PubnubStrings.message.type.typing] !== undefined) {
    if (isSingleChat(channel)) {
      const space = state.spaces[channel]
      const { custom } = space
      if (message[PubnubStrings.message.type.typing] === true) {
        typings = {
          ...typings,
          [channel]: {
            [publisher]: JSON.parse(custom[publisher])
          }
        }
      } else {
        if (typings[channel][publisher]) {
          typings = R.dissocPath([channel, publisher], typings)
        }
      }
    }
  }

  return state.merge({ ...state, typings })
}

export const onReceiveMessageActionReducer = (state, { data }) => {
  const { channel, event } = data
  let spaces = { ...state.spaces }
  if (event === PubnubStrings.event.value.added) {
    const { actionTimetoken, type, uuid, value, messageTimetoken } = data.data
    const { messages } = spaces[channel]

    let curMessage = messages[messageTimetoken]

    if (curMessage.actions) {
      curMessage = {
        ...curMessage,
        actions: {
          ...curMessage.actions,
          [type]: {
            ...curMessage.actions[type],
            [value]: R.is(Array, curMessage.actions[type][value]) ? Method.Array.mergeAndReplace(curMessage.actions[type][value], [{ uuid, actionTimetoken }], 'uuid', 'actionTimetoken', 'desc', true) : [{ uuid, actionTimetoken }]
          }
        }
      }
    } else {
      curMessage = {
        ...curMessage,
        actions: {
          [type]: {
            [value]: [{ uuid, actionTimetoken }]
          }
        }
      }
    }

    spaces = {
      ...spaces,
      [channel]: {
        ...spaces[channel],
        messages: {
          ...spaces[channel].messages,
          [curMessage.timetoken]: curMessage
        }
      }
    }
  }

  return state.merge({ ...state, spaces })
}

export const onReceiveUserReducer = (state, { data }) => {
  return state.merge({ ...state })
}

export const onReceiveSpaceReducer = (state, { data }) => {
  return state.merge({ ...state, })
}

export const onReceiveMembershipReducer = (state, { data }) => {
  return state.merge({ ...state, })
}

export const decreaseMessageCountReducer = (state, { data }) => {
  const { channel, timetoken } = data
  let spaces = { ...state.spaces }

  if (spaces[channel]) {
    let newTimetoken = spaces[channel].lastReadMessageTimetoken
    let newUnreadCount = spaces[channel].unreadCount

    if (newTimetoken !== null) {
      if (timetoken > newTimetoken) {
        newTimetoken = timetoken
      }
    } else {
      newTimetoken = timetoken
    }

    if (newUnreadCount > 0) {
      newUnreadCount = newUnreadCount - 1
    }


    let space = {
      ...spaces[channel],
      lastReadMessageTimetoken: newTimetoken,
      unreadCount: newUnreadCount,
    }

    spaces = {
      ...spaces,
      [space.id]: space
    }
  }

  return state.merge({ ...state, spaces })
}

export const increaseMessageCountReducer = (state, { data }) => {
  const { channel } = data
  let spaces = { ...state.spaces }

  if (spaces[channel]) {
    let newUnreadCount = spaces[channel].unreadCount

    newUnreadCount = newUnreadCount + 1

    let space = {
      ...spaces[channel],
      unreadCount: newUnreadCount,
    }


    spaces = {
      ...spaces,
      [space.id]: space
    }
  }

  return state.merge({ ...state, spaces })
}

export const setMessageCountReducer = (state, { data }) => {
  const { channelIds, channels } = data
  let spaces = { ...state.spaces }
  for (let i = 0; i < channelIds.length; i++) {
    if (spaces[channelIds[i]]) {
      spaces = {
        ...spaces,
        [channelIds[i]]: {
          ...spaces[channelIds[i]],
          unreadCount: channels[channelIds[i]]
        }
      }
    }
  }
  return state.merge({ ...state, spaces })
}

export const resetStoreReducer = (state) => {
  return state.merge(INITIAL_STATE)
}

export const addMessageQueueReducer = (state, { data }) => {
  const { channel, timetoken, message, status } = data

  let messageQueue = {
    ...state.messageQueue,
    [data.timetoken]: data
  }

  let spaces = { ...state.spaces }
  if (spaces[channel]) {
    spaces = {
      ...spaces,
      [channel]: {
        ...spaces[channel],
        messages: {
          ...spaces[channel].messages,
          [timetoken]: {
            channel,
            timetoken,
            message,
            status,
          }
        },
        lastMessage: {
          channel,
          timetoken,
          message,
          status
        },
        lastMessageTimetoken: convertTimestampToDate(timetoken).valueOf(),
      }
    }
  }

  return state.merge({ ...state, messageQueue, spaces })
}

export const messageQueueSuccessReducer = (state, { data }) => {
  const { channel, timetoken } = data
  let messageQueue = { ...state.messageQueue }
  delete messageQueue[data.timetoken]

  let spaces = { ...state.spaces }
  if (spaces[channel]) {
    spaces = R.dissocPath([channel, 'messages', timetoken], spaces)
  }

  return state.merge({ ...state, messageQueue, spaces })
}

export const messageQueueFailureReducer = (state, { data }) => {
  const { channel, timetoken } = data

  let spaces = { ...state.spaces }
  if (spaces[channel] && spaces[channel].messages && spaces[channel].messages[timetoken]) {
    spaces = {
      ...spaces,
      [channel]: {
        ...spaces[channel],
        messages: {
          ...spaces[channel].messages,
          [timetoken]: {
            ...spaces[channel].messages[timetoken],
            status: PubnubStrings.message.status.failure,
          }
        },
        lastMessage: {
          ...spaces[channel].lastMessage,
          status: PubnubStrings.message.status.failure,
        },
        lastMessageTimetoken: convertTimestampToDate(timetoken).valueOf(),
      }
    }
  }

  return state.merge({ ...state, spaces })
}

export const resendQueueMessageReducer = (state, { data }) => {
  return state
}

export const putLocalImageMessageReducer = (state, { data }) => {
  const { message, localPath } = data
  const { channel, timetoken } = message

  let spaces = { ...state.spaces }
  if (spaces[channel]) {
    spaces = {
      ...spaces,
      [channel]: {
        ...spaces[channel],
        messages: {
          ...spaces[channel].messages,
          [timetoken]: {
            ...spaces[channel].messages[timetoken],
            message: {
              ...spaces[channel].messages[timetoken].message,
              localPath,
            }
          }
        },
      }
    }
  }

  return state.merge({ ...state, spaces })
}

export const putLocalImageUserReducer = (state, { data }) => {
  return state
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SAVE_USER]: saveUserReducer,
  [Types.SAVE_SPACES]: saveSpacesReducer,
  [Types.SAVE_MESSAGES]: saveMessagesReducer,
  [Types.SAVE_MEMBERS]: saveMembers,
  [Types.SAVE_ONLINE_USER]: saveOnlineUserReducer,
  [Types.ON_RECEIVE_STATUS]: onReceiveStatusReducer,
  [Types.ON_RECEIVE_PRESENCE]: onReceivePresenceReducer,
  [Types.ON_RECEIVE_MESSAGE]: onReceiveMessageReducer,
  [Types.ON_RECEIVE_SIGNAL]: onReceiveSignalReducer,
  [Types.ON_RECEIVE_MESSAGE_ACTION]: onReceiveMessageActionReducer,
  [Types.ON_RECEIVE_USER]: onReceiveUserReducer,
  [Types.ON_RECEIVE_SPACE]: onReceiveSpaceReducer,
  [Types.ON_RECEIVE_MEMBERSHIP]: onReceiveMembershipReducer,
  [Types.DECREASE_MESSAGE_COUNT]: decreaseMessageCountReducer,
  [Types.INCREASE_MESSAGE_COUNT]: increaseMessageCountReducer,
  [Types.SET_MESSAGE_COUNT]: setMessageCountReducer,
  [Types.RESET_STORE]: resetStoreReducer,
  [Types.ADD_MESSAGE_QUEUE]: addMessageQueueReducer,
  [Types.MESSAGE_QUEUE_SUCCESS]: messageQueueSuccessReducer,
  [Types.MESSAGE_QUEUE_FAILURE]: messageQueueFailureReducer,
  [Types.RESEND_QUEUE_MESSAGE]: resendQueueMessageReducer,
  [Types.PUT_LOCAL_IMAGE_MESSAGE]: putLocalImageMessageReducer,
  [Types.PUT_LOCAL_IMAGE_USER]: putLocalImageUserReducer,
})
