import { call, put, fork, all } from 'redux-saga/effects'
import QiscusActions from '../Redux/QiscusRedux'
import QiscusManager from '../Qiscus/QiscusManager'
import NavigationServices from '../Services/NavigationServices'

export function* errorCallbackSaga(error) {
  console.tron.warn('QISCUS ERROR CALLBACK')
  console.tron.error({ error })
}

export function* loginSuccessCallbackSaga(data) {
  NavigationServices.navigate('RoomListScreen')
  yield all([
    put(QiscusActions.loginSuccessCallback(data))
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
  yield all([
    put(QiscusActions.newMessagesCallback(data))
  ])
}

export function* roomClearedCallbackSaga(data) {
  yield all([
    put(QiscusActions.roomClearedCallback(data))
  ])
}