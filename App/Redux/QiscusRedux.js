import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { DEFAULT_REDUCER_STATE } from '../Utils/Const'

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
  rooms: [],
  messages: [],
  users: [],

  getRooms: DEFAULT_REDUCER_STATE,
  getMessages: DEFAULT_REDUCER_STATE,
  sendMessage: DEFAULT_REDUCER_STATE,
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
  return state.merge({ ...state, })
}
export const messageDeliveredCallbackReducer = (state, { data }) => {
  return state.merge({ ...state, })
}
export const messageReadCallbackReducer = (state, { data }) => {
  return state.merge({ ...state, })
}
export const presenceCallbackReducer = (state, { data, userId }) => {
  return state.merge({ ...state, })
}
export const typingCallbackReducer = (state, { data }) => {
  return state.merge({ ...state, })
}
export const onReconnectCallbackReducer = (state, { data }) => {
  return state.merge({ ...state, })
}
export const newMessagesCallbackReducer = (state, { data }) => {
  return state.merge({ ...state, })
}
export const roomClearedCallbacReducer = (state, { data }) => {
  return state.merge({ ...state, })
}

// AUTH
export const setUserReducer = (state, { data }) => {
  return state.merge({ ...state, })
}

// ROOMS
export const getRoomsRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getRooms: { ...state.getRooms, fetching: true, data } })
}
export const getRoomsSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getRooms: { ...state.getRooms, fetching: false, error: undefined }, rooms: payload })
}
export const getRoomsFailureReducer = (state) => {
  return state.merge({ ...state, getRooms: { ...state.getRooms, fetching: false, error: true } })
}

// MESSAGES
export const getMessagesRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getMessages: { ...state.getMessages, fetching: true, data } })
}
export const getMessagesSuccessReducer = (state, { payload }) => {
  const formattedMessages = payload.reduce((result, message) => {
    result[message.unique_temp_id] = message;
    return result;
  }, {});

  return state.merge({ 
    ...state, 
    getMessages: { ...state.getMessages, fetching: false, error: undefined }, 
    messages: formattedMessages, 
  })
}
export const getMessagesFailureReducer = (state) => {
  return state.merge({ ...state, getMessages: { ...state.getMessages, fetching: false, error: true } })
}

export const sendMessageRequestReducer = (state, { data }) => {
  return state.merge({ ...state, sendMessage: { ...state.sendMessage, fetching: true, data } })
}
export const sendMessageSuccessReducer = (state, { payload }) => {
  console.tron.log({ 'state.sendMessage': state.sendMessage })
  return state.merge({ 
    ...state, 
    sendMessage: { ...state.sendMessage, fetching: false, error: undefined }, 
    messages: {
      ...state.messages,
      [state.sendMessage.data.uniqueId]: payload,
    },
  })
}
export const sendMessageFailureReducer = (state) => {
  return state.merge({ ...state, sendMessage: { ...state.sendMessage, fetching: false, error: true } })
}

// USERS
export const getUsersRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getUsers: { ...state.getUsers, fetching: true, data } })
}
export const getUsersSuccessReducer = (state, { payload }) => {
  return state.merge({ 
    ...state, 
    getUsers: { ...state.getUsers, fetching: false, error: undefined }, 
    users: payload, 
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
    openRoom: { ...state.openRoom, fetching: false, error: undefined }, 
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

  // USERS
  [Types.GET_USERS_REQUEST]: getUsersRequestReducer,
  [Types.GET_USERS_SUCCESS]: getUsersSuccessReducer,
  [Types.GET_USERS_FAILURE]: getUsersFailureReducer,

  [Types.OPEN_ROOM_REQUEST]: openRoomRequestReducer,
  [Types.OPEN_ROOM_SUCCESS]: openRoomSuccessReducer,
  [Types.OPEN_ROOM_FAILURE]: openRoomFailureReducer,
})
