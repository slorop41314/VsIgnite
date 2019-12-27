import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import ChannelListScreen from '../Containers/Main/ChannelListScreen';
import { CustomHeader } from 'react-native-awesome-component'

import styles from './Styles/NavigationStyles'

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
