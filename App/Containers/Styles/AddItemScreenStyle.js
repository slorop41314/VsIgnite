import {StyleSheet} from 'react-native';
import {ApplicationStyles, Colors} from '../../Themes/';
import {scale} from '../../Transforms/Scale';

export default StyleSheet.create({
  mainContainer: {
    ...ApplicationStyles.screen.mainContainer,
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowItem: {
    width: scale(178),
  },
  inputContainer: {
    paddingTop: scale(10),
    marginTop: scale(10),
    backgroundColor: Colors.snow,
    height: scale(65),
    justifyContent: 'center',
    borderRadius: scale(5),
    borderWidth: 1,
    paddingHorizontal: scale(10),
    borderColor: Colors.borderGrey,
  },
  inputStyle: {
    color: Colors.blackNavi,
    fontSize: scale(17),
    textAlignVertical: 'center',
  },
});
