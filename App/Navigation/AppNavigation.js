import {createAppContainer} from 'react-navigation';
import MainScreen from '../Containers/MainScreen';
import {createStackNavigator} from 'react-navigation-stack';

import styles from './Styles/NavigationStyles';
import AddItemScreen from '../Containers/AddItemScreen';
import {scale} from '../Transforms/Scale';
import {Colors, Images} from '../Themes';

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    MainScreen: {
      screen: MainScreen,
      navigationOptions: {
        // title: 'Kerangjang Belanja',
        headerShown: false,
      },
    },
    AddItemScreen: {
      screen: AddItemScreen,
      params: {
        type: 'add',
      },
      navigationOptions: {
        title: 'Tambah Barang',
        headerBackTitle: 'Kembali',
      },
    },
    EditItemScreen: {
      screen: AddItemScreen,
      params: {
        type: 'edit',
      },
      navigationOptions: {
        title: 'Edit Barang',
        headerBackTitle: 'Kembali',
      },
    },
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteName: 'MainScreen',
    defaultNavigationOptions: {
      headerTitleStyle: {
        fontFamily: 'Galvji',
        fontSize: scale(17),
        color: Colors.blackNavi,
      },
      headerBackTitleStyle: {
        fontFamily: 'Galvji',
        fontSize: scale(15),
        color: Colors.mainActive,
      },
      headerTintColor: Colors.mainActive,
    },
  },
);

export default createAppContainer(PrimaryNav);
