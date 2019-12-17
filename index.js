import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import {name as appName} from './app.json';
import BackgroundMessanging from './App/FIrebase/BackgroundMessanging'

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => BackgroundMessanging);