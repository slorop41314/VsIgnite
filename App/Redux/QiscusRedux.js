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

  // users action
})

export const QiscusTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  init: undefined,
  currentUser: undefined,
  rooms: [],

  getRooms: DEFAULT_REDUCER_STATE,
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
})
