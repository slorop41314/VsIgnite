import {Method} from 'react-native-awesome-component';
import {getConnectionStatus} from '../Lib/ConnectionHelper';
import {Keyboard} from 'react-native';

// put action type to show loading here
const showLoadingActions = [];

// put action type to hide loading here
const hideLoadingActions = [];

const actionsTracking = () => next => action => {
  if (showLoadingActions.includes(action.type)) {
    if (getConnectionStatus()) {
      Method.LoadingHelper.showLoading();
    }
  }

  if (hideLoadingActions.includes(action.type)) {
    Method.LoadingHelper.hideLoading();
  }

  if (action.type.includes('Navigation')) {
    Keyboard.dismiss();
  }

  return next(action);
};

export default actionsTracking;
