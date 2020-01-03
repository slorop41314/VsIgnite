import { DEFAULT_STATE } from "../../Data/Const"
import { Method } from "react-native-awesome-component"

/** ACTION */
export const PubnubUserActions = {
  createPubnubUserRequest: ['data'],
  createPubnubUserSuccess: ['payload'],
  createPubnubUserFailure: null,

  updatePubnubUserRequest: ['data'],
  updatePubnubUserSuccess: ['payload'],
  updatePubnubUserFailure: null,

  deletePubnubUserRequest: ['data'],
  deletePubnubUserSuccess: ['payload'],
  deletePubnubUserFailure: null,

  getPubnubUserListRequest: ['data'],
  getPubnubUserListSuccess: ['payload'],
  getPubnubUserListFailure: null,

  getPubnubUserDetailRequest: ['data'],
  getPubnubUserDetailSuccess: ['payload'],
  getPubnubUserDetailFailure: null,
}

/** STATE */
export const PubnubUserState = {
  createPubnubUser: DEFAULT_STATE,
  updatePubnubUser: DEFAULT_STATE,
  deletePubnubUser: DEFAULT_STATE,
  getPubnubUserList: DEFAULT_STATE,
  getPubnubUserDetail: DEFAULT_STATE,

  users: []
}

/** REDUCER */
export const createPubnubUserRequestReducer = (state, { data }) => {
  return state.merge({ ...state, createPubnubUser: { ...state.createPubnubUser, fetching: true, data } })
}
export const createPubnubUserSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, createPubnubUser: { ...state.createPubnubUser, fetching: false, error: undefined, payload } })
}
export const createPubnubUserFailureReducer = (state) => {
  return state.merge({ ...state, createPubnubUser: { ...state.createPubnubUser, fetching: false, error: true, payload: undefined } })
}

export const updatePubnubUserRequestReducer = (state, { data }) => {
  return state.merge({ ...state, updatePubnubUser: { ...state.updatePubnubUser, fetching: true, data } })
}
export const updatePubnubUserSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, updatePubnubUser: { ...state.updatePubnubUser, fetching: false, error: undefined, payload } })
}
export const updatePubnubUserFailureReducer = (state) => {
  return state.merge({ ...state, updatePubnubUser: { ...state.updatePubnubUser, fetching: false, error: true, payload: undefined } })
}

export const deletePubnubUserRequestReducer = (state, { data }) => {
  return state.merge({ ...state, deletePubnubUser: { ...state.deletePubnubUser, fetching: true, data } })
}
export const deletePubnubUserSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, deletePubnubUser: { ...state.deletePubnubUser, fetching: false, error: undefined, payload } })
}
export const deletePubnubUserFailureReducer = (state) => {
  return state.merge({ ...state, deletePubnubUser: { ...state.deletePubnubUser, fetching: false, error: true, payload: undefined } })
}

export const getPubnubUserListRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getPubnubUserList: { ...state.getPubnubUserList, fetching: true, data } })
}
export const getPubnubUserListSuccessReducer = (state, { payload }) => {
  let newUsers = [...state.users]
  newUsers = Method.Array.mergeAndReplace(newUsers, payload, 'id', 'fullname', 'asc', false)
  return state.merge({ ...state, getPubnubUserList: { ...state.getPubnubUserList, fetching: false, error: undefined, payload }, users: newUsers })
}
export const getPubnubUserListFailureReducer = (state) => {
  return state.merge({ ...state, getPubnubUserList: { ...state.getPubnubUserList, fetching: false, error: true, payload: undefined } })
}

export const getPubnubUserDetailRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getPubnubUserDetail: { ...state.getPubnubUserDetail, fetching: true, data } })
}
export const getPubnubUserDetailSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getPubnubUserDetail: { ...state.getPubnubUserDetail, fetching: false, error: undefined, payload } })
}
export const getPubnubUserDetailFailureReducer = (state) => {
  return state.merge({ ...state, getPubnubUserDetail: { ...state.getPubnubUserDetail, fetching: false, error: true, payload: undefined } })
}

/** TYPES */
export const PubnubUserTypes = (PubnubTypes) => {
  return {
    [PubnubTypes.CREATE_PUBNUB_USER_REQUEST]: createPubnubUserRequestReducer,
    [PubnubTypes.CREATE_PUBNUB_USER_SUCCESS]: createPubnubUserSuccessReducer,
    [PubnubTypes.CREATE_PUBNUB_USER_FAILURE]: createPubnubUserFailureReducer,

    [PubnubTypes.UPDATE_PUBNUB_USER_REQUEST]: updatePubnubUserRequestReducer,
    [PubnubTypes.UPDATE_PUBNUB_USER_SUCCESS]: updatePubnubUserSuccessReducer,
    [PubnubTypes.UPDATE_PUBNUB_USER_FAILURE]: updatePubnubUserFailureReducer,

    [PubnubTypes.DELETE_PUBNUB_USER_REQUEST]: deletePubnubUserRequestReducer,
    [PubnubTypes.DELETE_PUBNUB_USER_SUCCESS]: deletePubnubUserSuccessReducer,
    [PubnubTypes.DELETE_PUBNUB_USER_FAILURE]: deletePubnubUserFailureReducer,

    [PubnubTypes.GET_PUBNUB_USER_LIST_REQUEST]: getPubnubUserListRequestReducer,
    [PubnubTypes.GET_PUBNUB_USER_LIST_SUCCESS]: getPubnubUserListSuccessReducer,
    [PubnubTypes.GET_PUBNUB_USER_LIST_FAILURE]: getPubnubUserListFailureReducer,

    [PubnubTypes.GET_PUBNUB_USER_DETAIL_REQUEST]: getPubnubUserDetailRequestReducer,
    [PubnubTypes.GET_PUBNUB_USER_DETAIL_SUCCESS]: getPubnubUserDetailSuccessReducer,
    [PubnubTypes.GET_PUBNUB_USER_DETAIL_FAILURE]: getPubnubUserDetailFailureReducer,
  }
}