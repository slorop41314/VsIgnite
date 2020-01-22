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

import { call, put, all, select, cancel, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga';
import PubnubActions from '../../Redux/PubnubRedux'
import PubnubManager from '../../Pubnub/PubnubManager'
import PubnubStrings from '../../Pubnub/PubnubStrings'
import PubnubStoreActions from '../../Redux/PubnubStoreRedux'
import { PubnubStoreSelectors } from '../../Redux/PubnubStoreRedux'
import { firebaseUploadFile, uplaodFileHelper } from '../../Firebase/FirebaseHelper'
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

export function uplaodEventHelper(data) {
  return eventChannel(emit => {
    let { message } = data
    const { type } = message

    const uploadSuccess = payload => {
      emit({ actionType: PubnubStrings.event.upload.success, type: type, payload: payload });
    };

    const uploadFailure = payload => {
      emit({ actionType: PubnubStrings.event.upload.failure, type: type, payload: payload });
    };

    const uploadRunning = payload => {
      emit({ actionType: PubnubStrings.event.upload.running, type: type, payload: payload });
    }

    switch (type) {
      case PubnubStrings.message.type.image:
      case PubnubStrings.message.type.video: {
        uplaodFileHelper(data, uploadSuccess, uploadFailure, uploadRunning)
        break
      }

      case PubnubStrings.message.type.text: {
        setTimeout(uploadSuccess, 0)
        break
      }
      default: {
      }
    }

    const unsubscribe = () => {
      // unsubscribe
    };

    return unsubscribe;
  });
}

/**
 * 
 * @param {string} channel: space uid
 * @param {object} message: message object
 */
export function* sendPubnubMessage(action) {
  try {
    yield put(PubnubStoreActions.addMessageQueue(action.data))
    const uploadEvent = yield call(uplaodEventHelper, action.data);
    while (true) {
      try {
        // An error from socketChannel will cause the saga jump to the catch block
        const eventPayload = yield take(uploadEvent);
        const { actionType, type, payload } = eventPayload;
        switch (actionType) {
          case PubnubStrings.event.upload.success: {
            let { message, channel } = action.data
            let localPath = undefined

            if (payload) {
              const { downloadURL, filePath } = payload
              // move file to local
              localPath = getLocalFileFromUrl(downloadURL)
              const isExist = yield isFileExist(localPath)

              if (!isExist) {
                localPath = yield moveFileToLocal(filePath, localPath)
              }

              if (type === PubnubStrings.message.type.image) {
                message = {
                  ...message,
                  image: downloadURL
                }
              }

              if (type == PubnubStrings.message.type.video) {
                message = {
                  ...message,
                  video: downloadURL
                }
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

            break
          }
          case PubnubStrings.event.upload.failure: {
            yield all([
              put(PubnubStoreActions.messageQueueFailure(action.data)),
              put(PubnubActions.sendPubnubMessageFailure()),
            ])
            break
          }
          case PubnubStrings.event.upload.running: {
            yield all([
              put(PubnubStoreActions.putUploadProgress({ message: action.data, progress: payload }))
            ])
            break;
          }
        }
      } catch (err) {
        yield all([
          put(PubnubStoreActions.messageQueueFailure(action.data)),
          put(PubnubActions.sendPubnubMessageFailure()),
        ])
      }
    }
  } catch (err) {
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