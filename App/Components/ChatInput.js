import React from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Images } from '../Themes'
import QiscusActions from '../Redux/QiscusRedux'
import { connect } from 'react-redux'
import styles from './Styles/ChatInputStyles'
import { isIphoneX } from 'react-native-iphone-x-helper';
import QiscusManager from '../Qiscus/QiscusManager';
import { debounce } from 'lodash'

class ChatInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }

    this.isTyping = false

    this.onChangeMessage = debounce(this.onChangeMessage.bind(this), 500)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChangeMessage(message) {
    this.setState({ message }, () => {
      this.isTyping = false
      console.tron.error('SET TYPING FALSE')
      QiscusManager.publishTyping(0)
    })
  }

  onSubmit() {
    console.tron.error('SUBMIT')
    const { message } = this.state
    if (this.textInput) {
      this.textInput.clear()
    }
    this.props.onSubmit(message);
  }

  render() {

    let keyboardAvoidingViewProps = {}

    if (Platform.OS === 'ios') {
      if (isIphoneX()) {
        keyboardAvoidingViewProps = { behavior: 'padding', keyboardVerticalOffset: 88 }
      } else {
        keyboardAvoidingViewProps = { behavior: 'padding', keyboardVerticalOffset: 64 }
      }
    }

    return (
      <KeyboardAvoidingView
        {...keyboardAvoidingViewProps}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.formButton}
            onPress={this.props.onSelectFile}
          >
            <Image
              style={styles.formIcon}
              source={Images.qiscusAttachment}
            />
          </TouchableOpacity>
          <TextInput
            ref={ref => this.textInput = ref}
            style={styles.formTextField}
            placeholder="Type your message"
            returnKeyType="send"
            // value={this.state.message}
            onChangeText={(text) => {
              if (!this.isTyping) {
                this.isTyping = true
                QiscusManager.publishTyping(1)
              }
              this.onChangeMessage(text)
            }}
            onSubmitEditing={this.onSubmit}
          />
          <TouchableOpacity
            onPress={this.onSubmit}
            style={styles.formButton}
          >
            <Image
              style={styles.formIcon}
              source={Images.qiscusSend}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput)
