import React from 'react';
import {View, Text} from 'react-native';

export default props => {
  const {total} = props;
  return (
    <View>
      <Text>{total}</Text>
    </View>
  );
};
