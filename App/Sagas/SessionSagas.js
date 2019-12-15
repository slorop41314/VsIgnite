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

import { call, put } from 'redux-saga/effects'
import SessionActions from '../Redux/SessionRedux'
import NavigationServices from '../Services/NavigationServices'
import QiscusManager from '../Qiscus/QiscusManager'
// import { SessionSelectors } from '../Redux/SessionRedux'

export function * doLogout (api, action) {
  QiscusManager.diconnect()
  NavigationServices.navigate('Auth')
  yield put(SessionActions.logoutSuccess())
}
