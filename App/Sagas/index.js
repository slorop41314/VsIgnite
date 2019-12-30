import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { AuthTypes } from '../Redux/AuthRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { loginSaga, logoutSaga, registerSaga } from './AuthSagas'
import { UserTypes } from '../Redux/UserRedux'
import { getUserList } from './UserSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(AuthTypes.LOGIN_REQUEST, loginSaga),
    takeLatest(AuthTypes.LOGOUT_REQUEST, logoutSaga),
    takeLatest(AuthTypes.REGISTER_REQUEST, registerSaga),

    takeLatest(UserTypes.GET_USER_LIST_REQUEST, getUserList),
  ])
}
