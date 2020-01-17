import { takeLatest, all, takeEvery } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { AuthTypes } from '../Redux/AuthRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { loginSaga, logoutSaga, registerSaga } from './AuthSagas'
import { PubnubTypes } from '../Redux/PubnubRedux'
import { getPubnubUserList, getPubnubUserDetail, createPubnubUser, updatePubnubUser, deletePubnubUser } from './PubnubSagasHelper/User'
import { getPubnubMessage, sendPubnubMessage, sendPubnubTyping, updatePubnubMessage, deletePubnubMessage, getPubnubUnreadCount } from './PubnubSagasHelper/Message'
import { createPubnubSpace, getPubnubSpace, getAllPubnubSpace, updatePubnubSpace, deletePubnubSpace, joinPubnubSpace, leavePubnubSpace, getPubnubSpaceMembership, updatePubnubSpaceMembership, getPubnubSpaceMember, addPubnubSpaceMember, removePubnubSpaceMember } from './PubnubSagasHelper/Space'

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

    /** PUBNUB SECTION */
    /** USER */
    takeLatest(PubnubTypes.CREATE_PUBNUB_USER_REQUEST, createPubnubUser),
    takeLatest(PubnubTypes.UPDATE_PUBNUB_USER_REQUEST, updatePubnubUser),
    takeLatest(PubnubTypes.DELETE_PUBNUB_USER_REQUEST, deletePubnubUser),
    takeLatest(PubnubTypes.GET_PUBNUB_USER_LIST_REQUEST, getPubnubUserList),
    takeLatest(PubnubTypes.GET_PUBNUB_USER_DETAIL_REQUEST, getPubnubUserDetail),

    /** MESSAGE */
    takeEvery(PubnubTypes.GET_PUBNUB_MESSAGE_REQUEST, getPubnubMessage),
    takeLatest(PubnubTypes.SEND_PUBNUB_MESSAGE_REQUEST, sendPubnubMessage),
    takeLatest(PubnubTypes.SEND_PUBNUB_TYPING_REQUEST, sendPubnubTyping),
    takeEvery(PubnubTypes.UPDATE_PUBNUB_MESSAGE_REQUEST, updatePubnubMessage),
    takeLatest(PubnubTypes.DELETE_PUBNUB_MESSAGE_REQUEST, deletePubnubMessage),
    takeLatest(PubnubTypes.GET_PUBNUB_UNREAD_COUNT_REQUEST, getPubnubUnreadCount),

    /** SPACE */
    takeLatest(PubnubTypes.CREATE_PUBNUB_SPACE_REQUEST, createPubnubSpace),
    takeLatest(PubnubTypes.GET_PUBNUB_SPACE_REQUEST, getPubnubSpace),
    takeLatest(PubnubTypes.GET_ALL_PUBNUB_SPACE_REQUEST, getAllPubnubSpace),
    takeLatest(PubnubTypes.UPDATE_PUBNUB_SPACE_REQUEST, updatePubnubSpace),
    takeLatest(PubnubTypes.DELETE_PUBNUB_SPACE_REQUEST, deletePubnubSpace),

    /** MANAGE SPACE MEMBER */
    takeLatest(PubnubTypes.JOIN_PUBNUB_SPACE_REQUEST, joinPubnubSpace),
    takeLatest(PubnubTypes.LEAVE_PUBNUB_SPACE_REQUEST, leavePubnubSpace),
    takeLatest(PubnubTypes.GET_PUBNUB_SPACE_MEMBERSHIP_REQUEST, getPubnubSpaceMembership),
    takeLatest(PubnubTypes.UPDATE_PUBNUB_SPACE_MEMBERSHIP_REQUEST, updatePubnubSpaceMembership),
    takeEvery(PubnubTypes.GET_PUBNUB_SPACE_MEMBER_REQUEST, getPubnubSpaceMember),
    takeLatest(PubnubTypes.ADD_PUBNUB_SPACE_MEMBER_REQUEST, addPubnubSpaceMember),
    takeLatest(PubnubTypes.REMOVE_PUBNUB_SPACE_MEMBER_REQUEST, removePubnubSpaceMember),
  ])
}
