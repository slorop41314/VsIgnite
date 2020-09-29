import '../Config';
import DebugConfig from '../Config/DebugConfig';
import React, {Fragment, useEffect} from 'react';
import {Provider} from 'react-redux';
import RootContainer from './RootContainer';
import createStore from '../Redux';
import DropdownAlert from 'react-native-dropdownalert';
// eslint-disable-next-line import/no-unresolved
import {enableScreens} from 'react-native-screens';
import {DropDownHolder} from '../Components/Alert/DropDownHolder';
import Instabug from 'instabug-reactnative';
import Secrets from 'react-native-config';
import messaging from '@react-native-firebase/messaging';

enableScreens();
// create our store
const store = createStore();

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
const App = () => {
  useEffect(() => {
    Instabug.startWithToken(Secrets.INSTABUG_TOKEN, [
      Instabug.invocationEvent.shake,
    ]);
    requestUserPermission();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
    }
  }

  async function getFcmToken() {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  }
  return (
    <Fragment>
      <Provider store={store}>
        <RootContainer />
        <DropdownAlert ref={(ref) => DropDownHolder.setDropDown(ref)} />
      </Provider>
    </Fragment>
  );
};

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron ? console.tron.overlay(App) : App;
