import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

// Styles
import styles from './Styles/RootContainerStyles'
import firebase from 'react-native-firebase'
import { setupNotificationPermission, setupTokenRegistration, setupNotificationListener } from '../../FIrebase/NotificationHelper'

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }

    /**
     * NEED TO REMOVE
     * remove thi code after you test crashlytic
     */
    // firebase.crashlytics().recordError(37,"Test Error");

    setupNotificationPermission().then((isGrant) => {
      if (isGrant) {
        setupTokenRegistration().then(deviceToken => {
          if (deviceToken) {
            console.tron.error({deviceToken})
          }
        })

        setupNotificationListener(notification => {
          if (notification) {
            console.tron.error({notification})
          }
        })
      }
    })
    .catch(error => {
      console.tron.error('NOTIFICATION PERMISSION ERROR')
    })
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ReduxNavigation />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
