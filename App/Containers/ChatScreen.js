import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, FlatList, Button, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ChatScreenStyle'
import { createOrGetMessageList, sendMessage } from '../Services/firestore-chat-engine/modules/message'
import { MessageItem } from '../Components/MessageItem'

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      message: 'Hello',
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
    sendMessage(channel, { message, attachments }, (msg) => console.log('MESSAGE SENT'))
  }

  render() {
    const { messages } = this.state
    console.log({ messages })
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <MessageItem data={item} />}
          contentContainerStyle={{ padding: 10 }}
        />
        <Button
          title='SEND MESSAGE'
          onPress={this.onPressSend}
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
