import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { DEFAULT_REDUCER_STATE } from '../Data/Const'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  test200Request: ['data'],
  test200Success: ['payload'],
  test200Failure: null,
  test400Request: ['data'],
  test400Success: ['payload'],
  test400Failure: null,
  test500Request: ['data'],
  test500Success: ['payload'],
  test500Failure: null,
})

export const TestConnectionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  test200: DEFAULT_REDUCER_STATE,
  test400: DEFAULT_REDUCER_STATE,
  test500: DEFAULT_REDUCER_STATE,
})

/* ------------- Selectors ------------- */

export const TestConnectionSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const test200RequestReducer = (state, { data }) => {
  return state.merge({ ...state, test200: { fetching: true, data, payload: null } })
}
export const test200SuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, test200: { fetching: false, error: null, payload } })
}
export const test200FailureReducer = state => {
  return state.merge({ ...state, test200: { fetching: false, error: true, payload: null } })
}

export const test400RequestReducer = (state, { data }) => {
  return state.merge({ ...state, test400: { fetching: true, data, payload: null } })
}
export const test400SuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, test400: { fetching: false, error: null, payload } })
}
export const test400FailureReducer = state => {
  return state.merge({ ...state, test400: { fetching: false, error: true, payload: null } })
}

export const test500RequestReducer = (state, { data }) => {
  return state.merge({ ...state, test500: { fetching: true, data, payload: null } })
}
export const test500SuccessReducer = (state, { payload }) => {
  return state.merge({ ...state, test500: { fetching: false, error: null, payload } })
}
export const test500FailureReducer = state => {
  return state.merge({ ...state, test500: { fetching: false, error: true, payload: null } })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TEST200_REQUEST]: test200RequestReducer,
  [Types.TEST200_SUCCESS]: test200SuccessReducer,
  [Types.TEST200_FAILURE]: test200FailureReducer,
  [Types.TEST400_REQUEST]: test400RequestReducer,
  [Types.TEST400_SUCCESS]: test400SuccessReducer,
  [Types.TEST400_FAILURE]: test400FailureReducer,
  [Types.TEST500_REQUEST]: test500RequestReducer,
  [Types.TEST500_SUCCESS]: test500SuccessReducer,
  [Types.TEST500_FAILURE]: test500FailureReducer,
})
