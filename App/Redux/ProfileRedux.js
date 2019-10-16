import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { DEFAULT_INITIAL_STATE } from './Helper'
import { Method } from 'react-native-awesome-component'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getProfileListRequest: ['data'],
  getProfileListSuccess: ['payload'],
  getProfileListFailure: null,
})

export const ProfileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  getProfileList: DEFAULT_INITIAL_STATE,
  profileList: [],
})

/* ------------- Selectors ------------- */

export const ProfileSelectors = {
}

/* ------------- Reducers ------------- */

export const getProfileListRequestReducer = (state, { data }) => {
  return state.merge({ getProfileList: { ...state.getProfileList, fetching: true, data } })
}
export const getProfileListSuccessReducer = (state, { payload }) => {
  const { data } = payload
  let { profileList } = state
  profileList = Method.Array.mergeAndReplace(profileList, data)
  return state.merge({ profileList, getProfileList: { ...state.getProfileList, fetching: false, error: null, payload } })
}
export const getProfileListFailureReducer = (state) => {
  return state.merge({ getProfileList: { ...state.getProfileList, fetching: false, error: true } })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PROFILE_LIST_REQUEST]: getProfileListRequestReducer,
  [Types.GET_PROFILE_LIST_SUCCESS]: getProfileListSuccessReducer,
  [Types.GET_PROFILE_LIST_FAILURE]: getProfileListFailureReducer,
})
