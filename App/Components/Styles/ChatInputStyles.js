import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
    flexShrink: 0,
    flexGrow: 0,
    width: '100%',
    backgroundColor: 'white',
    height: 48,
    borderTopWidth: 0.5,
    borderColor: '#e8e8e8',
  },
  formButton: {
    flex: 0,
    height: 48,
    width: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formIcon: {
    width: 24,
    height: 24,
  },
  formTextField: {
    flex: 1,
    paddingHorizontal: 10,
  },
});