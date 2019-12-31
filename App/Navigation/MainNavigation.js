import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import ChannelListScreen from '../Containers/Main/ChannelListScreen';
import { CustomHeader } from 'react-native-awesome-component'

import styles from './Styles/NavigationStyles'
import UserProfileScreen from '../Containers/Main/UserProfileScreen';
import UserListScreen from '../Containers/Main/UserListScreen';
import GroupCreateScreen from '../Containers/Main/GroupCreateScreen';

// Manifest of possible screens
const MainNav = createStackNavigator({
  ChannelListScreen: {
    screen: ChannelListScreen,
    navigationOptions: ({ navigation }) => {
      return {
        header: (
          <CustomHeader
            navigation={navigation}
            isCard={true}
          />
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
