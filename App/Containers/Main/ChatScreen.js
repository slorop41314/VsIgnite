import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Styled, CustomFlatList, Method } from 'react-native-awesome-component'
import { KeyboardAvoidingView, View, StyleSheet } from 'react-native'
import ChatInput from '../../Components/ChatInput'
import { isIphoneX } from 'react-native-iphone-x-helper'
import PubnubActions from '../../Redux/PubnubRedux'
import PubnubStoreActions from '../../Redux/PubnubStoreRedux'
import PubnubStrings from '../../Pubnub/PubnubStrings'
import { values } from 'ramda'
import MessageItem from '../../Components/MessageItem'

const styles = StyleSheet.create({
  itemSeparator: {
    height: 5
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
})

class ChatScreen extends Component {
  currentTimetoken = null
  constructor(props) {
    super(props)
    this.chatData = props.navigation.getParam('data')
    this.onPressSendMessage = this.onPressSendMessage.bind(this)
    this.onStartTyping = this.onStartTyping.bind(this)
    this.onEndTyping = this.onEndTyping.bind(this)
    this.fetchFunction = this.fetchFunction.bind(this)
  }

  componentDidMount() {
    const { getPubnubSpaceMemberRequest, resendQueueMessage } = this.props
    getPubnubSpaceMemberRequest({ spaceId: this.chatData.id })
    resendQueueMessage({ spaceId: this.chatData.id })
  }

  fetchFunction({ page }) {
    const { getMessageRequest } = this.props
    if (page === 1) {
      getMessageRequest({ limit: 150, channels: [this.chatData.id] })
    } else {
      if (page !== this.currentTimetoken) {
        this.currentTimetoken = page
        getMessageRequest({ limit: 150, channels: [this.chatData.id], start: page })
      }
    }
  }

  onPressSendMessage(type, message) {
    const { sendPubnubMessage, currentUser } = this.props
    if (type === PubnubStrings.message.type.text) {
      const params = {
        message: {
          type: PubnubStrings.message.type.text,
          text: message,
          user: currentUser,
        },
        channel: this.chatData.id,
        timetoken: new Date().valueOf() * 1e4,
        status: PubnubStrings.message.status.waiting
      }
      sendPubnubMessage(params)
    }

    if (type === PubnubStrings.message.type.images) {
      const params = {
        message: {
          type: PubnubStrings.message.type.images,
          image: message,
          user: currentUser,
        },
        channel: this.chatData.id,
        timetoken: new Date().valueOf() * 1e4,
        status: PubnubStrings.message.status.waiting
      }
      sendPubnubMessage(params)
    }
  }

  onStartTyping() {
    const { sendPubnubTyping } = this.props
    sendPubnubTyping({ channel: this.chatData.id, isTyping: true })
  }

  onEndTyping() {
    const { sendPubnubTyping } = this.props
    sendPubnubTyping({ channel: this.chatData.id, isTyping: false })
  }

  render() {
    const { messages } = this.props
    let meta = { current_page: null, next_page: null }
    let keyboardAvoidingViewProps = {}
    if (Platform.OS === 'ios') {
      keyboardAvoidingViewProps = { behavior: 'padding', keyboardVerticalOffset: isIphoneX() ? 64 : 74 }
    }

    if (messages.length > 2) {
      meta = { current_page: null, next_page: messages[messages.length - 1].timetoken }
    }

    return (
      <Styled.FlexContainer>
        <CustomFlatList
          data={messages}
          fetchFunction={this.fetchFunction}
          meta={meta}
          renderItem={({ item, index }) => {
            return <MessageItem isLast={index === (messages.length - 1)} isFirst={index === 0} data={item} />
          }}
          // loading={false}
          error={false}
          ItemSeparatorComponent={() => <View style={[styles.itemSeparator]} />}
          inverted
          contentContainerStyle={[styles.contentContainer, { paddingBottom: 0 }]}
          onRefresh={undefined}
          refreshing={undefined}
        />
        <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
          <ChatInput onSendMessage={this.onPressSendMessage} onStartTyping={this.onStartTyping} onEndTyping={this.onEndTyping} />
        </KeyboardAvoidingView>
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { navigation } = props
  const data = navigation.getParam('data')
  let messages = []
  if (state.pubnubStore.spaces[data.id] && state.pubnubStore.spaces[data.id].messages) {
    messages = values(state.pubnubStore.spaces[data.id].messages).sort(Method.Array.compareValues('timetoken', 'desc', true, true))
  }
  return {
    messages,
    currentUser: state.pubnubStore.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPubnubMessage: (params) => dispatch(PubnubActions.getPubnubMessageRequest(params)),
    sendPubnubMessage: (params) => dispatch(PubnubActions.sendPubnubMessageRequest(params)),
    sendPubnubTyping: (params) => dispatch(PubnubActions.sendPubnubTypingRequest(params)),
    getMessageRequest: (params) => dispatch(PubnubActions.getPubnubMessageRequest(params)),
    getPubnubSpaceMemberRequest: (params) => dispatch(PubnubActions.getPubnubSpaceMemberRequest(params)),
    resendQueueMessage: (params) => dispatch(PubnubStoreActions.resendQueueMessage(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
