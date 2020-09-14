import {NavigationActions, StackActions} from 'react-navigation';

let navigator;

function setTopLevelNavigator(navigatorRef) {
  if (navigatorRef !== null && navigatorRef !== undefined) {
    navigator = navigatorRef;
  }
}

function navigate(routeName, params) {
  if (navigator) {
    const navigation = navigator.getCurrentNavigation();
    navigation.navigate(routeName, params);
  }
}

function dispatch(action) {
  if (navigator && navigator.currentNavProp) {
    const navigation = navigator.currentNavProp;
    navigation.dispatch(action);
  }
}

function findActiveScreen(state, topRoute) {
  const {routes, index} = state;
  if (routes && routes[index]) {
    return findActiveScreen(routes[index], topRoute);
  }
  return {
    ...state,
    topRoute
  };
}

function getActiveScreenAndParams() {
  if (navigator && navigator.currentNavProp) {
    const navigation = navigator.currentNavProp;
    const {state} = navigation;
    const topRoute = state.routes[state.index];
    return findActiveScreen(state, {
      key: topRoute.key,
      routeName: topRoute.routeName
    });
  }
  return undefined;
}

function goBack() {
  if (navigator && navigator.currentNavProp) {
    const navigation = navigator.currentNavProp;
    navigation.goBack();
  }
}

function popToTop() {
  if (navigator && navigator.currentNavProp) {
    const navigation = navigator.currentNavProp;
    const action = StackActions.popToTop();
    navigation.dispatch(action);
  }
}

function replace(routeName, params) {
  if (navigator && navigator.currentNavProp) {
    const navigation = navigator.currentNavProp;
    const action = StackActions.replace({routeName, params});
    navigation.dispatch(action);
  }
}

function push(routeName, params) {
  if (navigator && navigator.currentNavProp) {
    const navigation = navigator.currentNavProp;
    const action = StackActions.push({routeName, params});
    navigation.dispatch(action);
  }
}
// add other navigation functions that you need and export them

export default {
  navigate,
  dispatch,
  setTopLevelNavigator,
  getActiveScreenAndParams,
  goBack,
  popToTop,
  replace,
  push
};
