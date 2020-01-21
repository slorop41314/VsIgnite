import React, { Component, createContext } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import { ConnectionHandler } from 'react-native-awesome-component'
import PubnubActions from '../Redux/PubnubRedux'

// Styles
import styles from './Styles/RootContainerStyles'

export const ConnectionContext = createContext(false)

class RootContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: true
    }
  }

  componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }

    /**
     * NEED TO REMOVE
     * remove thi code after you test crashlytic
     */
    // firebase.crashlytics().recordError(37,"Test Error");
  }

  render() {
    const { isConnected } = this.state
    return (
      <View style={styles.applicationView}>
        <ConnectionContext.Provider value={isConnected}>
          <ConnectionHandler
            onStateChange={(isConnected) => {
              if (this.state.isConnected !== isConnected) {
                this.setState({ isConnected }, () => {
                  if (isConnected) {
                    this.props.reconnectPubnub()
                  }
                })
              }
            }}
          />
          <StatusBar barStyle='light-content' />
          <ReduxNavigation />
        </ConnectionContext.Provider>
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  reconnectPubnub: () => dispatch(PubnubActions.reconnectPubnub())
})

export default connect(null, mapDispatchToProps)(RootContainer)
