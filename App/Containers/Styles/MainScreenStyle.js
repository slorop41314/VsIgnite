import {StyleSheet, Platform} from 'react-native';
import {ApplicationStyles, Colors} from '../../Themes/';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {scale} from '../../Transforms/Scale';

export default StyleSheet.create({
  mainContainer: {
    ...ApplicationStyles.screen.mainContainer,
    paddingTop:
      Platform.select({ios: getStatusBarHeight(), android: 0}) + scale(20),
  },
  emptyText: {
    fontFamily: 'Galvji',
    fontSize: scale(23),
    color: Colors.black50,
    textAlign: 'center',
  },
});
