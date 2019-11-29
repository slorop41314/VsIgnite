import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initRequest: ['data'],
  initSuccess: ['payload'],
  initFailure: null,
  saveUserList: ['data'],
  saveChannelList: ['data'],
  saveMessageList: ['data'],
  sendMessageRequest: ['data'],
  sendMessageSuccess: ['payload'],
  sendMessageFailure: null,
})

export const FireEngineTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  init: { loading: undefined, error: undefined, data: undefined },
  userList: [],
  channelList: [],
  messageList: [],
  sendMessage: { loading: undefined, error: undefined, data: undefined, payload: undefined }
})

/* ------------- Selectors ------------- */

export const FireEngineSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const initRequest = (state, { data }) => {
  return state.merge({ ...state, init: { loading: true, error: false, data } })
}
export const initSuccess = (state, { payload }) => {
  return state.merge({ ...state, init: { ...init, loading: false, error: false } })
}
export const initFailure = (state) => {
  return state.merge({ ...state, init: { ...init, loading: false, error: true } })
}

export const saveUserList = (state, { data }) => {
  return state.merge({ ...state, userList: data })
}
export const saveMessageList = (state, { data }) => {
  return state.merge({ ...state, messageList: data })
}
export const saveChannelList = (state, { data }) => {
  return state.merge({ ...state, messageList: data })
}

export const sendMessageRequest = (state, { data }) => {
  return state.merge({ ...state, sendMessage: { loading: true, error: undefined, data, payload: undefined } })
}
export const sendMessageSuccess = (state, { payload }) => {
  return state.merge({ ...state, sendMessage: { ...state.sendMessage, loading: false, error: false, payload } })
}
export const sendMessageFailure = (state) => {
  return state.merge({ ...state, sendMessage: { ...state.sendMessage, loading: false, error: true, payload: undefined } })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INIT_REQUEST]: initRequest,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.INIT_FAILURE]: initFailure,
  [Types.SAVE_USER_LIST]: saveUserList,
  [Types.SAVE_MESSAGE_LIST]: saveMessageList,
  [Types.SAVE_CHANNEL_LIST]: saveChannelList,
  [Types.SEND_MESSAGE_REQUEST]: sendMessageRequest,
  [Types.SEND_MESSAGE_SUCCESS]: sendMessageSuccess,
  [Types.SEND_MESSAGE_FAILURE]: sendMessageFailure
})
