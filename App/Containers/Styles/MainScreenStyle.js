import {StyleSheet, Platform} from 'react-native';
import {ApplicationStyles} from '../../Themes/';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {scale} from '../../Transforms/Scale';

export default StyleSheet.create({
  mainContainer: {
    ...ApplicationStyles.screen.mainContainer,
    paddingTop: scale(20),
  },
});
