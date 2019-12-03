import React from "react";
import { View, TouchableWithoutFeedback, StyleSheet, Text } from "react-native";

export default class Toolbar extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {this.props.renderLeftButton && this.props.renderLeftButton()}
        <TouchableWithoutFeedback
          style={styles.titleButton}
          onPress={this._onPress}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
            {this.props.renderMeta && this.props.renderMeta()}
          </View>
        </TouchableWithoutFeedback>
        {this.props.renderRightButton && this.props.renderRightButton()}
      </View>
    );
  }

  _onPress = () => {
    this.props.onPress && this.props.onPress();
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
  },
  titleButton: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 1,
  },
  title: {
    flex: 1,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'left',
    alignItems: 'center',
    color: '#362c33',
  },
});
