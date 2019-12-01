import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { mergeAndReplace } from '../Services/firestore-chat-engine/helper'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initFireEngineRequest: ['data'],
  initFireEngineSuccess: ['payload'],
  initFireEngineFailure: null,
  saveUserList: ['data'],
  saveChannelList: ['data'],
  getMessageRequest: ['data'],
  getMessageSuccess: ['payload'],
  getMessageFailure: null,
  updateMessages: ['data'],
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
  getMessage: { loading: undefined, error: undefined, data: undefined, payload: undefined },
  sendMessage: { loading: undefined, error: undefined, data: undefined, payload: undefined },
  readMessage: { loading: undefined, error: undefined, data: undefined, payload: undefined },
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
export const saveChannelList = (state, { data }) => {
  return state.merge({ ...state, channelList: data })
}
export const updateMessages = (state, { data }) => {
  const { channel, message } = data
  let newMessages = { ...state.messageList }
  if (newMessages[channel.uuid]) {
    newMessages = {
      ...newMessages,
      [channel.uuid]: mergeAndReplace(newMessages[channel.uuid], [message], 'uuid', 'timestamp', 'desc', true)
    }
  } else {
    newMessages = {
      ...newMessages,
      [channel.uuid]: mergeAndReplace([], [message], 'uuid', 'timestamp', 'desc', true)
    }
  }
  return state.merge({ ...state, messageList: newMessages })
}

export const getMessageRequest = (state, { data }) => {
  return state.merge({ ...state, getMessage: { ...state.getMessage, loading: true, error: undefined, data } })
}
export const getMessageSuccess = (state, { payload }) => {
  const { channel, messages } = payload
  let newMessages = { ...state.messageList }
  if (newMessages[channel.uuid]) {
    newMessages = {
      ...newMessages,
      [channel.uuid]: mergeAndReplace(newMessages[channel.uuid], messages, 'uuid', 'timestamp', 'desc', true)
    }
  } else {
    newMessages = {
      ...newMessages,
      [channel.uuid]: mergeAndReplace([], messages, 'uuid', 'timestamp', 'desc', true)
    }
  }
  return state.merge({ ...state, getMessage: { ...state.getMessage, loading: false, error: undefined, payload }, messageList: newMessages })
}
export const getMessageFailure = (state) => {
  return state.merge({ ...state, getMessage: { ...state.getMessage, loading: false, error: true } })
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
  [Types.SAVE_CHANNEL_LIST]: saveChannelList,
  [Types.UPDATE_MESSAGES]: updateMessages,
  [Types.GET_MESSAGE_REQUEST]: getMessageRequest,
  [Types.GET_MESSAGE_SUCCESS]: getMessageSuccess,
  [Types.GET_MESSAGE_FAILURE]: getMessageFailure,
  [Types.SEND_MESSAGE_REQUEST]: sendMessageRequest,
  [Types.SEND_MESSAGE_SUCCESS]: sendMessageSuccess,
  [Types.SEND_MESSAGE_FAILURE]: sendMessageFailure,
  [Types.READ_MESSAGE_REQUEST]: readMessageRequest,
  [Types.READ_MESSAGE_SUCCESS]: readMessageSuccess,
  [Types.READ_MESSAGE_FAILURE]: readMessageFailure,
})
