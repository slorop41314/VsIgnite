import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from 'react-redux';
import StartupActions from '../Redux/StartupRedux';
import ReduxPersist from '../Config/ReduxPersist';

// Styles
import styles from './Styles/RootContainerStyles';
import { setupNotificationListener, setupMessageListener } from '../FIrebase/NotificationHelper';
import firebase from 'react-native-firebase';

class RootContainer extends Component {
  componentDidMount() {
    // if redux persist is not active fire startup action
    // if (!ReduxPersist.active) {
    // this.props.startup();
    // }

    setupNotificationListener()
    // setupMessageListener()

    /**
    * NEED TO REMOVE
    * remove thi code after you test crashlytic
    */
    firebase.crashlytics().recordError(37, "Test Error");
  }

  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle="light-content" />
        <ReduxNavigation />
      </View>
    );
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(StartupActions.startup()),
});

export default connect(null, mapDispatchToProps)(RootContainer);
