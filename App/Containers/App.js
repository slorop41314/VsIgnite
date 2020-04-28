import '../Config';
import DebugConfig from '../Config/DebugConfig';
import React, {Fragment} from 'react';
import {Provider} from 'react-redux';
import RootContainer from './RootContainer';
import createStore from '../Redux';
import {enableScreens} from 'react-native-screens';
import {GlobalConst} from 'react-native-awesome-component';
import {scale} from '../Transforms/Scale';
import {Colors} from '../Themes';

enableScreens();

// create our store
const store = createStore();

GlobalConst.setGlobalCustomInputTextInputStyle({
  fontFamily: 'Galvji',
  fontSize: scale(18),
  color: Colors.blackNavi,
});
GlobalConst.setGlobalCustomInputLabelStyle({
  fontFamily: 'Galvji',
  fontSize: scale(15),
});
GlobalConst.setGlobalCustomInputFocusColor(Colors.mainActive);

GlobalConst.setGlobalButtonTitleSize(scale(18));
GlobalConst.setGlobalActiveButtonColor(Colors.mainActive);
GlobalConst.setGlobalDisableButtonTitleColor(Colors.snow);
GlobalConst.setGlobalActiveButtonTitleStyle({
  fontFamily: 'Galvji',
  color: Colors.snow,
});
GlobalConst.setGlobalDisableButtonTitleStyle({
  fontFamily: 'Galvji',
  color: Colors.snow,
});
GlobalConst.setGlobalCustomInputErrorMessageRequired(
  value => `${value} harus di isi`,
);
GlobalConst.setGlobalCustomInputErrorMessageMaximumNumber(
  (value, limit) => `${value} harus kurang dari ${limit}`,
);

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
  return (
    <Fragment>
      <Provider store={store}>
        <RootContainer />
      </Provider>
    </Fragment>
  );
};

// allow reactotron overlay for fast design in dev mode
export default (DebugConfig.useReactotron ? console.tron.overlay(App) : App);
