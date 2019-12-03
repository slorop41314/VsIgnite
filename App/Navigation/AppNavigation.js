import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/Login/LoginScreen'
import RoomListScreen from '../Containers/Chat/RoomListScreen'
import UserListScreen from '../Containers/Chat/UserListScreen'
import ChatScreen from '../Containers/Chat/ChatScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  LaunchScreen: { screen: LaunchScreen },

  LoginScreen: { screen: LoginScreen },

  RoomListScreen: { screen: RoomListScreen },
  UserListScreen: { screen: UserListScreen },
  ChatScreen: { screen: ChatScreen },
}, {
  // Default config for all screens
  // headerMode: 'none',
  initialRouteName: 'LoginScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default createAppContainer(PrimaryNav)
