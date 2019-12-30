import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { DEFAULT_STATE } from '../Data/Const'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['data'],
  loginSuccess: ['payload'],
  loginFailure: null,
  logoutRequest: ['data'],
  logoutSuccess: ['payload'],
  logoutFailure: null,
  registerRequest: ['data'],
  registerSuccess: ['payload'],
  registerFailure: null,
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  login: DEFAULT_STATE,
  logout: DEFAULT_STATE,
  register: DEFAULT_STATE,
})

/* ------------- Selectors ------------- */

export const AuthSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const loginRequestReducer = (state, { data }) => {
  return state.merge({ ...state, login: { ...state.login, fetching: true, data } })
}
export const loginSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, login: { ...state.login, fetching: false, error: undefined, payload } })
}
export const loginFailureReducer = (state) => {
  return state.merge({ ...state, login: { ...state.login, fetching: false, error: true, payload: undefined } })
}

export const logoutRequestReducer = (state, { data }) => {
  return state.merge({ ...state, logout: { ...state.logout, fetching: true, data } })
}
export const logoutSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, logout: { ...state.logout, fetching: false, error: undefined, payload } })
}
export const logoutFailureReducer = (state) => {
  return state.merge({ ...state, logout: { ...state.logout, fetching: false, error: true, payload: undefined } })
}

export const registerRequestReducer = (state, { data }) => {
  return state.merge({ ...state, register: { ...state.register, fetching: true, data } })
}
export const registerSuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, register: { ...state.register, fetching: false, error: undefined, payload } })
}
export const registerFailureReducer = (state) => {
  return state.merge({ ...state, register: { ...state.register, fetching: false, error: true, payload: undefined } })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: loginRequestReducer,
  [Types.LOGIN_SUCCESS]: loginSuccessReducer,
  [Types.LOGIN_FAILURE]: loginFailureReducer,
  [Types.LOGOUT_REQUEST]: logoutRequestReducer,
  [Types.LOGOUT_SUCCESS]: logoutSuccessReducer,
  [Types.LOGOUT_FAILURE]: logoutFailureReducer,
  [Types.REGISTER_REQUEST]: registerRequestReducer,
  [Types.REGISTER_SUCCESS]: registerSuccessReducer,
  [Types.REGISTER_FAILURE]: registerFailureReducer,
})
