import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

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
  setUser: ['data']

  // rooms action

  // messages action

  // users action
})

export const QiscusTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  init: undefined,
})

/* ------------- Selectors ------------- */

export const QiscusSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const qiscusInitReducer = (state) => {
  return state.merge({ ...state, init: true })
}
export const qiscusDestroyReducer = (state) => {
  return state.merge({ INITIAL_STATE })
}
export const loginSuccessCallbackReducer = (state, { data }) => {
  return state.merge({ ...state, })
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


export const setUserReducer = (state, { data }) => {
  return state.merge({ ...state, })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.QISCUS_INIT]: qiscusInitReducer,
  [Types.QISCUS_DESTROY]: qiscusDestroyReducer,
  [Types.LOGIN_SUCCESS_CALLBACK]: loginSuccessCallbackReducer,
  [Types.MESSAGE_DELETED_CALLBACK]: messageDeletedCallbackReducer,
  [Types.MESSAGE_DELIVERED_CALLBACK]: messageDeliveredCallbackReducer,
  [Types.MESSAGE_READ_CALLBACK]: messageReadCallbackReducer,
  [Types.PRESENCE_CALLBACK]: presenceCallbackReducer,
  [Types.TYPING_CALLBACK]: typingCallbackReducer,
  [Types.ON_RECONNECT_CALLBACK]: onReconnectCallbackReducer,
  [Types.NEW_MESSAGES_CALLBACK]: newMessagesCallbackReducer,
  [Types.ROOM_CLEARED_CALLBACK]: roomClearedCallbacReducer,

  [Types.SET_USER]: setUserReducer,
})
