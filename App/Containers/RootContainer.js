import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import AsyncStorage from "@react-native-community/async-storage";
import {connect} from 'react-redux';
import StartupActions from '../Redux/StartupRedux';
import ReduxPersist from '../Config/ReduxPersist';

// Styles
import styles from './Styles/RootContainerStyles';
import firebase from 'react-native-firebase';

import * as Qiscus from "../Qiscus";
import * as Firebase from "../Utils/Firebase";

class RootContainer extends Component {
  componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup();
    }

    /**
     * NEED TO REMOVE
     * remove thi code after you test crashlytic
     */
    // firebase.crashlytics().recordError(37,"Test Error");

    GLOBAL.Qiscus = Qiscus;
    Qiscus.init();
    AsyncStorage.getItem("qiscus").then(
      res => {
        if (res == null) return;
        const data = JSON.parse(res);
        Qiscus.qiscus.setUserWithIdentityToken({ user: data });
      },
      error => {
        console.tron.error("error getting login data", error);
      }
    );

    this.subscription = Firebase.initiate$()
      .map(() => Firebase.createChannel())
      .map(() => Firebase.requestPermission$())
      .flatten()
      .map(() => Firebase.onNotification$())
      .flatten()
      .map(it => Firebase.createNotification(it))
      .subscribe({
        next: notification => {
          Firebase.displayNotification(notification);
        },
        error: error => console.tron.error('error initiate firebase', error),
      });
  }

  componentWillUnmount() {
    if (this.subscription != null) this.subscription.unsubscribe();
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
