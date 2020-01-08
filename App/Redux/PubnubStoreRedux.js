import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { keys } from 'ramda'
import { convertArrToObj } from '../Pubnub/PubnubHelper'
import R from 'ramda'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  saveSpaces: ['data'],
  saveMessages: ['data'],
})

export const PubnubStoreTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  spaces: {}
})

/* ------------- Selectors ------------- */

export const PubnubStoreSelectors = {
  getData: state => state.data,
  getSingleSpaceByUserId: ({ pubnubStore }, id) => {
    const { spaces } = pubnubStore
    const single = R.values(spaces).filter(space => (space.id.includes('single-') && (space.custom[id] !== undefined)))
    if (single.length > 0) {
      return single[0]
    } else {
      return undefined
    }
  }
}

/* ------------- Reducers ------------- */

// request the data from an api
export const saveSpacesReducer = (state, { data }) => {
  let spaces = { ...state.spaces }
  for (let i = 0; i < data.length; i++) {
    if (spaces[data[i].id]) {
      spaces = {
        ...spaces,
        [data[i].id]: {
          ...data[i]
        }
      }
    } else {
      spaces = {
        ...spaces,
        [data[i].id]: {
          ...data[i],
          messages: {},
          lastReadMessageTimetoken: null
        }
      }
    }
  }
  return state.merge({ ...state, spaces })
}

export const saveMessagesReducer = (state, { data }) => {
  let spaces = { ...state.spaces }
  const channelsIds = keys(data)
  for (let i = 0; i < channelsIds.length; i++) {
    if (spaces[channelsIds[i]]) {
      spaces = {
        ...spaces,
        [channelsIds[i]]: {
          ...spaces[channelsIds[i]],
          messages: {
            ...spaces[channelsIds[i]].messages,
            ...convertArrToObj(data[channelsIds[i]], 'timetoken')
          }
        }
      }
    }
  }
  return state.merge({ ...state, spaces })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SAVE_SPACES]: saveSpacesReducer,
  [Types.SAVE_MESSAGES]: saveMessagesReducer
})
