import {createAppContainer} from 'react-navigation';
import MainScreen from '../Containers/MainScreen';
import {createStackNavigator} from 'react-navigation-stack';

import styles from './Styles/NavigationStyles';
import AddItemScreen from '../Containers/AddItemScreen';

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    MainScreen: {
      screen: MainScreen,
      navigationOptions: {
        title: 'Kerangjang Belanja',
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
    navigationOptions: {
      headerStyle: styles.header,
    },
  },
);

export default createAppContainer(PrimaryNav);
