import { createAppContainer } from 'react-navigation'
import UserListScreen from '../Containers/UserListScreen'
import ChatScreen from '../Containers/ChatScreen'
import ChannelScreen from '../Containers/ChannelScreen'
import LoginScreen from '../Containers/LoginScreen'
import { createStackNavigator } from 'react-navigation-stack';
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  UserListScreen: { screen: UserListScreen },
  ChatScreen: { screen: ChatScreen },
  ChannelScreen: { screen: ChannelScreen },
  LoginScreen: { screen: LoginScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  // headerMode: 'none',
  initialRouteName: 'LoginScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default createAppContainer(PrimaryNav)
