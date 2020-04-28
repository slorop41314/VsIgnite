import {NavigationActions} from 'react-navigation';

let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(routeName, params) {
  if (navigator) {
    // navigator.props.dispatch(
    //   NavigationActions.navigate({
    //     routeName,
    //     params,
    //   })
    // );
    navigator.currentNavProp.navigate(routeName, params);
  }
}

function dispatch(action) {
  const navigation = navigator.currentNavProp;
  navigation.dispatch(action);
}

function findActiveScreen(state) {
  const {routes, index} = state;
  if (routes && routes[index]) {
    return findActiveScreen(routes[index]);
  }
  return state;
}

function getActiveScreenAndParams() {
  const navigation = navigator.currentNavProp;
  const {state} = navigation;
  return findActiveScreen(state, null);
}

// add other navigation functions that you need and export them

export default {
  navigate,
  dispatch,
  setTopLevelNavigator,
  getActiveScreenAndParams,
};
