import React, { Component } from 'react'
import { View, StyleSheet, } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import { Colors } from '../../Themes';
import _ from 'lodash'
import PubnubStrings from '../../Pubnub/PubnubStrings';
import { checkOrGetUrlFromString, stringInsertAndReplace } from '../../Lib/Helper'
import UrlPreview from './UrlPreview';
import MentionList from './MentionList';
import PlusButton from './PlusButton';
import StaticTextInput from './StaticTextInput';
import SubmitButton from './SubmitButton';

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    paddingBottom: isIphoneX() ? getBottomSpace() : 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.snow,
    paddingTop: isIphoneX() ? 12 : 5,
  }
})

export const ChatInputContext = React.createContext({ message: '' })
const MENTION_TRIGGER = "@"

class ChatInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      urlPreview: undefined,
      hidePreview: false,
      showMentions: true,
      mentions: {},
      mentionKey: '',
    }

    this.sendMessage = this.sendMessage.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.checkMessageIfUrlExist = _.debounce(this.checkMessageIfUrlExist.bind(this), 500)
    this.checkMessageIfMentionExist = _.debounce(this.checkMessageIfMentionExist.bind(this), 500)
    this.onClosePreview = this.onClosePreview.bind(this)
    this.onSelectMention = this.onSelectMention.bind(this)
    this.onSelectionChange = this.onSelectionChange.bind(this)
  }

  textinputRef = undefined
  textSelection = { end: 0, start: 0 }
  textValue = ''
  mentionPos = null
  mentionStartPos = null
  mentionEndPos = null

  sendMessage(type, data) {
    const { onSendMessage } = this.props

    if (typeof onSendMessage === 'function') {
      onSendMessage(type, data)
    }

    if (type === PubnubStrings.message.type.text) {
      textinputRef.clear()
      this.setState({ message: '', urlPreview: undefined, hidePreview: false })
    }
  }

  onChangeText(message) {
    nextMessage = message
    prevMessage = this.state.message
    let { showMentions, mentionKey } = this.state

    if (nextMessage !== prevMessage) {
      if (nextMessage.length > prevMessage.length) {
        const difLength = nextMessage.length - prevMessage.length

        if (difLength > 1) {
          console.tron.error('TEXT ADDED FROM CLIPBOARD')
        } else {
          console.tron.error('TEXT ADDED FROM KEYBOARD')
          const lastCharIndex = nextMessage.length - 1
          const lastChar = nextMessage.charAt(lastCharIndex)

          // add mention keyword to search
          if (showMentions) {
            const { end, start } = this.textSelection
            if (end === start) {
              mentionKey = nextMessage.substring(this.mentionStartPos, end - 1)
            }
          }

          if (lastChar === MENTION_TRIGGER) {
            // SHOW MENTION LIST
            showMentions = true
            this.mentionPos = lastCharIndex
            this.mentionStartPos = nextMessage.length
            mentionKey = ''
          }
        }

      } else {
        console.tron.error('TEXT DELETED')

        const difLength = nextMessage.length - prevMessage.length

        if (difLength > 1) {
          console.tron.error('TEXT DELETED FROM SELECTION')
        } else {
          console.tron.error('TEXT DELETED FROM KEYBOARD')
          const lastCharIndex = prevMessage.length - 1
          const lastChar = prevMessage.charAt(lastCharIndex)

          // add mention keyword to search
          if (showMentions) {
            const { end, start } = this.textSelection
            if (end === start) {
              mentionKey = prevMessage.substring(this.mentionStartPos, end - 1)
            }
          }

          if (lastChar === MENTION_TRIGGER) {
            // HIDE MENTION LIST
            showMentions = false
            this.mentionPos = null
            this.mentionStartPos = null
            mentionKey = ''
          }
        }
      }
    }

    this.setState({ message, showMentions, mentionKey }, () => {
      if (message.length > 0) {
        this.checkMessageIfUrlExist(message)
        this.checkMessageIfMentionExist(message)
      }
    })
  }

  checkMessageIfUrlExist(message) {
    checkOrGetUrlFromString(message).then(res => {
      const { urlPreview } = this.state
      if (res.hasPreview) {
        if (urlPreview) {
          if (JSON.stringify(urlPreview) !== JSON.stringify(res.preview)) {
            this.setState({ urlPreview: res.preview, hidePreview: false })
          }
        } else {
          this.setState({ urlPreview: res.preview, hidePreview: false })
        }
      } else {
        this.setState({ urlPreview: undefined, hidePreview: false })
      }
    })
  }

  checkMessageIfMentionExist() {
    console.tron.error('HELLO CHECK MENTION')
  }

  onClosePreview() {
    this.setState({ hidePreview: true })
  }

  onSelectMention(user) {
    let { message } = this.state
    message = stringInsertAndReplace(message, `${user.name} `, this.mentionStartPos, this.textSelection.end)

    this.mentionStartPos = null
    this.mentionPos = null


    console.tron.error({ message })

    this.setState({
      showMentions: false,
      message,
      mentionKey: '',
      mentions: {
        ...this.state.mentions,
        [user.id]: user
      }
    })
  }

  onSelectionChange({ nativeEvent: { selection: { start, end } } }) {
    let { message, showMentions, mentionKey } = this.state
    if (start === end && this.state.message.length > 0) {
      const selectionPos = end

      if (selectionPos < this.mentionStartPos) {
        showMentions = false
        this.mentionStartPos = null
        this.mentionPos = null
        mentionKey = ''

        this.setState({ showMentions, mentionKey })
      }

      if (message.charAt(selectionPos - 1) === MENTION_TRIGGER) {
        showMentions = true
        this.mentionPos = selectionPos - 1
        this.mentionStartPos = selectionPos
        mentionKey = ''
        this.setState({ showMentions, mentionKey })
      }
    }

    this.textSelection = { start, end }
  }

  render() {
    const { onStartTyping, onEndTyping, channel } = this.props
    const { message, urlPreview, hidePreview, showMentions, mentionKey } = this.state
    return (
      <View>
        {urlPreview && !hidePreview && <UrlPreview data={urlPreview} onClose={this.onClosePreview} />}
        {showMentions && <MentionList channel={channel} onSelect={this.onSelectMention} search={mentionKey} />}
        <View style={[styles.textInputContainer]}>
          <ChatInputContext.Provider value={{ message }}>
            <PlusButton onSubmit={this.sendMessage} />
            <StaticTextInput setRef={r => textinputRef = r} onChangeText={this.onChangeText} onSelectionChange={this.onSelectionChange} onStartTyping={onStartTyping} onEndTyping={onEndTyping} />
            <SubmitButton onPress={this.sendMessage} />
          </ChatInputContext.Provider>
        </View>
      </View>
    )
  }
}

export default ChatInput