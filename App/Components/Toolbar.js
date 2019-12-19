import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, Text, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export default class Toolbar extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {this.props.renderLeftButton && this.props.renderLeftButton()}
        <TouchableWithoutFeedback
          style={styles.titleButton}
          onPress={this.onPress}
        >
          <View style={styles.titleContainer}>
            {this.props.renderIcon && this.props.renderIcon()}
            <Text numberOfLines={1} style={styles.title}>
              {this.props.title}
            </Text>
            {this.props.renderMeta && this.props.renderMeta()}
          </View>
        </TouchableWithoutFeedback>
        {this.props.renderRightButton && this.props.renderRightButton()}
      </View>
    );
  }

  onPress = () => {
    this.props.onPress && this.props.onPress();
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingTop: 10 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0),
    elevation: 5,
  },
  titleButton: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    color: '#262626',
    textAlignVertical: 'center',
  },
});
