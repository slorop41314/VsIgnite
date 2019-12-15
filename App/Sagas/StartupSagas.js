import { put, select, all } from 'redux-saga/effects'
import SessionActions, { SessionSelectors } from '../Redux/SessionRedux'
import { is } from 'ramda'
import QiscusActions from '../Redux/QiscusRedux'
import NavigationServices from '../Services/NavigationServices'
import QiscusManager from '../Qiscus/QiscusManager'


export function* startup(action) {
  yield put(QiscusActions.qiscusInit())
  const isLogin = yield select(SessionSelectors.getLoginStatus)

  if (isLogin) {
    const QInstance = QiscusManager.getInstance()
    const user = yield select(SessionSelectors.getUser)
    QInstance.setUserWithIdentityToken({ user })
  } else {
    NavigationServices.navigate('Auth')
  }
}
