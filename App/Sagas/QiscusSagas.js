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

import { call, put, fork, take, cancelled } from 'redux-saga/effects'
import QiscusActions, { QiscusTypes } from '../Redux/QiscusRedux'
import QiscusManager from '../Qiscus/QiscusManager'
import { loginSuccessCallbackSaga, messageDeletedCallbackSaga, messageDeliveredCallbackSaga, messageReadCallbackSaga, presenceCallbackSaga, typingCallbackSaga, onReconnectCallbackSaga, roomClearedCallbackSaga, errorCallbackSaga, newMessagesCallbackSaga } from './QiscusHelperSagas'
import { eventChannel } from 'redux-saga';
import QiscusStrings from '../Qiscus/QiscusStrings';

export function qiscusCallbackHandler() {
  return eventChannel((emit) => {
    const errorCallback = (error) => {
      emit(new Error({ type: QiscusStrings.errors.loginFailure, error }));
    }
    const loginSuccessCallback = (payload) => {
      emit({ type: QiscusStrings.events.loginSuccess, payload });
    };
    const messageDeletedCallback = (payload) => {
      emit({ type: QiscusStrings.events.commentDeleted, payload });
    }
    const messageDeliveredCallback = (payload) => {
      emit({ type: QiscusStrings.events.commentDelivered, payload });
    }
    const messageReadCallback = (payload) => {
      emit({ type: QiscusStrings.events.commentRead, payload });
    }
    const presenceCallback = (data, userId) => {
      emit({ type: QiscusStrings.events.onlinePresence, payload: { data, userId } });
    }
    const typingCallback = (payload) => {
      emit({ type: QiscusStrings.events.typing, payload });
    }
    const reconnectCallback = (payload) => {
      emit({ type: QiscusStrings.events.onReconnect, payload });
    }
    const newMessageCallback = (messages) => {
      emit({ type: QiscusStrings.events.newMessage, payload: { messages } });
    }
    const roomClearedCallback = (payload) => {
      emit({ type: QiscusStrings.events.chatRoomCreated, payload });
    }

    QiscusManager.init({
      errorCallback: errorCallback,
      loginSuccess: loginSuccessCallback,
      commentDeleted: messageDeletedCallback,
      commentDelivered: messageDeliveredCallback,
      commentRead: messageReadCallback,
      presence: presenceCallback,
      typing: typingCallback,
      onReconnect: reconnectCallback,
      newMessages: newMessageCallback,
      roomCleared: roomClearedCallback,
    })

    const unsubscribe = () => {
      // unsubscribe
    };

    return unsubscribe;
  });
}

export function* qiscusInitSaga(action) {
  const qiscusEvent = yield call(qiscusCallbackHandler);
  try {
    while (true) {
      try {
        // An error from socketChannel will cause the saga jump to the catch block
        const eventPayload = yield take(qiscusEvent);
        const { type, payload } = eventPayload;
        switch (type) {
          case QiscusStrings.events.loginSuccess: {
            yield* loginSuccessCallbackSaga(payload);
            break;
          }
          case QiscusStrings.events.commentDeleted: {
            yield* messageDeletedCallbackSaga(payload);
            break;
          }
          case QiscusStrings.events.commentDelivered: {
            yield* messageDeliveredCallbackSaga(payload);
            break;
          }
          case QiscusStrings.events.commentRead: {
            yield* messageReadCallbackSaga(payload);
            break;
          }
          case QiscusStrings.events.onlinePresence: {
            yield* presenceCallbackSaga(payload);
            break;
          }
          case QiscusStrings.events.typing: {
            yield* typingCallbackSaga(payload);
            break;
          }
          case QiscusStrings.events.onReconnect: {
            yield* onReconnectCallbackSaga(payload);
            break;
          }
          case QiscusStrings.events.newMessage: {
            yield* newMessagesCallbackSaga(payload);
            break;
          }
          case QiscusStrings.events.chatRoomCreated: {
            yield* roomClearedCallbackSaga(payload);
            break;
          }
        }
      } catch (err) {
        console.tron.log('QISCUS ERROR', err);
      }
    }
  } finally {
    if (yield cancelled()) {
      console.tron.error('QISCUS CANCELED')
    }
  }

  // yield take(QiscusTypes.QISCUS_DESTROY);
  // console.tron.error('DO SOMETHING HERE ONCE USER QISCUS DESTROY')
}

export function* setUserSaga(action) {
  const { data } = action
  const { userId, userKey, userName, avatarUrl, extras } = data

  yield QiscusManager.setUser(userId, userKey, userName, avatarUrl, extras)
}
