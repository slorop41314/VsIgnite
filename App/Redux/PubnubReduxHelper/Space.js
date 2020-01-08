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

  // manage member
  joinPubnubSpaceRequest: ['data'],
  joinPubnubSpaceSuccess: ['payload'],
  joinPubnubSpaceFailure: null,

  leavePubnubSpaceRequest: ['data'],
  leavePubnubSpaceSuccess: ['payload'],
  leavePubnubSpaceFailure: null,

  getPubnubSpaceMembershipRequest: ['data'],
  getPubnubSpaceMembershipSuccess: ['payload'],
  getPubnubSpaceMembershipFailure: null,

  updatePubnubSpaceMembershipRequest: ['data'],
  updatePubnubSpaceMembershipSuccess: ['payload'],
  updatePubnubSpaceMembershipFailure: null,

  getPubnubSpaceMemberRequest: ['data'],
  getPubnubSpaceMemberSuccess: ['payload'],
  getPubnubSpaceMemberFailure: null,

  addPubnubSpaceMemberRequest: ['data'],
  addPubnubSpaceMemberSuccess: ['payload'],
  addPubnubSpaceMemberFailure: null,

  removePubnubSpaceMemberRequest: ['data'],
  removePubnubSpaceMemberSuccess: ['payload'],
  removePubnubSpaceMemberFailure: null,
}

/** STATE */
export const PubnubSpaceStore = {
  createPubnubSpace: DEFAULT_STATE,
  getPubnubSpace: DEFAULT_STATE,
  getAllPubnubSpace: DEFAULT_STATE,
  updatePubnubSpace: DEFAULT_STATE,
  deletePubnubSpace: DEFAULT_STATE,

  spaces: {},

  // manage member
  joinPubnubSpace: DEFAULT_STATE,
  leavePubnubSpace: DEFAULT_STATE,
  getPubnubSpaceMembership: DEFAULT_STATE,
  updatePubnubSpaceMembership: DEFAULT_STATE,
  getPubnubSpaceMember: DEFAULT_STATE,
  addPubnubSpaceMember: DEFAULT_STATE,
  removePubnubSpaceMember: DEFAULT_STATE,
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
  let spaces = { ...state.spaces }
  const { data } = payload
  for (let i = 0; i < data.length; i++) {
    spaces = {
      ...spaces,
      [data[i].id]: data[i]
    }
  }
  return state.merge({ ...state, getAllPubnubSpace: { ...state.getAllPubnubSpace, fetching: false, error: undefined, payload }, spaces })
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

export const joinPubnubSpaceRequestReducer = (state, { data }) => {
  return state.merge({ ...state, joinPubnubSpace: { ...state.joinPubnubSpace, fetching: true, data } })
}
export const joinPubnubSpaceSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, joinPubnubSpace: { ...state.joinPubnubSpace, fetching: false, error: undefined, payload } })
}
export const joinPubnubSpaceFailureReducer = (state) => {
  return state.merge({ ...state, joinPubnubSpace: { ...state.joinPubnubSpace, fetching: false, error: true, payload: undefined } })
}

export const leavePubnubSpaceRequestReducer = (state, { data }) => {
  return state.merge({ ...state, leavePubnubSpace: { ...state.leavePubnubSpace, fetching: true, data } })
}
export const leavePubnubSpaceSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, leavePubnubSpace: { ...state.leavePubnubSpace, fetching: false, error: undefined, payload } })
}
export const leavePubnubSpaceFailureReducer = (state) => {
  return state.merge({ ...state, leavePubnubSpace: { ...state.leavePubnubSpace, fetching: false, error: true, payload: undefined } })
}

export const getPubnubSpaceMembershipRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getPubnubSpaceMembership: { ...state.getPubnubSpaceMembership, fetching: true, data } })
}
export const getPubnubSpaceMembershipSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getPubnubSpaceMembership: { ...state.getPubnubSpaceMembership, fetching: false, error: undefined, payload } })
}
export const getPubnubSpaceMembershipFailureReducer = (state) => {
  return state.merge({ ...state, getPubnubSpaceMembership: { ...state.getPubnubSpaceMembership, fetching: false, error: true, payload: undefined } })
}

export const updatePubnubSpaceMembershipRequestReducer = (state, { data }) => {
  return state.merge({ ...state, updatePubnubSpaceMembership: { ...state.updatePubnubSpaceMembership, fetching: true, data } })
}
export const updatePubnubSpaceMembershipSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, updatePubnubSpaceMembership: { ...state.updatePubnubSpaceMembership, fetching: false, error: undefined, payload } })
}
export const updatePubnubSpaceMembershipFailureReducer = (state) => {
  return state.merge({ ...state, updatePubnubSpaceMembership: { ...state.updatePubnubSpaceMembership, fetching: false, error: true, payload: undefined } })
}

export const getPubnubSpaceMemberRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getPubnubSpaceMember: { ...state.getPubnubSpaceMember, fetching: true, data } })
}
export const getPubnubSpaceMemberSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getPubnubSpaceMember: { ...state.getPubnubSpaceMember, fetching: false, error: undefined, payload } })
}
export const getPubnubSpaceMemberFailureReducer = (state) => {
  return state.merge({ ...state, getPubnubSpaceMember: { ...state.getPubnubSpaceMember, fetching: false, error: true, payload: undefined } })
}

export const addPubnubSpaceMemberRequestReducer = (state, { data }) => {
  return state.merge({ ...state, addPubnubSpaceMember: { ...state.addPubnubSpaceMember, fetching: true, data } })
}
export const addPubnubSpaceMemberSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, addPubnubSpaceMember: { ...state.addPubnubSpaceMember, fetching: false, error: undefined, payload } })
}
export const addPubnubSpaceMemberFailureReducer = (state) => {
  return state.merge({ ...state, addPubnubSpaceMember: { ...state.addPubnubSpaceMember, fetching: false, error: true, payload: undefined } })
}

export const removePubnubSpaceMemberRequestReducer = (state, { data }) => {
  return state.merge({ ...state, removePubnubSpaceMember: { ...state.removePubnubSpaceMember, fetching: true, data } })
}
export const removePubnubSpaceMemberSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, removePubnubSpaceMember: { ...state.removePubnubSpaceMember, fetching: false, error: undefined, payload } })
}
export const removePubnubSpaceMemberFailureReducer = (state) => {
  return state.merge({ ...state, removePubnubSpaceMember: { ...state.removePubnubSpaceMember, fetching: false, error: true, payload: undefined } })
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

    [PubnubTypes.JOIN_PUBNUB_SPACE_REQUEST]: joinPubnubSpaceRequestReducer,
    [PubnubTypes.JOIN_PUBNUB_SPACE_SUCCESS]: joinPubnubSpaceSuccessReducer,
    [PubnubTypes.JOIN_PUBNUB_SPACE_FAILURE]: joinPubnubSpaceFailureReducer,

    [PubnubTypes.LEAVE_PUBNUB_SPACE_REQUEST]: leavePubnubSpaceRequestReducer,
    [PubnubTypes.LEAVE_PUBNUB_SPACE_SUCCESS]: leavePubnubSpaceSuccessReducer,
    [PubnubTypes.LEAVE_PUBNUB_SPACE_FAILURE]: leavePubnubSpaceFailureReducer,

    [PubnubTypes.GET_PUBNUB_SPACE_MEMBERSHIP_REQUEST]: getPubnubSpaceMembershipRequestReducer,
    [PubnubTypes.GET_PUBNUB_SPACE_MEMBERSHIP_SUCCESS]: getPubnubSpaceMembershipSuccessReducer,
    [PubnubTypes.GET_PUBNUB_SPACE_MEMBERSHIP_FAILURE]: getPubnubSpaceMembershipFailureReducer,

    [PubnubTypes.UPDATE_PUBNUB_SPACE_MEMBERSHIP_REQUEST]: updatePubnubSpaceMembershipRequestReducer,
    [PubnubTypes.UPDATE_PUBNUB_SPACE_MEMBERSHIP_SUCCESS]: updatePubnubSpaceMembershipSuccessReducer,
    [PubnubTypes.UPDATE_PUBNUB_SPACE_MEMBERSHIP_FAILURE]: updatePubnubSpaceMembershipFailureReducer,

    [PubnubTypes.GET_PUBNUB_SPACE_MEMBER_REQUEST]: getPubnubSpaceMemberRequestReducer,
    [PubnubTypes.GET_PUBNUB_SPACE_MEMBER_SUCCESS]: getPubnubSpaceMemberSuccessReducer,
    [PubnubTypes.GET_PUBNUB_SPACE_MEMBER_FAILURE]: getPubnubSpaceMemberFailureReducer,

    [PubnubTypes.ADD_PUBNUB_SPACE_MEMBER_REQUEST]: addPubnubSpaceMemberRequestReducer,
    [PubnubTypes.ADD_PUBNUB_SPACE_MEMBER_SUCCESS]: addPubnubSpaceMemberSuccessReducer,
    [PubnubTypes.ADD_PUBNUB_SPACE_MEMBER_FAILURE]: addPubnubSpaceMemberFailureReducer,

    [PubnubTypes.REMOVE_PUBNUB_SPACE_MEMBER_REQUEST]: removePubnubSpaceMemberRequestReducer,
    [PubnubTypes.REMOVE_PUBNUB_SPACE_MEMBER_SUCCESS]: removePubnubSpaceMemberSuccessReducer,
    [PubnubTypes.REMOVE_PUBNUB_SPACE_MEMBER_FAILURE]: removePubnubSpaceMemberFailureReducer,
  }
}

