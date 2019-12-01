import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, FlatList, Button, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import FireEngineActions from '../Redux/FireEngineRedux'

// Styles
import styles from './Styles/ChatScreenStyle'
import MessageItem from '../Components/MessageItem'
import MessageInput from '../Components/MessageInput'
import { arrayEqual } from '../Services/firestore-chat-engine/helper'

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      attachments: ['http://rahmatzulfikri.xyz/images/avatar.jpg']
    }
    this.onPressSend = this.onPressSend.bind(this)
    this.channel = props.navigation.getParam('channel')
  }

  componentDidMount() {
  }

  onPressSend() {
    const { sendMessageRequest } = this.props
    const { message, attachments } = this.state
    this.setState({
      message: '',
    }, () => {
      sendMessageRequest({ channel: this.channel, message: { message, attachments } })
    })
  }

  render() {
    const { message } = this.state
    const { messages } = this.props
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <MessageItem data={item} channel={this.channel} />}
          contentContainerStyle={{ padding: 10 }}
        />
        <MessageInput
          onPress={this.onPressSend}
          onChangeText={(message) => this.setState({ message })}
          value={message}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { navigation } = props
  const channel = navigation.getParam('channel')
  let messages = []
  const stateMessages = state.fireEngine.messageList
  if (stateMessages[channel.uuid]) {
    messages = stateMessages[channel.uuid]
  }
  return {
    messages,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessageRequest: (params) => dispatch(FireEngineActions.sendMessageRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
