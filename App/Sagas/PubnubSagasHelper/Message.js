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

import { call, put, all, select } from 'redux-saga/effects'
import PubnubActions from '../../Redux/PubnubRedux'
import PubnubManager from '../../Pubnub/PubnubManager'
import PubnubStrings from '../../Pubnub/PubnubStrings'
import PubnubStoreActions from '../../Redux/PubnubStoreRedux'
import { PubnubStoreSelectors } from '../../Redux/PubnubStoreRedux'
import { firebaseUploadFile } from '../../Firebase/FirebaseHelper'
import { Method } from 'react-native-awesome-component'

export function* getPubnubMessage(action) {
  try {
    const { channels, limit, start, end } = action.data
    const response = yield PubnubManager.getMessage(channels, limit, start, end)

    yield all([
      put(PubnubStoreActions.saveMessages(response.channels, limit === 1)),
      put(PubnubActions.getPubnubMessageSuccess(response))
    ])
  } catch (error) {
    yield put(PubnubActions.getPubnubMessageFailure())
  }
}

/**
 * 
 * @param {string} channel: space uid
 * @param {object} message: message object
 */
export function* sendPubnubMessage(action) {
  try {
    let { channel, message } = action.data
    const { type } = message
    if (type === PubnubStrings.message.type.images) {
      const { image } = message
      const res = yield firebaseUploadFile(`${channel}/${Method.Helper.getFileNameFromPath(image.uri)}`, image.uri)
      const { downloadURL } = res
      message = {
        ...message,
        image: downloadURL
      }
    }
    const response = yield PubnubManager.sendMessage(channel, message)
    yield all([
      put(PubnubStoreActions.onReceiveMessage(response)),
      put(PubnubActions.updatePubnubMessageRequest({ channel, timetoken: response.timetoken, actiontype: PubnubStrings.message.type.receipt, value: PubnubStrings.event.value.delivered })),
      put(PubnubActions.sendPubnubMessageSuccess(response))
    ])
  } catch (error) {
    yield put(PubnubActions.sendPubnubMessageFailure())
  }
}

export function* sendPubnubTyping(action) {
  try {
    const { channel, isTyping } = action.data
    const response = yield PubnubManager.sendTyping(channel, isTyping)
    yield put(PubnubActions.sendPubnubTypingSuccess(response))
  } catch (error) {
    yield put(PubnubActions.sendPubnubTypingFailure())
  }
}

export function* updatePubnubMessage(action) {
  try {
    const { channel, timetoken, actiontype, value } = action.data
    const response = yield PubnubManager.updateMessage(channel, actiontype, timetoken, value)
    let actionToAdded = []

    if (actiontype === PubnubStrings.message.type.receipt) {
      if (value === PubnubStrings.event.value.read) {
        actionToAdded.push(put(PubnubStoreActions.decreaseMessageCount({ channel, timetoken })))
      }
    }

    const payloadUdpateAction = {
      channel,
      publisher: response.data.uuid,
      data: response.data,
      event: 'added'
    }
    yield all([
      ...actionToAdded,
      put(PubnubStoreActions.onReceiveMessageAction(payloadUdpateAction)),
      put(PubnubActions.updatePubnubMessageSuccess(response))
    ])
  } catch (error) {
    yield put(PubnubActions.updatePubnubMessageFailure())
  }
}

export function* deletePubnubMessage(action) {
  try {
    const { channel, startAt, endAt } = action.data
    const response = yield PubnubManager.deleteMessage(channel, startAt, endAt)
    yield put(PubnubActions.deletePubnubMessageSuccess(response))
  } catch (error) {
    yield put(PubnubActions.deletePubnubMessageFailure())
  }
}

export function* getPubnubUnreadCount(action) {
  try {
    const channelTimetokens = yield select(PubnubStoreSelectors.getChannelsToken)
    if (channelTimetokens.length > 0) {
      const channels = channelTimetokens.map((c) => c.channel)
      const timetokens = channelTimetokens.map((c) => c.timetoken)
      const response = yield PubnubManager.getUnreadCount(channels, timetokens)
      yield all([
        put(PubnubStoreActions.setMessageCount({ ...response, channelIds: channels })),
        put(PubnubActions.getPubnubUnreadCountSuccess(response)),
      ])
    }
  } catch (error) {
    yield put(PubnubActions.getPubnubUnreadCountFailure())
  }
}