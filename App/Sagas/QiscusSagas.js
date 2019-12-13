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

import { call, put, fork, take, cancelled, all } from 'redux-saga/effects';
import QiscusActions, { QiscusTypes } from '../Redux/QiscusRedux';
import QiscusManager from '../Qiscus/QiscusManager';
import {
  loginSuccessCallbackSaga,
  messageDeletedCallbackSaga,
  messageDeliveredCallbackSaga,
  messageReadCallbackSaga,
  presenceCallbackSaga,
  typingCallbackSaga,
  onReconnectCallbackSaga,
  roomClearedCallbackSaga,
  errorCallbackSaga,
  newMessagesCallbackSaga,
  roomEventSubscribe,
} from './QiscusHelperSagas';
import { eventChannel } from 'redux-saga';
import QiscusStrings from '../Qiscus/QiscusStrings';
import NavigationServices from '../Services/NavigationServices';

export function qiscusCallbackHandler() {
  return eventChannel(emit => {
    const errorCallback = error => {
      emit(new Error({ type: QiscusStrings.errors.loginFailure, error }));
    };
    const loginSuccessCallback = payload => {
      emit({ type: QiscusStrings.events.loginSuccess, payload });
    };
    const messageDeletedCallback = payload => {
      emit({ type: QiscusStrings.events.commentDeleted, payload });
    };
    const messageDeliveredCallback = payload => {
      emit({ type: QiscusStrings.events.commentDelivered, payload });
    };
    const messageReadCallback = payload => {
      emit({ type: QiscusStrings.events.commentRead, payload });
    };
    const presenceCallback = (data, userId) => {
      emit({
        type: QiscusStrings.events.onlinePresence,
        payload: { data, userId },
      });
    };
    const typingCallback = payload => {
      emit({ type: QiscusStrings.events.typing, payload });
    };
    const reconnectCallback = payload => {
      emit({ type: QiscusStrings.events.onReconnect, payload });
    };
    const newMessageCallback = messages => {
      emit({ type: QiscusStrings.events.newMessage, payload: { messages } });
    };
    const roomClearedCallback = payload => {
      emit({ type: QiscusStrings.events.chatRoomCreated, payload });
    };

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
    });

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
      console.tron.error('QISCUS CANCELED');
    }
  }

  // yield take(QiscusTypes.QISCUS_DESTROY);
  // console.tron.error('DO SOMETHING HERE ONCE USER QISCUS DESTROY')
}

export function* setUserSaga(action) {
  const { data } = action;
  const { userId, userKey, username, avatarUrl, extras } = data;

  yield QiscusManager.setUser(userId, userKey, username, avatarUrl, extras);
}

export function* getRoomsSaga(action) {
  const { data } = action;
  try {
    const rooms = yield QiscusManager.getChatRoomList(data);
    yield all([
      put(QiscusActions.getRoomsSuccess(rooms)),
      fork(roomEventSubscribe, rooms),
    ])
  } catch (error) {
    yield put(QiscusActions.getRoomsFailure());
  }
}

export function* getMessagesSaga(action) {
  const { data } = action;
  try {
    const comments = yield QiscusManager.getMessages(data.roomId, data.options);
    yield put(QiscusActions.getMessagesSuccess(comments));
  } catch (error) {
    yield put(QiscusActions.getMessagesFailure());
  }
}

export function* readMessageSaga(action) {
  console.tron.log({ action });
  const { data } = action;
  try {
    yield QiscusManager.readMessage(data.roomId, data.lastReadMessageId);
    yield put(QiscusActions.readMessageSuccess());
  } catch (error) {
    console.tron.error({ error });
    yield put(QiscusActions.readMessageFailure());
  }
}

function uploadFileHelper(obj) {
  return eventChannel(emit => {
    const uploadFailure = error => {
      emit(new Error({ type: QiscusStrings.upload.failure, error }));
    };
    const uploadSuccess = payload => {
      emit({ type: QiscusStrings.upload.success, payload });
    };
    const uploadProgress = payload => {
      emit({ type: QiscusStrings.upload.progress, payload });
    };

    QiscusManager.uploadFile(obj,
      uploadFailure,
      uploadProgress,
      uploadSuccess)

    const unsubscribe = () => {
      // unsubscribe
    };

    return unsubscribe;
  });
}

export function* sendMessageSaga(action) {
  let { data } = action;
  try {
    if (data.needToUpload) {
      const obj = {
        uri: data.toUpload.uri,
        type: data.toUpload.type,
        name: data.toUpload.name,
      };

      const qiscusEvent = yield call(uploadFileHelper, obj);
      try {
        while (true) {
          const eventPayload = yield take(qiscusEvent);
          const { type, payload } = eventPayload;
          switch (type) {
            case QiscusStrings.upload.success: {
              const name = data.toUpload.name;
              data = {
                ...data,
                payload: JSON.stringify({
                  type: QiscusStrings.upload.type.image,
                  content: {
                    url: payload,
                    file_name: name,
                    caption: data.text,
                  },
                })
              }

              const message = yield QiscusManager.sendMessage(
                data.roomId,
                data.text,
                data.uniqueId,
                data.type,
                data.payload,
              );
              yield put(QiscusActions.sendMessageSuccess(message));
              break;
            }
            case QiscusStrings.upload.progress: {
              break;
            }
          }
        }
      } catch (error) {
        console.tron.error({ failure: err })
      }
    } else {
      const message = yield QiscusManager.sendMessage(
        data.roomId,
        data.text,
        data.uniqueId,
        data.type,
        data.payload,
      );
      yield put(QiscusActions.sendMessageSuccess(message));
    }
  } catch (error) {
    console.tron.error({ error });
    yield put(QiscusActions.sendMessageFailure());
  }
}

export function* getUsersSaga(action) {
  const { data } = action;
  try {
    const users = yield QiscusManager.getUsers(
      data.searchQuery,
      data.page,
      data.limit,
    );
    yield put(QiscusActions.getUsersSuccess(users));
  } catch (error) {
    yield put(QiscusActions.getUsersFailure());
  }
}

export function* openRoomSaga(action) {
  const { data } = action;
  try {
    const room = yield QiscusManager.createOrGetSingleRoom(data);
    NavigationServices.navigate('ChatScreen', { room });
    yield put(QiscusActions.openRoomSuccess(room));
  } catch (error) {
    yield put(QiscusActions.openRoomFailure());
  }
}
