import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
// import { GithubTypes } from '../Redux/GithubRedux'
import { ProfileTypes } from '../Redux/ProfileRedux'
import {TestConnectionTypes} from '../Redux/TestConnectionRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
// import { getUserAvatar } from './GithubSagas'
import { getProfileList } from './ProfileSagas'
import { test200Saga, test400Saga, test500Saga } from './TestConnectionSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action
    // takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),

    takeLatest(ProfileTypes.GET_PROFILE_LIST_REQUEST, getProfileList, FixtureAPI),

    takeLatest(TestConnectionTypes.TEST200_REQUEST, test200Saga, api),
    takeLatest(TestConnectionTypes.TEST400_REQUEST, test400Saga, api),
    takeLatest(TestConnectionTypes.TEST500_REQUEST, test500Saga, api),
  ])
}
