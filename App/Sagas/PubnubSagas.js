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

import { call, put, all, cancelled, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga';
import PubnubActions from '../Redux/PubnubRedux'
import PubnubManager from '../Pubnub/PubnubManager'
import PubnubStrings from '../Pubnub/PubnubStrings';
import PubnubStoreActions from '../Redux/PubnubStoreRedux'
// import { PubnubSelectors } from '../Redux/PubnubRedux'

export function pubnubEventHandler() {
  return eventChannel(emit => {
    const statusCallback = payload => {
      emit({ type: PubnubStrings.event.type.message, payload });
    };

    const presenceCallback = payload => {
      emit({ type: PubnubStrings.event.type.presence, payload });
    };

    const messageCallback = payload => {
      emit({ type: PubnubStrings.event.type.message, payload });
    };

    const signalCallback = payload => {
      emit({ type: PubnubStrings.event.type.signal, payload });
    };

    const messageActionCallback = payload => {
      emit({ type: PubnubStrings.event.type.messageAction, payload });
    };

    const userCallback = payload => {
      emit({ type: PubnubStrings.event.type.user, payload });
    };

    const spaceCallback = payload => {
      emit({ type: PubnubStrings.event.type.space, payload });
    };

    const membershipCallback = payload => {
      emit({ type: PubnubStrings.event.type.membership, payload });
    };

    PubnubManager.addListener({
      statusCallback: statusCallback,
      presenceCallback: presenceCallback,
      messageCallback: messageCallback,
      signalCallback: signalCallback,
      messageActionCallback: messageActionCallback,
      userCallback: userCallback,
      spaceCallback: spaceCallback,
      membershipCallback: membershipCallback,
    })

    const unsubscribe = () => {
      // unsubscribe
    };

    return unsubscribe;
  });
}

export function* initPubnub(data) {
  const pubnubUser = yield PubnubManager.init(data)
  if (pubnubUser) {
    yield put(PubnubStoreActions.saveUser(pubnubUser.user))
  }
  const pubnubEvent = yield call(pubnubEventHandler);
  try {
    while (true) {
      try {
        // An error from socketChannel will cause the saga jump to the catch block
        const eventPayload = yield take(pubnubEvent);
        console.tron.error({ eventPayload })
        const { type, payload } = eventPayload;
        switch (type) {
          case PubnubStrings.event.type.status: {
            yield all([
              put(PubnubStoreActions.onReceiveStatus(payload))
            ])
            break;
          }
          case PubnubStrings.event.type.presence: {
            yield all([
              put(PubnubStoreActions.onReceivePresence(payload))
            ])
            break;
          }
          case PubnubStrings.event.type.message: {
            const { message } = payload

            if (message) {
              const currentPubnubUser = PubnubMßanager.getCurrentUser()
              const { channel, timetoken, publisher } = payload
              if (publisher !== currentPubnubUser.id) {
                yield all([
                  put(PubnubStoreActions.increaseMessageCount({ channel, timetoken })),
                  put(PubnubActions.updatePubnubMessageRequest({ channel, timetoken, actiontype: PubnubStrings.message.type.receipt, value: PubnubStrings.event.value.delivered })),
                  put(PubnubStoreActions.onReceiveMessage(payload)),
                ])
              }
            }
            break;
          }
          case PubnubStrings.event.type.signal: {
            const { message, publisher } = payload
            const currentPubnubUser = PubnubManager.getCurrentUser()
            if (message && publisher !== currentPubnubUser.id) {
              yield all([
                put(PubnubStoreActions.onReceiveSignal(payload))
              ])
            }
            break;
          }
          case PubnubStrings.event.type.messageAction: {
            const currentPubnubUser = PubnubManager.getCurrentUser()
            const { publisher } = payload
            if (publisher !== currentPubnubUser.id) {
              yield all([
                put(PubnubStoreActions.onReceiveMessageAction(payload))
              ])
            }
            break;
          }
          case PubnubStrings.event.type.user: {
            yield all([
              put(PubnubStoreActions.onReceiveUser(payload))
            ])
            break;
          }
          case PubnubStrings.event.type.space: {
            yield all([
              put(PubnubStoreActions.onReceiveSpace(payload))
            ])
            break;
          }
          case PubnubStrings.event.type.membership: {
            const { message, channel } = payload
            const currentPubnubUser = PubnubManager.getCurrentUser()
            if (channel === currentPubnubUser.id) {
              const { event, type } = message
              if (type === PubnubStrings.event.type.membership) {
                if (event === PubnubStrings.event.type.create) {
                  yield all([
                    put(PubnubActions.getAllPubnubSpaceRequest({ limit: 100 }))
                  ])
                }
              }
            } else {
              yield all([
                put(PubnubStoreActions.onReceiveMembership(payload))
              ])
            }
            break;
          }
        }
      } catch (err) {
        console.tron.log('PUBNUB ERROR', err);
      }
    }
  } finally {
    if (yield cancelled()) {
      console.tron.error('PUBNUB CANCELED');
    }
  }
}
