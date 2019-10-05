import { NavigationActions } from 'react-navigation';

let _navigator;
let _currentScreen;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;

  if (_navigator) {
    _currentScreen = getActiveRouteName(navigatorRef.currentNavProp.state)
  }
}

function navigate(routeName, params) {
  if (_navigator) {
    // _navigator.props.dispatch(
    //   NavigationActions.navigate({
    //     routeName,
    //     params,
    //   })
    // );
    _navigator.currentNavProp.navigate(routeName, params)
  }
}

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

function getCurrentScreen() {
  return _currentScreen
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  getCurrentScreen,
};
