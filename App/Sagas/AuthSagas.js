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

import { call, put, all } from 'redux-saga/effects'
import AuthActions from '../Redux/AuthRedux'
import SessionActions from '../Redux/SessionRedux'
import firebase from 'react-native-firebase'
// import { AuthSelectors } from '../Redux/AuthRedux'

export function* loginSaga(action) {
  const { data } = action
  const { email, password } = data

  try {
    const response = yield firebase.auth().signInWithEmailAndPassword(email, password)
    yield all([
      put(SessionActions.setLogin(response.user)),
      put(AuthActions.loginSuccess(response))
    ])
  } catch (error) {
    console.tron.error({ error })
    yield put(AuthActions.loginFailure())
  }
}

export function* logoutSaga() {
  try {
    yield response = yield firebase.auth().signOut()
    yield all([
      put(SessionActions.setLogout()),
      put(AuthActions.logoutSuccess(response))
    ])
  } catch (error) {
    yield put(AuthActions.logoutFailure())
  }
}
