import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/Login/LoginScreen'
import RoomListScreen from '../Containers/Chat/RoomListScreen'
import UserListScreen from '../Containers/Chat/UserListScreen'
import ChatScreen from '../Containers/Chat/ChatScreen'
import ProfileScreen from '../Containers/Profile/ProfileScreen';

import styles from './Styles/NavigationStyles'

export const AuthStack = createStackNavigator(
  {
    LoginScreen: { screen: LoginScreen },
  },
  {
    // Default config for all screens
    headerMode: 'screen',
    initialRouteName: 'LoginScreen',
  },
);

export const MainStack = createStackNavigator(
  {
    RoomListScreen: { screen: RoomListScreen },
    UserListScreen: { screen: UserListScreen },
    ChatScreen: { screen: ChatScreen },
    ProfileScreen: { screen: ProfileScreen }
  },
  {
    // Default config for all screens
    headerMode: 'screen',
    initialRouteName: 'RoomListScreen',
  },
);

const PrimaryNav = createSwitchNavigator(
  {
    Splash: LaunchScreen,
    Auth: AuthStack,
    Main: MainStack,
  },
  {
    initialRouteName: 'Splash',
  },
);

export default createAppContainer(PrimaryNav);

