import React, { Component } from 'react'
import { TextInput, View, Text, TouchableOpacity } from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { Colors } from '../Themes'

class MessageInput extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { onPress, onChangeText, value } = this.props
    return (
      <View style={{ flexDirection: 'row', paddingBottom: getBottomSpace(), paddingHorizontal: 20, paddingTop: 10 }}>
        <TextInput
          placeholder={'type message'}
          style={{
            flex: 1,
            height: 40,
            backgroundColor: Colors.messageLeft,
            paddingHorizontal: 10,
            borderRadius: 10,
            fontSize: 15,
            color: Colors.coal
          }}
          onChangeText={onChangeText}
          value={value}
        />
        <TouchableOpacity
          disabled={value.length === 0}
          activeOpacity={0.8}
          onPress={onPress}
          style={{
            backgroundColor: value.length === 0 ? Colors.steel : Colors.messageRight,
            height: 40,
            paddingHorizontal: 20,
            justifyContent: 'center',
            borderRadius: 10,
            marginLeft: 10,
          }}
        >
          <Text style={{ color: Colors.snow, fontSize: 15 }}>SEND</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default MessageInput