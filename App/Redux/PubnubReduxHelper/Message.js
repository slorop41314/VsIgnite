import { DEFAULT_STATE } from "../../Data/Const"
import { Method } from "react-native-awesome-component"

/** ACTION */
export const PubnubMessageActions = {
  getPubnubMessageRequest: ['data'],
  getPubnubMessageSuccess: ['payload'],
  getPubnubMessageFailure: null,

  sendPubnubMessageRequest: ['data'],
  sendPubnubMessageSuccess: ['payload'],
  sendPubnubMessageFailure: null,

  sendPubnubTypingRequest: ['data'],
  sendPubnubTypingSuccess: ['payload'],
  sendPubnubTypingFailure: null,

  updatePubnubMessageRequest: ['data'],
  updatePubnubMessageSuccess: ['payload'],
  updatePubnubMessageFailure: null,

  deletePubnubMessageRequest: ['data'],
  deletePubnubMessageSuccess: ['payload'],
  deletePubnubMessageFailure: null,

  getPubnubUnreadCountRequest: ['data'],
  getPubnubUnreadCountSuccess: ['payload'],
  getPubnubUnreadCountFailure: null,

  onReceivePubnubMessage: ['payload']
}

/** STATE */
export const PubnubMessageStore = {
  getPubnubMessage: DEFAULT_STATE,
  sendPubnubMessage: DEFAULT_STATE,
  sendPubnubTyping: DEFAULT_STATE,
  updatePubnubMessage: DEFAULT_STATE,
  deletePubnubMessage: DEFAULT_STATE,
  getPubnubUnreadCount: DEFAULT_STATE,

  messages: {}
}

/** REDUCER */
export const getPubnubMessageRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getPubnubMessage: { ...state.getPubnubMessage, fetching: true, data } })
}
export const getPubnubMessageSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getPubnubMessage: { ...state.getPubnubMessage, fetching: false, error: undefined, payload } })
}
export const getPubnubMessageFailureReducer = (state) => {
  return state.merge({ ...state, getPubnubMessage: { ...state.getPubnubMessage, fetching: false, error: true, payload: undefined } })
}

export const sendPubnubMessageRequestReducer = (state, { data }) => {
  return state.merge({ ...state, sendPubnubMessage: { ...state.sendPubnubMessage, fetching: true, data } })
}
export const sendPubnubMessageSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, sendPubnubMessage: { ...state.sendPubnubMessage, fetching: false, error: undefined, payload } })
}
export const sendPubnubMessageFailureReducer = (state) => {
  return state.merge({ ...state, sendPubnubMessage: { ...state.sendPubnubMessage, fetching: false, error: true, payload: undefined } })
}

export const sendPubnubTypingRequestReducer = (state, { data }) => {
  return state.merge({ ...state, sendPubnubTyping: { ...state.sendPubnubTyping, fetching: true, data } })
}
export const sendPubnubTypingSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, sendPubnubTyping: { ...state.sendPubnubTyping, fetching: false, error: undefined, payload } })
}
export const sendPubnubTypingFailureReducer = (state) => {
  return state.merge({ ...state, sendPubnubTyping: { ...state.sendPubnubTyping, fetching: false, error: true, payload: undefined } })
}

export const updatePubnubMessageRequestReducer = (state, { data }) => {
  return state.merge({ ...state, updatePubnubMessage: { ...state.updatePubnubMessage, fetching: true, data } })
}
export const updatePubnubMessageSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, updatePubnubMessage: { ...state.updatePubnubMessage, fetching: false, error: undefined, payload } })
}
export const updatePubnubMessageFailureReducer = (state) => {
  return state.merge({ ...state, updatePubnubMessage: { ...state.updatePubnubMessage, fetching: false, error: true, payload: undefined } })
}

export const deletePubnubMessageRequestReducer = (state, { data }) => {
  return state.merge({ ...state, deletePubnubMessage: { ...state.deletePubnubMessage, fetching: true, data } })
}
export const deletePubnubMessageSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, deletePubnubMessage: { ...state.deletePubnubMessage, fetching: false, error: undefined, payload } })
}
export const deletePubnubMessageFailureReducer = (state) => {
  return state.merge({ ...state, deletePubnubMessage: { ...state.deletePubnubMessage, fetching: false, error: true, payload: undefined } })
}

export const getPubnubUnreadCountRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getPubnubUnreadCount: { ...state.getPubnubUnreadCount, fetching: true, data } })
}
export const getPubnubUnreadCountSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getPubnubUnreadCount: { ...state.getPubnubUnreadCount, fetching: false, error: undefined, payload } })
}
export const getPubnubUnreadCountFailureReducer = (state) => {
  return state.merge({ ...state, getPubnubUnreadCount: { ...state.getPubnubUnreadCount, fetching: false, error: true, payload: undefined } })
}

/** TYPES */
export const PubnubMessageTypes = (PubnubTypes) => {
  return {
    [PubnubTypes.GET_PUBNUB_MESSAGE_REQUEST]: getPubnubMessageRequestReducer,
    [PubnubTypes.GET_PUBNUB_MESSAGE_SUCCESS]: getPubnubMessageSuccessReducer,
    [PubnubTypes.GET_PUBNUB_MESSAGE_FAILURE]: getPubnubMessageFailureReducer,

    [PubnubTypes.SEND_PUBNUB_MESSAGE_REQUEST]: sendPubnubMessageRequestReducer,
    [PubnubTypes.SEND_PUBNUB_MESSAGE_SUCCESS]: sendPubnubMessageSuccessReducer,
    [PubnubTypes.SEND_PUBNUB_MESSAGE_FAILURE]: sendPubnubMessageFailureReducer,

    [PubnubTypes.SEND_PUBNUB_TYPING_REQUEST]: sendPubnubTypingRequestReducer,
    [PubnubTypes.SEND_PUBNUB_TYPING_SUCCESS]: sendPubnubTypingSuccessReducer,
    [PubnubTypes.SEND_PUBNUB_TYPING_FAILURE]: sendPubnubTypingFailureReducer,

    [PubnubTypes.UPDATE_PUBNUB_MESSAGE_REQUEST]: updatePubnubMessageRequestReducer,
    [PubnubTypes.UPDATE_PUBNUB_MESSAGE_SUCCESS]: updatePubnubMessageSuccessReducer,
    [PubnubTypes.UPDATE_PUBNUB_MESSAGE_FAILURE]: updatePubnubMessageFailureReducer,

    [PubnubTypes.DELETE_PUBNUB_MESSAGE_REQUEST]: deletePubnubMessageRequestReducer,
    [PubnubTypes.DELETE_PUBNUB_MESSAGE_SUCCESS]: deletePubnubMessageSuccessReducer,
    [PubnubTypes.DELETE_PUBNUB_MESSAGE_FAILURE]: deletePubnubMessageFailureReducer,

    [PubnubTypes.GET_PUBNUB_UNREAD_COUNT_REQUEST]: getPubnubUnreadCountRequestReducer,
    [PubnubTypes.GET_PUBNUB_UNREAD_COUNT_SUCCESS]: getPubnubUnreadCountSuccessReducer,
    [PubnubTypes.GET_PUBNUB_UNREAD_COUNT_FAILURE]: getPubnubUnreadCountFailureReducer,
  }
}

