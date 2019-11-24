import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, FlatList, Button, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ChatScreenStyle'
import { createOrGetMessageList, sendMessage } from '../Services/firestore-chat-engine/modules/message'
import { MessageItem } from '../Components/MessageItem'
import MessageInput from '../Components/MessageInput'

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      message: '',
      attachments: ['http://rahmatzulfikri.xyz/images/avatar.jpg']
    }
    this.onPressSend = this.onPressSend.bind(this)
  }

  componentDidMount() {
    const { navigation } = this.props
    const channel = navigation.getParam('channel')
    createOrGetMessageList(channel, (messages) => this.setState({ messages }))
  }

  onPressSend() {
    const { navigation } = this.props
    const { message, attachments } = this.state
    const channel = navigation.getParam('channel')
    this.setState({
      message: '',
    }, () => {
      sendMessage(channel, { message, attachments }, (msg) => console.log('MESSAGE SENT'))
    })
  }

  render() {
    const { messages, message } = this.state
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <MessageItem data={item} />}
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

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
