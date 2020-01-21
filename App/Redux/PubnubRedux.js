import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { PubnubUserActions, PubnubUserState, PubnubUserTypes } from './PubnubReduxHelper/User'
import { PubnubMessageActions, PubnubMessageStore, PubnubMessageTypes } from './PubnubReduxHelper/Message'
import { PubnubSpaceActions, PubnubSpaceStore, PubnubSpaceTypes } from './PubnubReduxHelper/Space'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  reconnectPubnub: null,

  // USER ACTION
  ...PubnubUserActions,

  // MESSAGE ACTION
  ...PubnubMessageActions,

  // SPACE ACTION
  ...PubnubSpaceActions,
})

export const PubnubTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  ...PubnubUserState,
  ...PubnubMessageStore,
  ...PubnubSpaceStore,
})

/* ------------- Selectors ------------- */

export const PubnubSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
// check Pubnub Redux Helper

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  ...PubnubUserTypes(Types),
  ...PubnubMessageTypes(Types),
  ...PubnubSpaceTypes(Types),
})
