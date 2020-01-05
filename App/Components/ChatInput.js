import React, { useState, useEffect, Component } from 'react'
import { Styled } from 'react-native-awesome-component'
import { View, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../Themes';
import _ from 'lodash'

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    paddingBottom: getBottomSpace(),
    paddingHorizontal: 20,
    backgroundColor: Colors.snow,
    paddingTop: isIphoneX() ? 12 : 5,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    borderColor: Colors.steel,
    textAlignVertical: 'center',
    fontSize: 15
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

export const ChatInputContext = React.createContext({ message: '' })

const SubmitButton = (props) => {
  const { onPress } = props
  return (
    <ChatInputContext.Consumer>
      {({ message }) => {
        const disableSubmit = message.length <= 0
        return (
          <TouchableOpacity
            disabled={disableSubmit}
            style={[styles.sendButtonContainer, disableSubmit && styles.disableSendButton]} activeOpacity={0.8}
            onPress={() => onPress(message)}>
            <Icons name='paper-plane' size={18} color={Colors.snow} />
          </TouchableOpacity>
        )
      }}
    </ChatInputContext.Consumer>
  )
}

class StaticTextInput extends Component {
  textinputRef = undefined
  isTyping = false

  constructor(props) {
    super(props)
    this.onChangeMessage = _.debounce(this.onChangeMessage, 500)
  }

  onChangeMessage() {
    const { onEndTyping } = this.props
    this.isTyping = false
    if (typeof onEndTyping === 'function') {
      onEndTyping()
    }
  }

  render() {
    const { onChangeText, setRef, onStartTyping } = this.props
    return (
      <TextInput
        ref={r => {
          if (typeof setRef === 'function') {
            setRef(r)
          }
        }}
        placeholder='Enter Message'
        // value={message}
        onChangeText={(text) => {
          if (!this.isTyping) {
            this.isTyping = true
            if (typeof onStartTyping === 'function') {
              onStartTyping()
            }
          }
          if (typeof onChangeText === 'function') {
            onChangeText(text)
          }
          this.onChangeMessage()
        }}
        style={[styles.textInput]}
        multiline
        returnKeyLabel={'enter'}
      />
    )
  }
}

const ChatInput = (props) => {
  const { onSendMessage, onStartTyping, onEndTyping } = props

  let textinputRef = undefined

  const [message, setMessage] = useState('')

  function sendMessage() {
    if (typeof sendMessage === 'function') {
      onSendMessage(message)
    }
    textinputRef.clear()
    setMessage('')
  }

  function onChangeText(text) {
    setMessage(text)
  }

  return (
    <View style={[styles.textInputContainer]}>
      <ChatInputContext.Provider value={{ message }}>
        <StaticTextInput setRef={r => textinputRef = r} onChangeText={onChangeText} onStartTyping={onStartTyping} onEndTyping={onEndTyping} />
        <SubmitButton onPress={sendMessage} />
      </ChatInputContext.Provider>
    </View>
  )
}

export default ChatInput