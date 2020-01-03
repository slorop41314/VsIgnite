import React, { useState, useEffect } from 'react'
import { Styled } from 'react-native-awesome-component'
import { View, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../Themes';
import _ from 'lodash'
import ChatInput from './ChatInput'

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    paddingBottom: getBottomSpace(),
    paddingHorizontal: 20,
    backgroundColor: Colors.snow,
    paddingVertical: 5,
  },
  textInput: {
    flex: 1, height: 45
  },
  sendButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.eggplant,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disableSendButton: {
    backgroundColor: Colors.steel,
  }
})

const ChatInputWrapper = (props) => {
  const { onSendMessage } = props

  const [message, setMessage] = useState('')

  function sendMessage(message) {
    if (typeof sendMessage === 'function') {
      onSendMessage(message)
    }

    setMessage('')
  }

  disableSubmit = message.length <= 0

  return (
    <View style={[styles.textInputContainer]}>
      <ChatInput
        onSubmitEditing={() => {
          if (!disableSubmit) {
            sendMessage
          }
        }}
        onChangeText={(text) => setMessage(text)}
      />
      <TouchableOpacity
        disabled={disableSubmit}
        style={[styles.sendButtonContainer, disableSubmit ? styles.disableSendButton : {}]} activeOpacity={0.8}
        onPress={() => sendMessage(message)}>
        <Icons name='paper-plane' size={18} color={Colors.snow} />
      </TouchableOpacity>
    </View>
  )
}

export default ChatInputWrapper