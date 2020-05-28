import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Method} from 'react-native-awesome-component';
import {Colors} from '../../Themes';
import NumToRp from '../../Transforms/NumToRp';
import {scale} from '../../Transforms/Scale';

const styles = StyleSheet.create({
  container: {
    height: scale(112),
    width: scale(377),
    backgroundColor: Colors.mainActive,
    borderRadius: scale(8),
    shadowColor: Colors.black50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: scale(20),
  },
  textMain: {
    color: Colors.snow,
    fontSize: scale(45),
  },
});

export default props => {
  const {total} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.textMain}>{NumToRp(total.toString(), 'Rp.')}</Text>
    </View>
  );
};
