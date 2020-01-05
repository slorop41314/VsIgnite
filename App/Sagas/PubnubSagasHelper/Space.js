/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put } from 'redux-saga/effects'
import PubnubActions from '../../Redux/PubnubRedux'
import PubnubManager from '../../Pubnub/PubnubManager'
// import { PubnubSelectors } from '../Redux/PubnubRedux'

export function* createPubnubSpace(action) {
  try {
    const { uid, name } = action.data
    const response = yield PubnubManager.createSpace(uid, name)
    yield put(PubnubActions.createSPubnubpaceSuccess(response))
  } catch (error) {
    yield put(PubnubActions.createPubnubSpaceFailure())
  }
}

export function* getPubnubSpace(action) {
  try {
    const { uid } = action.data
    const response = yield PubnubManager.getSpace(uid)
    yield put(PubnubActions.getPubnubSpaceSuccess(response))
  } catch (error) {
    yield put(PubnubActions.getPubnubSpaceFailure())
  }
}

export function* getAllPubnubSpace(action) {
  try {
    const { limit, start, end } = action.data
    const response = yield PubnubManager.getAllSpaces(limit, start, end)
    yield put(PubnubActions.getAllPubnubSpaceSuccess(response))
  } catch (error) {
    yield put(PubnubActions.getAllPubnubSpaceFailure())
  }
}

export function* updatePubnubSpace(action) {
  try {
    const { uid, name } = action.data
    const response = yield PubnubManager.updateSpace(uid, name)
    yield put(PubnubActions.updatePubnubSpaceSucccess(response))
  } catch (error) {
    yield put(PubnubActions.updatePubnubSpaceFailure())
  }
}

export function* deletePubnubSpace(action) {
  try {
    const { uid } = action.data
    const response = yield PubnubManager.deleteSpace(uid)
    yield put(PubnubActions.deletePubnubSpaceSuccess(response))
  } catch (error) {
    yield put(PubnubActions.deletePubnubSpaceFailure())
  }
}