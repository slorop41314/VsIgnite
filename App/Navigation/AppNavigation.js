import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'
import AuthNavigation from './AuthNavigation';
import MainNavigation from './MainNavigation';

// Manifest of possible screens

const PrimaryNav = createSwitchNavigator({
  Auth: { screen: AuthNavigation },
  Main: { screen: MainNavigation },
  LaunchScreen: { screen: LaunchScreen },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default createAppContainer(PrimaryNav)
