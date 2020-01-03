import { put, select, cancelled, call, take, fork, all } from 'redux-saga/effects'
import GithubActions, { GithubSelectors } from '../Redux/GithubRedux'
import { is } from 'ramda'
import firebase from 'react-native-firebase'
import NavigationService from '../Services/NavigationServices'
import SessionActions from '../Redux/SessionRedux'
import { eventChannel } from 'redux-saga';
import { FirebaseStrings } from '../Data/Const'
import PubnubActions from '../Redux/PubnubRedux'
import { initPubnub } from './PubnubSagas'

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
            NavigationService.navigate('Main')
            const { uid, displayName, photoURL, email } = payload
            const currentUser = { uid, displayName, photoURL, email }
            yield all([
              fork(initPubnub, currentUser),
              put(SessionActions.setLogin(currentUser)),
            ])
            yield
            break;
          }
          case FirebaseStrings.nouser: {
            NavigationService.navigate('Auth')
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
