import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import {connect} from 'react-redux';
import {
  ConnectionHandler,
  LoadingModal,
  Method
} from 'react-native-awesome-component';
import StartupActions from '../Redux/StartupRedux';
import ReduxPersist from '../Config/ReduxPersist';

// Styles
import styles from './Styles/RootContainerStyles';
import {setConnectionStatus} from '../Lib/ConnectionHelper';

class RootContainer extends Component {
  componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup();
    }
  }

  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle="light-content" />
        <ConnectionHandler
          closeInterval={3000}
          onStateChange={isConnected => {
            setConnectionStatus(isConnected);
          }}
        />
        <LoadingModal ref={r => Method.LoadingHelper.setLoadingInstance(r)} />
        <ReduxNavigation />
      </View>
    );
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(StartupActions.startup())
});

export default connect(
  null,
  mapDispatchToProps
)(RootContainer);
