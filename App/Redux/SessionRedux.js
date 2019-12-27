import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setLogin: ['data'],
  setLogout: null
})

export const SessionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  currentUser: undefined
})

/* ------------- Selectors ------------- */

export const SessionSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const setLoginReducer = (state, { data }) => {
  return state.merge({ ...state, currentUser: data })
}
export const setLogoutReducer = (state) => {
  return state.merge(INITIAL_STATE)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_LOGIN]: setLoginReducer,
  [Types.SET_LOGOUT]: setLogoutReducer,
})
