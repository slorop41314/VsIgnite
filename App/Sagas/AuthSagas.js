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
import FireStoreManager from '../FireStore/FireStoreManager'
import PubnubManager from '../Pubnub/PubnubManager'
import PubnubActions from '../Redux/PubnubRedux'

export function* loginSaga(action) {
  const { data } = action
  const { email, password } = data

  try {
    const response = yield firebase.auth().signInWithEmailAndPassword(email, password)
    yield put(AuthActions.loginSuccess(response))
  } catch (error) {
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

export function* registerSaga(action) {
  const { data } = action
  const { email, password, name, photoUrl } = data

  try {
    const response = yield firebase.auth().createUserWithEmailAndPassword(email, password)
    yield response.user.updateProfile({ displayName: name, photoURL: photoUrl })
    const user = yield firebase.auth().currentUser
    yield all(
      put(PubnubActions.createPubnubUserRequest({ id: user.uid, name: user.displayName, profileUrl: user.photoURL, email: user.email })),
      put(AuthActions.registerSuccess(response))
    )
  } catch (error) {
    yield put(AuthActions.registerFailure())
  }
}
