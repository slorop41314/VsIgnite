import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initFireEngineRequest: ['data'],
  initFireEngineSuccess: ['payload'],
  initFireEngineFailure: null,
  saveUserList: ['data'],
  saveChannelList: ['data'],
  saveMessageList: ['data'],
  sendMessageRequest: ['data'],
  sendMessageSuccess: ['payload'],
  sendMessageFailure: null,
  readMessageRequest: ['data'],
  readMessageSuccess: ['payload'],
  readMessageFailure: null,
})

export const FireEngineTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  init: { loading: undefined, error: undefined, data: undefined },
  userList: [],
  channelList: [],
  messageList: {},
  sendMessage: { loading: undefined, error: undefined, data: undefined, payload: undefined },
  readMessage: { loading: undefined, error: undefined, data: undefined, payload: undefined},
})

/* ------------- Selectors ------------- */

export const FireEngineSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const initFireEngineRequestSaga = (state, { data }) => {
  return state.merge({ ...state, init: { loading: true, error: false, data } })
}
export const initFireEngineSuccessSaga = (state, { payload }) => {
  return state.merge({ ...state, init: { loading: false, error: false }, currentUser: payload })
}
export const initFireEngineFailureSaga = (state) => {
  return state.merge({ ...state, init: { loading: false, error: true } })
}
export const saveUserList = (state, { data }) => {
  return state.merge({ ...state, userList: data })
}
export const saveMessageList = (state, { data }) => {
  const { channel, messages } = data
  let newMessages = { ...state.messageList }
  if (newMessages[channel.uuid]) {
    newMessages = {
      ...newMessages,
      [channel.uuid]: messages
    }
  } else {
    newMessages = {
      ...newMessages,
      [channel.uuid]: messages
    }
  }
  return state.merge({ ...state, messageList: newMessages })
}
export const saveChannelList = (state, { data }) => {
  return state.merge({ ...state, channelList: data })
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

export const readMessageRequest = (state, { data }) => {
  return state.merge({ ...state, readMessage: { loading: true, error: undefined, data } })
}
export const readMessageSuccess = (state, { payload }) => {
  return state.merge({ ...state, readMessage: { ...state.readMessage, loading: false, error: undefined, payload } })
}
export const readMessageFailure = (state) => {
  return state.merge({ ...state, readMessage: { ...state.readMessage, loading: false, error: true } })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INIT_FIRE_ENGINE_REQUEST]: initFireEngineRequestSaga,
  [Types.INIT_FIRE_ENGINE_SUCCESS]: initFireEngineSuccessSaga,
  [Types.INIT_FIRE_ENGINE_FAILURE]: initFireEngineFailureSaga,
  [Types.SAVE_USER_LIST]: saveUserList,
  [Types.SAVE_MESSAGE_LIST]: saveMessageList,
  [Types.SAVE_CHANNEL_LIST]: saveChannelList,
  [Types.SEND_MESSAGE_REQUEST]: sendMessageRequest,
  [Types.SEND_MESSAGE_SUCCESS]: sendMessageSuccess,
  [Types.SEND_MESSAGE_FAILURE]: sendMessageFailure,
  [Types.READ_MESSAGE_REQUEST]: readMessageRequest,
  [Types.READ_MESSAGE_SUCCESS]: readMessageSuccess,
  [Types.READ_MESSAGE_FAILURE]: readMessageFailure,
})
