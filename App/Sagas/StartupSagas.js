import { put, select, cancelled, call, take, fork, all, cancel } from 'redux-saga/effects'
import GithubActions, { GithubSelectors } from '../Redux/GithubRedux'
import { is } from 'ramda'
import firebase from 'react-native-firebase'
import NavigationService from '../Services/NavigationServices'
import SessionActions from '../Redux/SessionRedux'
import { eventChannel } from 'redux-saga';
import { FirebaseStrings } from '../Data/Const'
import PubnubActions from '../Redux/PubnubRedux'
import PubnubStoreActions from '../Redux/PubnubStoreRedux'
import { initPubnub } from './PubnubSagas'
import { AuthTypes } from '../Redux/AuthRedux'
import { PubnubStoreTypes } from '../Redux/PubnubStoreRedux'
import { getSagasManager } from '.'

// exported to make available for tests
export const selectAvatar = GithubSelectors.selectAvatar

// process STARTUP actions
export function setStatupAuthStateHelper() {
  return eventChannel(emit => {
    const hasUserCallback = (payload) => {
      emit({ type: FirebaseStrings.hasUser, payload })
    }

    const noUserCallback = () => {
      emit({ type: FirebaseStrings.nouser })
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        hasUserCallback(user)
      } else {
        noUserCallback()
      }
    })

    const unsubscribe = () => {
      // unsubscribe
    };

    return unsubscribe;
  });
}

export function* startup(action) {
  const firebaseAuthStateEvent = yield call(setStatupAuthStateHelper);
  try {
    while (true) {
      try {
        // An error from socketChannel will cause the saga jump to the catch block
        const eventPayload = yield take(firebaseAuthStateEvent);
        const { type, payload } = eventPayload;
        switch (type) {
          case FirebaseStrings.hasUser: {
            const { uid, displayName, photoURL, email } = payload
            const currentUser = { uid, displayName, photoURL, email }
            const pubnubInit = yield fork(initPubnub, currentUser)
            yield put(SessionActions.setLogin(currentUser))

            yield take(PubnubStoreTypes.SAVE_USER)
            NavigationService.navigate('Main')

            yield take(AuthTypes.LOGOUT_REQUEST)
            yield cancel(pubnubInit)
            break;
          }
          case FirebaseStrings.nouser: {
            NavigationService.navigate('Auth')
            yield put(PubnubStoreActions.resetStore())
            break;
          }
        }
      } catch (error) {
        console.tron.log('FIREBASE AUTH EVENT ERROR', error);
      }
    }
  } finally {
    if (yield cancelled()) {
      console.tron.error('FIREBASE AUTH EVENT CANCELED');
    }
  }
}
