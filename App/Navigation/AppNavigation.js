import React from 'react';
import { createAppContainer } from 'react-navigation'
import ExampleScreen from '../Containers/ExampleScreen'
import { createStackNavigator } from 'react-navigation-stack';
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'
import { CustomHeader } from 'react-native-awesome-component';

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  'Example Screen': { 
    screen: ExampleScreen,
    navigationOptions: ({ navigation }) => {
      return {
        header: <CustomHeader navigation={navigation} />,
        // ONCE YOU USE CUSTOM HEADER, MAKE SURE YOU SET HEADER LEFT AS NULL, TO PREVENT DEFAULT HEADER LEFT
        headerLeft: null,
      };
    },
   },
  LaunchScreen: { 
    screen: LaunchScreen, 
    navigationOptions: ({ navigation }) => {
      return {
        header: <CustomHeader navigation={navigation} />,
      }
    }
  }
}, {
  // Default config for all screens
  // headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  // navigationOptions: {
  //   headerStyle: styles.header
  // }
})

export default createAppContainer(PrimaryNav)
