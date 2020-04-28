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
      height: 1,
    },
    shadowRadius: 2,
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
  countContainer: {
    position: 'absolute',
    zIndex: 100,
    height: scale(50),
    width: scale(50),
    borderRadius: scale(25),
    backgroundColor: Colors.snow,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
    top: -10,

    shadowColor: Colors.black50,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 2,
  },
  countText: {
    color: Colors.mainActive,
    fontSize: scale(18),
  },
});

export default props => {
  const {total, itemCount} = props;
  return (
    <View>
      {itemCount > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{itemCount}</Text>
        </View>
      )}
      <View style={styles.container}>
        <Text style={styles.textMain}>{NumToRp(total.toString(), 'Rp.')}</Text>
      </View>
    </View>
  );
};
