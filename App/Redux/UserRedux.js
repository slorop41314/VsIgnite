import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { DEFAULT_STATE } from '../Data/Const'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getUserListRequest: ['data'],
  getUserListSuccess: ['payload'],
  getUserListFailure: null,
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  getUserList: DEFAULT_STATE,
})

/* ------------- Selectors ------------- */

export const UserSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const getUserListRequestReducer = (state, { data }) => {
  return state.merge({ ...state, getUserList: { ...state.getUserList, fetching: true, data } })
}
export const getUserListSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, getUserList: { ...state.getUserList, fetching: false, error: undefined, payload } })
}
export const getUserListFailureReducer = (state) => {
  return state.merge({ ...state, getUserList: { ...state.getUserList, fetching: false, error: true, payload: undefined } })
}
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_USER_LIST_REQUEST]: getUserListRequestReducer,
  [Types.GET_USER_LIST_SUCCESS]: getUserListSuccessReducer,
  [Types.GET_USER_LIST_FAILURE]: getUserListFailureReducer,
})
