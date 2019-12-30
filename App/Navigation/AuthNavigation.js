import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../Containers/Auth/LoginScreen';

import styles from './Styles/NavigationStyles'
import RegisterScreen from '../Containers/Auth/RegisterScreen';
import { CustomHeader } from 'react-native-awesome-component';

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: () => {
      return {
        header: null
      }
    },
  },
  RegisterScreen: {
    screen: RegisterScreen,
    navigationOptions: ({ navigation }) => {
      return {
        header: <CustomHeader navigation={navigation} title={'Sign up'} />,
        headerLeft: null
      }
    },
  }
}, {
  // Default config for all screens
  // headerMode: 'none',
  initialRouteName: 'LoginScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default createAppContainer(PrimaryNav)
