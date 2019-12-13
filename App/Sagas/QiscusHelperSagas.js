import { call, put, fork, all, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga';
import QiscusActions from '../Redux/QiscusRedux'
import QiscusManager from '../Qiscus/QiscusManager'
import NavigationServices from '../Services/NavigationServices'
import QiscusStrings from '../Qiscus/QiscusStrings'
import { difference } from 'ramda'

const subscribedEventRoomId = []

export function* errorCallbackSaga(error) {
  console.tron.warn('QISCUS ERROR CALLBACK')
  console.tron.error({ error })
}

export function* loginSuccessCallbackSaga(data) {
  NavigationServices.navigate('RoomListScreen')
  yield all([
    put(QiscusActions.loginSuccessCallback(data)),
  ])
}

export function* messageDeletedCallbackSaga(data) {
  yield all([
    put(QiscusActions.messageDeletedCallback(data))
  ])
}

export function* messageDeliveredCallbackSaga(data) {
  yield all([
    put(QiscusActions.messageDeliveredCallback(data))
  ])
}

export function* messageReadCallbackSaga(data) {
  yield all([
    put(QiscusActions.messageReadCallback(data))
  ])
}

export function* presenceCallbackSaga(data, userId) {
  yield all([
    put(QiscusActions.presenceCallback(data, userId))
  ])
}

export function* typingCallbackSaga(data) {
  yield all([
    put(QiscusActions.typingCallback(data))
  ])
}

export function* onReconnectCallbackSaga(data) {
  yield all([
    put(QiscusActions.onReconnectCallback(data))
  ])
}

export function* newMessagesCallbackSaga(data) {
  const {messages} = data
  messages.map(message => {
    QiscusManager.receiveMessage(message.topic_id_str, message.id_str)
  })
  yield all([
    put(QiscusActions.newMessagesCallback(data))
  ])
}

export function* roomClearedCallbackSaga(data) {
  yield all([
    put(QiscusActions.roomClearedCallback(data))
  ])
}

function roomEventHelper(roomId) {
  return eventChannel(emit => {
    const eventCallback = payload => {
      emit({ type: QiscusStrings.room_event, payload });
    }

    QiscusManager.subscribeEvent(roomId, eventCallback)

    const unsubscribe = () => {
      QiscusManager.unsubscribeEvent(roomId)
    };

    return unsubscribe;
  });
}

function* subscribeRoomEvent(roomId) {
  const roomEvent = yield call(roomEventHelper, roomId)
  try {
    while (true) {
      const eventPayload = yield take(roomEvent);
      const { type, payload } = eventPayload;
      switch (type) {
        case QiscusStrings.room_event: {
          console.tron.error({ 'ROOM EVENT': payload })
          break;
        }
      }
    }
  } catch (error) {
    console.tron.error({ 'room-event-failure': error })
  }
}

export function* roomEventSubscribe(rooms) {
  const roomIds = rooms.map(room => room.unique_id)
  const notSubscribedEventRoomId = difference(roomIds, subscribedEventRoomId)
  for (i = 0; i < notSubscribedEventRoomId.length; i++) {
    subscribedEventRoomId.push(notSubscribedEventRoomId[i])
    yield fork(subscribeRoomEvent, notSubscribedEventRoomId[i])
  }
}