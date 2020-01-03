import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Styled, CustomFlatList } from 'react-native-awesome-component'
import { Text, KeyboardAvoidingView } from 'react-native'
import ChatInput from '../../Components/ChatInput'
import { isIphoneX } from 'react-native-iphone-x-helper'
import PubnubActions from '../../Redux/PubnubRedux'

class ChatScreen extends Component {
  constructor(props) {
    super(props)

    this.onPressSendMessage = this.onPressSendMessage.bind(this)
  }

  onPressSendMessage(message) {
    console.tron.error({ message })
  }

  render() {
    let keyboardAvoidingViewProps = {}
    if (Platform.OS === 'ios') {
      keyboardAvoidingViewProps = { behavior: 'padding', keyboardVerticalOffset: 64 }
    }

    return (
      <Styled.FlexContainer>
        <CustomFlatList
          data={[]}
          fetchFunction={() => null}
          meta={{ current_page: 1, next_page: null }}
          renderItem={({ item }) => console.tron.error({ item })}
          loading={false}
          error={false}
        />
        <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
          <ChatInput onSendMessage={this.onPressSendMessage} />
        </KeyboardAvoidingView>
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPubnubMessage: (params) => dispatch(PubnubActions.getPubnubMessageRequest(params)),
    sendPubnubMessage: (params) => dispatch(PubnubActions.sendPubnubMessageRequest(params)),
    sendPubnubTyping: (params) => dispatch(PubnubActions.sendPubnubTypingRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
