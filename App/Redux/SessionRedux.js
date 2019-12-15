import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setLogin: ['data'],
  logoutRequest: null,
  logoutSuccess: null,
  logoutFailure: null
})

export const SessionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isLogin: false,
  user: undefined,
})

/* ------------- Selectors ------------- */

export const SessionSelectors = {
  getLoginStatus: state => state.session.isLogin,
  getUser: state => state.session.user,
}

/* ------------- Reducers ------------- */

export const setLoginReducer = (state, { data }) => {
  const { user } = data
  return state.merge({ ...state, isLogin: true, user, })
}
export const logoutRequestReducer = (state) => {
  return state.merge({ ...state })
}
export const logoutSuccessReducer = (state) => {
  return state.merge({ ...INITIAL_STATE })
}
export const logoutFailureReducer = (state) => {
  return state.merge({ ...state })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_LOGIN]: setLoginReducer,
  [Types.LOGOUT_REQUEST]: logoutRequestReducer,
  [Types.LOGOUT_SUCCESS]: logoutSuccessReducer,
  [Types.LOGOUT_FAILURE]: logoutFailureReducer,
})
