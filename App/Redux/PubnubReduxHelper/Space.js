import { DEFAULT_STATE } from "../../Data/Const"
import { Method } from "react-native-awesome-component"

/** ACTION */
export const PubnubSpaceActions = {
  createPubnubSpaceRequest: ['data'],
  createPubnubSpaceSuccess: ['payload'],
  createPubnubSpaceFailure: null,

  getPubnubSpaceRequest: ['data'],
  getPubnubSpaceSuccess: ['payload'],
  getPubnubSpaceFailure: null,

  getAllPubnubSpaceRequest: ['data'],
  getAllPubnubSpaceSuccess: ['payload'],
  getAllPubnubSpaceFailure: null,

  updatePubnubSpaceRequest: ['data'],
  updatePubnubSpaceSuccess: ['payload'],
  updatePubnubSpaceFailure: null,

  deletePubnubSpaceRequest: ['data'],
  deletePubnubSpaceSuccess: ['payload'],
  deletePubnubSpaceFailure: null,
}

/** STATE */
export const PubnubSpaceStore = {
  createPubnubSpace: DEFAULT_STATE,
  getPubnubSpace: DEFAULT_STATE,
  getAllPubnubSpace: DEFAULT_STATE,
  updatePubnubSpace: DEFAULT_STATE,
  deletePubnubSpace: DEFAULT_STATE,

  spaces: {}
}

/** REDUCER */
export const createPubnubSpaceRequestReducer = (state, { data }) => {
  return state.merge({ ...state, createPubnubSpace: { ...state.createPubnubSpace, fetching: true, data } })
}
export const createPubnubSpaceSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, createPubnubSpace: { ...state.createPubnubSpace, fetching: false, error: undefined, payload } })
}
export const createPubnubSpaceFailureReducer = (state) => {
  return state.merge({ ...state, createPubnubSpace: { ...state.createPubnubSpace, fetching: false, error: true, payload: undefined } })
}

export const getPubnubSpaceRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getPubnubSpace: { ...state.getPubnubSpace, fetching: true, data } })
}
export const getPubnubSpaceSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getPubnubSpace: { ...state.getPubnubSpace, fetching: false, error: undefined, payload } })
}
export const getPubnubSpaceFailureReducer = (state) => {
  return state.merge({ ...state, getPubnubSpace: { ...state.getPubnubSpace, fetching: false, error: true, payload: undefined } })
}

export const getAllPubnubSpaceRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getAllPubnubSpace: { ...state.getAllPubnubSpace, fetching: true, data } })
}
export const getAllPubnubSpaceSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getAllPubnubSpace: { ...state.getAllPubnubSpace, fetching: false, error: undefined, payload } })
}
export const getAllPubnubSpaceFailureReducer = (state) => {
  return state.merge({ ...state, getAllPubnubSpace: { ...state.getAllPubnubSpace, fetching: false, error: true, payload: undefined } })
}

export const deletePubnubSpaceRequestReducer = (state, { data }) => {
  return state.merge({ ...state, deletePubnubSpace: { ...state.deletePubnubSpace, fetching: true, data } })
}
export const deletePubnubSpaceSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, deletePubnubSpace: { ...state.deletePubnubSpace, fetching: false, error: undefined, payload } })
}
export const deletePubnubSpaceFailureReducer = (state) => {
  return state.merge({ ...state, deletePubnubSpace: { ...state.deletePubnubSpace, fetching: false, error: true, payload: undefined } })
}

export const updatePubnubSpaceRequestReducer = (state, { data }) => {
  return state.merge({ ...state, updatePubnubSpace: { ...state.updatePubnubSpace, fetching: true, data } })
}
export const updatePubnubSpaceSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, updatePubnubSpace: { ...state.updatePubnubSpace, fetching: false, error: undefined, payload } })
}
export const updatePubnubSpaceFailureReducer = (state) => {
  return state.merge({ ...state, updatePubnubSpace: { ...state.updatePubnubSpace, fetching: false, error: true, payload: undefined } })
}

/** TYPES */
export const PubnubSpaceTypes = (PubnubTypes) => {
  return {
    [PubnubTypes.CREATE_PUBNUB_SPACE_REQUEST]: createPubnubSpaceRequestReducer,
    [PubnubTypes.CREATE_PUBNUB_SPACE_SUCCESS]: createPubnubSpaceSuccessReducer,
    [PubnubTypes.CREATE_PUBNUB_SPACE_FAILURE]: createPubnubSpaceFailureReducer,

    [PubnubTypes.GET_PUBNUB_SPACE_REQUEST]: getPubnubSpaceRequestReducer,
    [PubnubTypes.GET_PUBNUB_SPACE_SUCCESS]: getPubnubSpaceSuccessReducer,
    [PubnubTypes.GET_PUBNUB_SPACE_FAILURE]: getPubnubSpaceFailureReducer,

    [PubnubTypes.GET_ALL_PUBNUB_SPACE_REQUEST]: getAllPubnubSpaceRequestReducer,
    [PubnubTypes.GET_ALL_PUBNUB_SPACE_SUCCESS]: getAllPubnubSpaceSuccessReducer,
    [PubnubTypes.GET_ALL_PUBNUB_SPACE_FAILURE]: getAllPubnubSpaceFailureReducer,

    [PubnubTypes.UPDATE_PUBNUB_SPACE_REQUEST]: updatePubnubSpaceRequestReducer,
    [PubnubTypes.UPDATE_PUBNUB_SPACE_SUCCESS]: updatePubnubSpaceSuccessReducer,
    [PubnubTypes.UPDATE_PUBNUB_SPACE_FAILURE]: updatePubnubSpaceFailureReducer,

    [PubnubTypes.DELETE_PUBNUB_SPACE_REQUEST]: deletePubnubSpaceRequestReducer,
    [PubnubTypes.DELETE_PUBNUB_SPACE_SUCCESS]: deletePubnubSpaceSuccessReducer,
    [PubnubTypes.DELETE_PUBNUB_SPACE_FAILURE]: deletePubnubSpaceFailureReducer,
  }
}

