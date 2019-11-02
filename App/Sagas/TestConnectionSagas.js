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
import TestConnectionActions from '../Redux/TestConnectionRedux'
// import { TestConnectionSelectors } from '../Redux/TestConnectionRedux'

export function * test200Saga(api, action) {
  const { data } = action
  const response = yield call(api.test200, data)

  if (response.ok) {
    yield put(TestConnectionActions.test200Success(response.data))
  } else {
    yield put(TestConnectionActions.test200Failure())
  }
}

export function * test400Saga(api, action) {
  const { data } = action
  const response = yield call(api.test400, data)

  if (response.ok) {
    yield put(TestConnectionActions.test400Success(response.data))
  } else {
    yield put(TestConnectionActions.test400Failure())
  }
}

export function * test500Saga(api, action) {
  const { data } = action
  const response = yield call(api.test500, data)

  if (response.ok) {
    yield put(TestConnectionActions.test500Success(response.data))
  } else {
    yield put(TestConnectionActions.test500Failure())
  }
}
