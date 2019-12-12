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

class ChatInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }

    this.isTyping = false
    this.tempTyping = this.isTyping

    this.onChangeMessage = this.onChangeMessage.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChangeMessage(message) {
    const { room } = this.props
    this.setState({ message }, () => {
      // method to check typing and prevent send multiple typing status
      if (message.length > 0) {
        this.tempTyping = true
        if (this.tempTyping !== this.isTyping) {
          this.isTyping = this.tempTyping

          // do change typing status to true
          // const qiscusIntance = QiscusManager.getInstance()
          // qiscusIntance.publishTyping(1)
          const params = {
            "sender": "John Doe",
            "event": "writing document...",
            "active": "true"
          }
          QiscusManager.publishEvent(room.unique_id, params)
          QiscusManager.publishTyping(1)
        }
      } else {
        this.tempTyping = false
        if (this.tempTyping !== this.isTyping) {
          this.isTyping = this.tempTyping

          // do change typing status to false
          // const qiscusIntance = QiscusManager.getInstance()
          // qiscusIntance.publishTyping(0)
          const params = {
            "sender": "John Doe",
            "event": "writing document...",
            "active": "false"
          }
          QiscusManager.publishEvent(room.unique_id, params)
          QiscusManager.publishTyping(0)
        }
      }
    })
  }

  onSubmit() {
    console.tron.error('SUBMIT')
    const { message } = this.state
    this.setState({ message: '' }, () => {
      this.props.onSubmit(message);
    });
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
            style={styles.formTextField}
            placeholder="Type your message"
            returnKeyType="send"
            value={this.state.message}
            onChangeText={this.onChangeMessage}
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
