import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import Instabug from 'instabug-reactnative'
import App from './App/Containers/App'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
Instabug.startWithToken('INSTABUG_APP_TOKEN', [
  Instabug.invocationEvent.shake,
]);
