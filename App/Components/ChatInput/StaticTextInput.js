import React, { Component } from 'react'
import { TextInput, StyleSheet, View } from 'react-native';
import { Colors } from '../../Themes';
import _ from 'lodash'
import { ChatInputContext } from '.';

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 8,
    borderColor: Colors.steel,
    textAlignVertical: 'center',
    fontSize: 15,
  },
})

class StaticTextInput extends Component {
  textinputRef = undefined
  isTyping = false
  text = ''
  selectionPos = { end: 0, start: 0 }

  constructor(props) {
    super(props)
    this.handleTyping = _.debounce(this.handleTyping, 500)
    this.onChangeText = this.onChangeText.bind(this)
  }

  handleTyping() {
    const { onEndTyping } = this.props
    this.isTyping = false
    if (typeof onEndTyping === 'function') {
      onEndTyping()
    }
  }

  onChangeText(text) {
    const { onChangeText, onStartTyping } = this.props

    if (!this.isTyping) {
      this.isTyping = true
      if (typeof onStartTyping === 'function') {
        onStartTyping()
      }
    }
    if (typeof onChangeText === 'function') {
      onChangeText(text)
    }
    this.handleTyping()
  }

  render() {
    const { setRef, onSelectionChange } = this.props
    return (
      <ChatInputContext.Consumer>
        {({ message }) => {
          return (
            <TextInput
              ref={r => {
                if (typeof setRef === 'function') {
                  setRef(r)
                }
              }}
              placeholder='Enter Message'
              value={message}
              onChangeText={this.onChangeText}
              style={[styles.textInput]}
              multiline
              returnKeyLabel={'enter'}
              enablesReturnKeyAutomatically={true}
              onSelectionChange={onSelectionChange}
            />
          )
        }}
      </ChatInputContext.Consumer>
    )
  }
}

export default StaticTextInput