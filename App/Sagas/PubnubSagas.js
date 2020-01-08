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

import { call, put, all } from 'redux-saga/effects'
import PubnubActions from '../Redux/PubnubRedux'
import PubnubManager from '../Pubnub/PubnubManager'
// import { PubnubSelectors } from '../Redux/PubnubRedux'

export function* initPubnub(data) {
  PubnubManager.init(data)
  yield all([
    // put(PubnubActions.getAllPubnubSpaceRequest({limit: 100}))
  ])
}
