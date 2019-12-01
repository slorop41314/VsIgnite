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

import { call, put, take, cancelled, all, fork } from 'redux-saga/effects'
import FireEngineActions from '../Redux/FireEngineRedux'
import FireEngine from '../Services/firestore-chat-engine'
import { FIRE_ENGINE_EVENT } from '../Services/firestore-chat-engine/const';
import { eventChannel } from 'redux-saga';
import NavigationService from '../Services/NavigationServices'
import FireEngineManager from '../Services/FireEngineManager'
// import { FireEngineSelectors } from '../Redux/FireEngineRedux'

export function handleEventListener(fireEngine) {
  return eventChannel((emit) => {
    const engineReady = (payload) => {
      emit({ type: FIRE_ENGINE_EVENT.ready, payload });
    }
    const initFailure = (payload) => {
      emit({ type: FIRE_ENGINE_EVENT.init_failure, payload });
    }
    const engineError = (payload) => {
      emit({ type: FIRE_ENGINE_EVENT.error, payload });
    }
    const getUserList = (payload) => {
      emit({ type: FIRE_ENGINE_EVENT.user_list, payload })
    }
    const getChannelList = (payload) => {
      emit({ type: FIRE_ENGINE_EVENT.channel_list, payload })
    }
    const getMessageList = (payload) => {
      emit({ type: FIRE_ENGINE_EVENT.message_list, payload })
    }

    fireEngine.onReady(engineReady)
    fireEngine.onInitFailure(initFailure)
    fireEngine.onError(engineError)
    fireEngine.onUserList(getUserList)
    fireEngine.onChannelList(getChannelList)
    fireEngine.onMessageList(getMessageList)

    const unsubscribe = () => {
      // unsubscribe later
    };

    return unsubscribe;
  });
}

export function* initFireEngine(action) {
  const { data } = action

  const fireEngine = new FireEngine(data)
  FireEngineManager.setInstance(fireEngine)
  const fireEvent = yield call(handleEventListener, fireEngine);
  try {
    while (true) {
      try {
        // An error from socketChannel will cause the saga jump to the catch block
        const eventPayload = yield take(fireEvent);
        const { type, payload } = eventPayload;
        switch (type) {
          case FIRE_ENGINE_EVENT.ready: {
            yield put(FireEngineActions.initFireEngineSuccess(payload))
            NavigationService.navigate('ChannelScreen')
            break;
          }

          case FIRE_ENGINE_EVENT.init_failure: {
            yield put(FireEngineActions.initFireEngineFailure())
            break;
          }

          case FIRE_ENGINE_EVENT.user_list: {
            yield put(FireEngineActions.saveUserList(payload));
            break;
          }

          case FIRE_ENGINE_EVENT.channel_list: {
            yield put(FireEngineActions.saveChannelList(payload));
            break;
          }

          case FIRE_ENGINE_EVENT.message_list: {
            yield put(FireEngineActions.saveMessageList(payload));
            break;
          }
        }
      } catch (err) {
        console.log({ err })
      }
    }
  } finally {
    if (yield cancelled()) {
      console.log('ENGINE CANCEL')
    }
  }
}

export function* handleInitListener(payload) {
  yield all([
    put(FireEngineActions.initSuccess(payload)),
  ])
}

export function* sendMessageSaga(action) {
  const { data } = action
  const { channel, message } = data

  try {
    const fireInstance = FireEngineManager.getInstance()
    const messageRes = yield fireInstance.sendMessage(channel, message)
    yield put(FireEngineActions.sendMessageSuccess(messageRes))
  } catch (error) {
    yield put(FireEngineActions.sendMessageFailure())
  }
}
