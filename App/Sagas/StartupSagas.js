import { put, select, all } from 'redux-saga/effects'

import QiscusActions from '../Redux/QiscusRedux'
// process STARTUP actions
export function * startup (action) {
  yield all([
    put(QiscusActions.qiscusInit())
  ])
}
