import { createAppContainer } from 'react-navigation'
import PullRefreshListScreen from '../Containers/PullRefreshListScreen'
import { createStackNavigator } from 'react-navigation-stack';
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  PullRefreshListScreen: { screen: PullRefreshListScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  // headerMode: 'none',
  initialRouteName: 'PullRefreshListScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default createAppContainer(PrimaryNav)
