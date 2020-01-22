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

import { call, put, all, select, cancel } from 'redux-saga/effects'
import PubnubActions from '../../Redux/PubnubRedux'
import PubnubManager from '../../Pubnub/PubnubManager'
import PubnubStrings from '../../Pubnub/PubnubStrings'
import PubnubStoreActions from '../../Redux/PubnubStoreRedux'
import { PubnubStoreSelectors } from '../../Redux/PubnubStoreRedux'
import { firebaseUploadFile } from '../../Firebase/FirebaseHelper'
import { Method } from 'react-native-awesome-component'
import { Platform } from 'react-native'
import { getLocalFileFromUrl, moveFileToLocal, isFileExist } from '../../Lib/DownloadHelper'
import { AuthTypes } from '../../Redux/AuthRedux'


export function* getPubnubMessage(action) {
  try {
    const { channels, limit, start, end } = action.data
    const response = yield PubnubManager.getMessage(channels, limit, start, end)

    const alltask = yield all([
      put(PubnubStoreActions.saveMessages(response.channels, limit === 1)),
      put(PubnubActions.getPubnubMessageSuccess(response))
    ])

    yield take(AuthTypes.LOGOUT_REQUEST)
    yield cancel(...alltask)

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
    yield put(PubnubStoreActions.addMessageQueue(action.data))

    let { channel, message } = action.data
    const { type } = message
    let localPath = undefined


    if (type === PubnubStrings.message.type.image) {
      const { image } = message
      const filePath = image.path.includes('file://') ? image.path : `file://${image.path}`
      const res = yield firebaseUploadFile(channel, filePath, true)
      const { downloadURL } = res
      // move file to local
      localPath = getLocalFileFromUrl(downloadURL)
      const isExist = yield isFileExist(localPath)

      if (!isExist) {
        localPath = yield moveFileToLocal(filePath, localPath)
      }

      message = {
        ...message,
        image: downloadURL
      }
    }

    if (type === PubnubStrings.message.type.video) {
      const { video } = message
      const filePath = video.path.includes('file://') ? video.path : `file://${video.path}`
      console.tron.error({ filePath })
      const res = yield firebaseUploadFile(channel, filePath, false)
      const { downloadURL } = res
      // move file to local
      localPath = getLocalFileFromUrl(downloadURL)
      const isExist = yield isFileExist(localPath)

      if (!isExist) {
        localPath = yield moveFileToLocal(filePath, localPath)
      }

      message = {
        ...message,
        video: downloadURL
      }
    }

    let response = yield PubnubManager.sendMessage(channel, message)

    if ((type === PubnubStrings.message.type.image) || (type === PubnubStrings.message.type.video)) {
      response = {
        ...response,
        message: {
          ...response.message,
          localPath,
        }
      }
    }

    const alltask = yield all([
      put(PubnubStoreActions.messageQueueSuccess(action.data)),
      put(PubnubStoreActions.onReceiveMessage(response)),
      put(PubnubActions.updatePubnubMessageRequest({ channel, timetoken: response.timetoken, actiontype: PubnubStrings.message.type.receipt, value: PubnubStrings.event.value.delivered })),
      put(PubnubActions.sendPubnubMessageSuccess(response))
    ])

    yield take(AuthTypes.LOGOUT_REQUEST)
    yield cancel(...alltask)
  } catch (error) {
    yield all([
      put(PubnubStoreActions.messageQueueFailure(action.data)),
      put(PubnubActions.sendPubnubMessageFailure()),
    ])
  }
}

export function* sendPubnubTyping(action) {
  try {
    const { channel, isTyping } = action.data
    const response = yield PubnubManager.sendTyping(channel, isTyping)
    const task = yield put(PubnubActions.sendPubnubTypingSuccess(response))

    yield take(AuthTypes.LOGOUT_REQUEST)
    yield cancel(task)
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
    const alltask = yield all([
      ...actionToAdded,
      put(PubnubStoreActions.onReceiveMessageAction(payloadUdpateAction)),
      put(PubnubActions.updatePubnubMessageSuccess(response))
    ])

    yield take(AuthTypes.LOGOUT_REQUEST)
    yield cancel(...alltask)
  } catch (error) {
    yield put(PubnubActions.updatePubnubMessageFailure())
  }
}

export function* deletePubnubMessage(action) {
  try {
    const { channel, startAt, endAt } = action.data
    const response = yield PubnubManager.deleteMessage(channel, startAt, endAt)
    const task = yield put(PubnubActions.deletePubnubMessageSuccess(response))

    yield take(AuthTypes.LOGOUT_REQUEST)
    yield cancel(task)
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
      const alltask = yield all([
        put(PubnubStoreActions.setMessageCount({ ...response, channelIds: channels })),
        put(PubnubActions.getPubnubUnreadCountSuccess(response)),
      ])

      yield take(AuthTypes.LOGOUT_REQUEST)
      yield cancel(...alltask)
    }
  } catch (error) {
    yield put(PubnubActions.getPubnubUnreadCountFailure())
  }
}