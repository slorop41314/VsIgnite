import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import ChannelListScreen from '../Containers/Main/ChannelListScreen';
import { CustomHeader } from 'react-native-awesome-component'

import styles from './Styles/NavigationStyles'
import UserProfileScreen from '../Containers/Main/UserProfileScreen';
import UserListScreen from '../Containers/Main/UserListScreen';
import GroupCreateScreen from '../Containers/Main/GroupCreateScreen';
import ChatScreen from '../Containers/Main/ChatScreen';
import ChatHeader from '../Components/ChatHeader';
import ChannelHeader from '../Components/ChannelHeader';

// Manifest of possible screens
const MainNav = createStackNavigator({
  ChannelListScreen: {
    screen: ChannelListScreen,
    navigationOptions: ({ navigation }) => {
      return {
        header: (
          <ChannelHeader navigation={navigation} />
        ),
        // ONCE YOU USE CUSTOM HEADER, MAKE SURE YOU SET HEADER LEFT AS NULL, TO PREVENT DEFAULT HEADER LEFT
        headerLeft: null,
      };
    },
  },
  GroupCreateScreen: {
    screen: GroupCreateScreen,
    navigationOptions: ({ navigation }) => {
      return {
        header: (
          <CustomHeader
            navigation={navigation}
            isCard={true}
            title={'Group Info'}
          />
        ),
        // ONCE YOU USE CUSTOM HEADER, MAKE SURE YOU SET HEADER LEFT AS NULL, TO PREVENT DEFAULT HEADER LEFT
        headerLeft: null,
      };
    },
  },
  GroupInviteScreen: {
    screen: UserListScreen,
    params: { isGroup: true },
    navigationOptions: ({ navigation }) => {
      return {
        header: (
          <CustomHeader
            navigation={navigation}
            isCard={true}
            title={'Select Member'}
          />
        ),
        // ONCE YOU USE CUSTOM HEADER, MAKE SURE YOU SET HEADER LEFT AS NULL, TO PREVENT DEFAULT HEADER LEFT
        headerLeft: null,
      };
    },
  },
  UserListScreen: {
    screen: UserListScreen,
    navigationOptions: ({ navigation }) => {
      return {
        header: (
          <CustomHeader
            navigation={navigation}
            isCard={true}
            title={'User List'}
          />
        ),
        // ONCE YOU USE CUSTOM HEADER, MAKE SURE YOU SET HEADER LEFT AS NULL, TO PREVENT DEFAULT HEADER LEFT
        headerLeft: null,
      };
    },
  },
  UserProfileScreen: {
    screen: UserProfileScreen,
    navigationOptions: ({ navigation }) => {
      return {
        header: (
          <CustomHeader
            navigation={navigation}
            isCard={true}
            title={'Profile'}
          />
        ),
        // ONCE YOU USE CUSTOM HEADER, MAKE SURE YOU SET HEADER LEFT AS NULL, TO PREVENT DEFAULT HEADER LEFT
        headerLeft: null,
      };
    },
  },
  ChatScreen: {
    screen: ChatScreen,
    navigationOptions: ({ navigation }) => {
      return {
        header: (
          <ChatHeader
            navigation={navigation}
          />
        ),
        // ONCE YOU USE CUSTOM HEADER, MAKE SURE YOU SET HEADER LEFT AS NULL, TO PREVENT DEFAULT HEADER LEFT
        headerLeft: null,
      };
    },
  }
}, {
  // Default config for all screens
  // headerMode: 'none',
  initialRouteName: 'ChannelListScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default createAppContainer(MainNav)
