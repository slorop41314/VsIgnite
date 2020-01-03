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

export function* createPubnubUser(action) {
  try {
    const { data } = action
    const response = yield PubnubManager.createUser(data)
    yield put(PubnubActions.createPubnubUserSuccess(response))
  } catch (error) {
    yield put(PubnubActions.createPubnubUserFailure())
  }
}

export function* updatePubnubUser(action) {
  try {
    const { data } = action
    const response = yield PubnubManager.updateUser(data)
    yield put(PubnubActions.updatePubnubUserSuccess(response))
  } catch (error) {
    yield put(PubnubActions.updatePubnubUserFailure())
  }
}

export function* deletePubnubUser(action) {
  try {
    const { data } = action
    const response = yield PubnubManager.deleteUser(data.uid)
    yield put(PubnubActions.deletePubnubUserSuccess(response))
  } catch (error) {
    yield put(PubnubActions.deletePubnubUserFailure())
  }
}

export function* getPubnubUserList(action) {
  try {
    const response = yield PubnubManager.getListUser()
    yield put(PubnubActions.getPubnubUserListSuccess(response.data))
  } catch (error) {
    yield put(PubnubActions.getPubnubUserListFailure())
  }
}

export function* getPubnubUserDetail(action) {
  try {
    const { uid } = action.data
    const response = yield PubnubManager.getUserDetail(uid)
    yield put(PubnubActions.getPubnubUserDetailSuccess(response.data))
  } catch (error) {
    yield put(PubnubActions.getPubnubUserDetailFailure())
  }
}