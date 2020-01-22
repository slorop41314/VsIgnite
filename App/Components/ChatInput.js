import React, { useState, useEffect, Component } from 'react'
import { Styled } from 'react-native-awesome-component'
import { View, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../Themes';
import _ from 'lodash'
import ImagePicker from 'react-native-image-crop-picker';
import PubnubStrings from '../Pubnub/PubnubStrings';
import Modal from 'react-native-modal'

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    paddingBottom: isIphoneX() ? getBottomSpace() : 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.snow,
    paddingTop: isIphoneX() ? 12 : 5,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 5,
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
  },
  addImageContainer: {
    backgroundColor: Colors.eggplant,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 4
  },
  plusButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.eggplant,
    justifyContent: 'center',
    alignItems: 'center'
  },

  additionalContainer: {
    backgroundColor: Colors.snow,
    borderRadius: 10,
  },
  additionalRow: {
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    paddingHorizontal: 10,
  },
  additionalRowTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: Colors.eggplant,
    marginLeft: 10,
  },
  additionalRowCancel: {
    backgroundColor: Colors.snow,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row'
  },
  additionalRowTitleCancel: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.error
  }
})

export const ChatInputContext = React.createContext({ message: '' })

const SubmitButton = (props) => {
  const { onPress } = props
  function onPressMic() {

  }

  return (
    <ChatInputContext.Consumer>
      {({ message }) => {
        const disableSubmit = message.length <= 0
        if (disableSubmit) {
          return (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.sendButtonContainer} activeOpacity={0.8}
                onPress={onPressMic}
              >
                <Icons name='microphone' size={20} color={Colors.snow} />
              </TouchableOpacity>
            </View>
          )
        } else {
          return (
            <TouchableOpacity
              style={[styles.sendButtonContainer]} activeOpacity={0.8}
              onPress={() => onPress(PubnubStrings.message.type.text, message)}>
              <Icons name='paper-plane' size={18} color={Colors.snow} />
            </TouchableOpacity>
          )
        }
      }}
    </ChatInputContext.Consumer>
  )
}

const OPTIONS = {
  video: 'video',
  photo: 'photo',
  lib: 'lib',
  doc: 'doc',
  null: null,
}

const FILE_TYPE = {
  video: 'video',
  image: 'image',
}

class PlusButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }

    this.onPressPhoto = this.onPressPhoto.bind(this)
    this.onPressVideo = this.onPressVideo.bind(this)
    this.onPressLib = this.onPressLib.bind(this)
    this.onPressDoc = this.onPressDoc.bind(this)
    this.onPressCancel = this.onPressCancel.bind(this)
    this.handleOption = this.handleOption.bind(this)
  }

  selectedOption = null

  onPressPhoto() {
    this.selectedOption = OPTIONS.photo
    this.setState({ visible: false })
  }

  onPressVideo() {
    this.selectedOption = OPTIONS.video
    this.setState({ visible: false })
  }

  onPressLib() {
    this.selectedOption = OPTIONS.lib
    this.setState({ visible: false })
  }

  onPressDoc() {
    this.selectedOption = OPTIONS.doc
    this.setState({ visible: false })
  }

  onPressCancel() {
    this.selectedOption = OPTIONS.null
    this.setState({ visible: false })
  }

  _getFileTypeByMime(mimeType) {
    if (mimeType.includes(FILE_TYPE.video)) {
      return PubnubStrings.message.type.video
    }

    if (mimeType.includes(FILE_TYPE.image)) {
      return PubnubStrings.message.type.image
    }

    return null
  }

  handleOption() {
    const { onSubmit } = this.props
    switch (this.selectedOption) {
      case 'video': {
        ImagePicker.openCamera({
          mediaType: 'video',
          multiple: true
        }).then(response => {
          onSubmit(this._getFileTypeByMime(response.mime), response)
        }).catch((error) => {
          console.tron.error({ error })
        })
        break
      }
      case 'photo': {
        ImagePicker.openCamera({
          mediaType: 'photo',
          multiple: true
        }).then(response => {
          onSubmit(this._getFileTypeByMime(response.mime), response)
        }).catch((error) => {
          console.tron.error({ error })
        })
        break
      }
      case 'lib': {
        ImagePicker.openPicker({
          mediaType: 'any',
          multiple: true
        }).then(response => {
          response.map((item) => {
            onSubmit(this._getFileTypeByMime(item.mime), item)
          })
        }).catch((error) => {
          console.tron.error({ error })
        })
        break
      }
      case 'doc': {

        break;
      }
    }
  }

  render() {
    const { visible } = this.state
    return (
      <View>
        <Modal
          isVisible={visible}
          onBackButtonPress={() => this.setState({ visible: false })}
          onBackdropPress={() => this.setState({ visible: false })}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          swipeDirection={['down']}
          style={{ justifyContent: 'flex-end' }}
          onModalHide={() => setTimeout(this.handleOption, 100)}
        >
          <View>
            <View style={styles.additionalContainer}>
              <TouchableOpacity style={[styles.additionalRow]} activeOpacity={0.8} onPress={this.onPressPhoto}>
                <Icons name='camera' size={20} color={Colors.eggplant} />
                <Text style={styles.additionalRowTitle}>Take picture</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.additionalRow]} activeOpacity={0.8} onPress={this.onPressVideo}>
                <Icons name='video' size={20} color={Colors.eggplant} />
                <Text style={styles.additionalRowTitle}>Take video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.additionalRow]} activeOpacity={0.8} onPress={this.onPressLib}>
                <Icons name='images' size={20} color={Colors.eggplant} />
                <Text style={styles.additionalRowTitle}>Select photo / video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.additionalRow]} activeOpacity={0.8} onPress={this.onPressDoc}>
                <Icons name='file' size={20} color={Colors.eggplant} />
                <Text style={styles.additionalRowTitle}>Documents</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.additionalRowCancel]} activeOpacity={0.8} onPress={this.onPressCancel}>
              <Text style={styles.additionalRowTitleCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.plusButtonContainer} activeOpacity={0.8}
          onPress={() => this.setState({ visible: true })}
        >
          <Icons name='plus' size={20} color={Colors.snow} />
        </TouchableOpacity>
      </View>
    )
  }
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

  function sendMessage(type, data) {

    if (typeof sendMessage === 'function') {
      onSendMessage(type, data)
    }

    if (type === PubnubStrings.message.type.text) {
      textinputRef.clear()
      setMessage('')
    }
  }

  function onChangeText(text) {
    setMessage(text)
  }

  return (
    <View style={[styles.textInputContainer]}>
      <ChatInputContext.Provider value={{ message }}>
        <PlusButton onSubmit={sendMessage} />
        <StaticTextInput setRef={r => textinputRef = r} onChangeText={onChangeText} onStartTyping={onStartTyping} onEndTyping={onEndTyping} />
        <SubmitButton onPress={sendMessage} />
      </ChatInputContext.Provider>
    </View>
  )
}

export default ChatInput