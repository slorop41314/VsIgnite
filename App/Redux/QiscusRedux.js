import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { DEFAULT_REDUCER_STATE } from '../Utils/Const'
import { Method } from 'react-native-awesome-component'
import QiscusStrings from '../Qiscus/QiscusStrings'
import { values } from 'ramda'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  // main action
  qiscusInit: null,
  qiscusDestroy: null,
  // listener
  loginSuccessCallback: ['data'],
  messageDeletedCallback: ['data'],
  messageDeliveredCallback: ['data'],
  messageReadCallback: ['data'],
  presenceCallback: ['data', 'userId'],
  typingCallback: ['data'],
  onReconnectCallback: ['data'],
  newMessagesCallback: ['data'],
  roomClearedCallback: ['data'],
  // auth action
  setUser: ['data'],

  // rooms action
  setActiveRoomRequest: ['data'],
  setActiveRoomSuccess: ['payload'],
  setActiveRoomFailure: null,

  exitActiveRoomRequest: null,
  exitActiveRoomSuccess: null,
  exitActiveRoomFailure: null,

  getRoomsRequest: ['data'],
  getRoomsSuccess: ['payload'],
  getRoomsFailure: null,

  // messages action
  getMessagesRequest: ['data'],
  getMessagesSuccess: ['payload'],
  getMessagesFailure: null,

  sendMessageRequest: ['data'],
  sendMessageSuccess: ['payload'],
  sendMessageFailure: null,

  readMessageRequest: ['data'],
  readMessageSuccess: null,
  readMessageFailure: null,

  // users action
  getUsersRequest: ['data'],
  getUsersSuccess: ['payload'],
  getUsersFailure: null,

  openRoomRequest: ['data'],
  openRoomSuccess: ['payload'],
  openRoomFailure: null,
})

export const QiscusTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  init: undefined,
  currentUser: undefined,
  rooms: {},
  messages: [],
  users: [],
  activeRoom: undefined,

  setActiveRoom: DEFAULT_REDUCER_STATE,
  getRooms: DEFAULT_REDUCER_STATE,

  getMessages: DEFAULT_REDUCER_STATE,
  sendMessage: DEFAULT_REDUCER_STATE,
  readMessage: DEFAULT_REDUCER_STATE,

  getUsers: DEFAULT_REDUCER_STATE,
  openRoom: DEFAULT_REDUCER_STATE,

})

/* ------------- Selectors ------------- */

export const QiscusSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// MAIN ACTION
export const qiscusInitReducer = (state) => {
  return state.merge({ ...state, init: true })
}
export const qiscusDestroyReducer = (state) => {
  return state.merge({ INITIAL_STATE })
}

// LISTENER
export const loginSuccessCallbackReducer = (state, { data }) => {
  const { user } = data
  return state.merge({ ...state, currentUser: user })
}
export const messageDeletedCallbackReducer = (state, { data }) => {
  const { activeRoom } = state
  let newMessages = { ...state.messages }
  if (activeRoom) {
    const { comment } = data
    delete newMessages[comment.room_id][comment.id]
  }
  return state.merge({ ...state, messages: newMessages })
}
export const messageDeliveredCallbackReducer = (state, { data }) => {
  const { activeRoom } = state
  let newMessages = { ...state.messages }
  if (activeRoom) {
    const { comment } = data
    newMessages = {
      ...newMessages,
      [comment.room_id]: {
        ...newMessages[comment.room_id],
        [comment.id]: comment,
      }
    }
  }

  return state.merge({ ...state, messages: newMessages })
}
export const messageReadCallbackReducer = (state, { data }) => {
  const { activeRoom } = state
  let newMessages = { ...state.messages }
  if (activeRoom) {
    const { comment } = data

    let messagesToUpdate = Object.values(newMessages[comment.room_id] || []).filter(m => (m.status === QiscusStrings.message_status.delivered) || (m.status === QiscusStrings.message_status.sent))
    for (let i = 0; i < messagesToUpdate.length; i++) {
      newMessages = {
        ...newMessages,
        [messagesToUpdate[i].room_id]: {
          ...newMessages[messagesToUpdate[i].room_id],
          [messagesToUpdate[i].id]: {
            ...messagesToUpdate[i],
            status: QiscusStrings.message_status.read
          },
        }
      }
    }
  }

  return state.merge({ ...state, messages: newMessages })
}
export const presenceCallbackReducer = (state, { data, userId }) => {
  const { activeRoom, messages } = state
  return state.merge({ ...state, })
}
export const typingCallbackReducer = (state, { data }) => {
  const { activeRoom } = state
  return state.merge({ ...state, })
}
export const onReconnectCallbackReducer = (state, { data }) => {
  return state.merge({ ...state, })
}
export const newMessagesCallbackReducer = (state, { data }) => {
  let newMessages = { ...state.messages }
  let newRooms = { ...state.rooms }
  const { activeRoom } = state

  const { messages } = data

  for (let i = 0; i < messages.length; i++) {
    newMessages = {
      ...newMessages,
      [messages[i].room_id]: {
        ...newMessages[messages[i].room_id],
        [messages[i].id]: messages[i]
      }
    }

    const currentRoom = newRooms[messages[i].room_id]

    const { last_comment } = currentRoom
    if (messages[i].unix_timestamp > last_comment.unix_timestamp) {
      newRooms = {
        ...newRooms,
        [messages[i].room_id]: {
          ...newRooms[messages[i].room_id],
          last_comment_id: messages[i].id,
          last_comment_message: messages[i].message,
          last_comment_message_created_at: new Date(messages[i].unix_timestamp * 1000).toString(),
          last_comment: messages[i],
          count_notif: newRooms[messages[i].room_id].count_notif + 1,
        }
      }
    }
  }

  return state.merge({
    ...state,
    messages: newMessages,
    rooms: newRooms,
  })
}
export const roomClearedCallbacReducer = (state, { data }) => {
  return state.merge({ ...state, })
}

// AUTH
export const setUserReducer = (state, { data }) => {
  return state.merge({ ...state, })
}

// ROOMS
export const setActiveRoomRequest = (state, { data }) => {
  return state.merge({ ...state, setActiveRoom: { ...state.setActiveRoom, fetching: true, data } })
}
export const setActiveRoomSuccess = (state, { payload }) => {
  return state.merge({
    ...state,
    setActiveRoom: { ...state.setActiveRoom, fetching: false, error: undefined, payload },
    activeRoom: payload
  })
}
export const setActiveRoomFailure = (state) => {
  return state.merge({ ...state, setActiveRoom: { ...state.setActiveRoom, fetching: false, error: true, payload: undefined } })
}

export const exitActiveRoomRequest = (state) => {
  return state.merge({ ...state })
}
export const exitActiveRoomSuccess = (state) => {
  return state.merge({ ...state, activeRoom: undefined })
}
export const exitActiveRoomFailure = (state) => {
  return state.merge({ ...state })
}

export const getRoomsRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getRooms: { ...state.getRooms, fetching: true, data } })
}
export const getRoomsSuccessReducer = (state, { payload }) => {
  const formattedRooms = payload.reduce((result, room) => {
    result[room.id] = room;
    return result;
  }, {});

  return state.merge({
    ...state,
    getRooms: { ...state.getRooms, fetching: false, error: undefined },
    rooms: formattedRooms
  })
}
export const getRoomsFailureReducer = (state) => {
  return state.merge({ ...state, getRooms: { ...state.getRooms, fetching: false, error: true } })
}

// MESSAGES
export const getMessagesRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getMessages: { ...state.getMessages, fetching: true, data } })
}
export const getMessagesSuccessReducer = (state, { payload }) => {
  const { data } = state.getMessages
  const { roomId } = data

  const formattedMessages = payload.reduce((result, message) => {
    result[message.id] = message;
    return result;
  }, {});

  return state.merge({
    ...state,
    getMessages: { ...state.getMessages, fetching: false, error: undefined },
    messages: {
      ...state.messages,
      [roomId]: formattedMessages,
    },
  })
}
export const getMessagesFailureReducer = (state) => {
  return state.merge({ ...state, getMessages: { ...state.getMessages, fetching: false, error: true } })
}

export const sendMessageRequestReducer = (state, { data }) => {
  return state.merge({ ...state, sendMessage: { ...state.sendMessage, fetching: true, data } })
}
export const sendMessageSuccessReducer = (state, { payload }) => {
  let newMessages = { ...state.messages }

  newMessages = {
    ...newMessages,
    [payload.room_id]: {
      ...newMessages[payload.room_id],
      [payload.id]: payload,
    }
  }

  return state.merge({
    ...state,
    sendMessage: { ...state.sendMessage, fetching: false, error: undefined },
    messages: newMessages
  })
}
export const sendMessageFailureReducer = (state) => {
  return state.merge({ ...state, sendMessage: { ...state.sendMessage, fetching: false, error: true } })
}

export const readMessageRequestReducer = (state, { data }) => {
  return state.merge({ ...state, readMessage: { ...state.readMessage, fetching: true, data } })
}
export const readMessageSuccessReducer = (state) => {
  return state.merge({
    ...state,
    readMessage: { ...state.readMessage, fetching: false, error: undefined },
  })
}
export const readMessageFailureReducer = (state) => {
  return state.merge({ ...state, readMessage: { ...state.readMessage, fetching: false, error: true } })
}

// USERS
export const getUsersRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getUsers: { ...state.getUsers, fetching: true, data } })
}
export const getUsersSuccessReducer = (state, { payload }) => {
  let newUsers = [...state.users]
  const { users } = payload
  if (users) {
    newUsers = Method.Array.mergeAndReplace(newUsers, users)
  }
  return state.merge({
    ...state,
    getUsers: { ...state.getUsers, fetching: false, error: undefined, payload, },
    users: newUsers
  })
}
export const getUsersFailureReducer = (state) => {
  return state.merge({ ...state, getUsers: { ...state.getUsers, fetching: false, error: true } })
}

export const openRoomRequestReducer = (state, { data }) => {
  return state.merge({ ...state, openRoom: { ...state.openRoom, fetching: true, data } })
}
export const openRoomSuccessReducer = (state, { payload }) => {
  return state.merge({
    ...state,
    openRoom: { ...state.openRoom, fetching: false, error: undefined, payload },
  })
}
export const openRoomFailureReducer = (state) => {
  return state.merge({ ...state, openRoom: { ...state.openRoom, fetching: false, error: true } })
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  // MAIN
  [Types.QISCUS_INIT]: qiscusInitReducer,
  [Types.QISCUS_DESTROY]: qiscusDestroyReducer,

  // LISTENER
  [Types.LOGIN_SUCCESS_CALLBACK]: loginSuccessCallbackReducer,
  [Types.MESSAGE_DELETED_CALLBACK]: messageDeletedCallbackReducer,
  [Types.MESSAGE_DELIVERED_CALLBACK]: messageDeliveredCallbackReducer,
  [Types.MESSAGE_READ_CALLBACK]: messageReadCallbackReducer,
  [Types.PRESENCE_CALLBACK]: presenceCallbackReducer,
  [Types.TYPING_CALLBACK]: typingCallbackReducer,
  [Types.ON_RECONNECT_CALLBACK]: onReconnectCallbackReducer,
  [Types.NEW_MESSAGES_CALLBACK]: newMessagesCallbackReducer,
  [Types.ROOM_CLEARED_CALLBACK]: roomClearedCallbacReducer,

  // AUTH
  [Types.SET_USER]: setUserReducer,

  // ROOMS
  [Types.SET_ACTIVE_ROOM_REQUEST]: setActiveRoomRequest,
  [Types.SET_ACTIVE_ROOM_SUCCESS]: setActiveRoomSuccess,
  [Types.SET_ACTIVE_ROOM_FAILURE]: setActiveRoomFailure,

  [Types.EXIT_ACTIVE_ROOM_REQUEST]: exitActiveRoomRequest,
  [Types.EXIT_ACTIVE_ROOM_SUCCESS]: exitActiveRoomSuccess,
  [Types.EXIT_ACTIVE_ROOM_FAILURE]: exitActiveRoomFailure,

  [Types.GET_ROOMS_REQUEST]: getRoomsRequestReducer,
  [Types.GET_ROOMS_SUCCESS]: getRoomsSuccessReducer,
  [Types.GET_ROOMS_FAILURE]: getRoomsFailureReducer,

  // MESSAGES
  [Types.GET_MESSAGES_REQUEST]: getMessagesRequestReducer,
  [Types.GET_MESSAGES_SUCCESS]: getMessagesSuccessReducer,
  [Types.GET_MESSAGES_FAILURE]: getMessagesFailureReducer,

  [Types.SEND_MESSAGE_REQUEST]: sendMessageRequestReducer,
  [Types.SEND_MESSAGE_SUCCESS]: sendMessageSuccessReducer,
  [Types.SEND_MESSAGE_FAILURE]: sendMessageFailureReducer,

  [Types.READ_MESSAGE_REQUEST]: readMessageRequestReducer,
  [Types.READ_MESSAGE_SUCCESS]: readMessageSuccessReducer,
  [Types.READ_MESSAGE_FAILURE]: readMessageFailureReducer,

  // USERS
  [Types.GET_USERS_REQUEST]: getUsersRequestReducer,
  [Types.GET_USERS_SUCCESS]: getUsersSuccessReducer,
  [Types.GET_USERS_FAILURE]: getUsersFailureReducer,

  [Types.OPEN_ROOM_REQUEST]: openRoomRequestReducer,
  [Types.OPEN_ROOM_SUCCESS]: openRoomSuccessReducer,
  [Types.OPEN_ROOM_FAILURE]: openRoomFailureReducer,
})
