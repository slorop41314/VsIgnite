import React, { useState, useEffect, Component } from 'react'
import { Styled } from 'react-native-awesome-component'
import { View, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../Themes';
import _ from 'lodash'
import ImagePicker from 'react-native-image-crop-picker';
import PubnubStrings from '../Pubnub/PubnubStrings';
import Modal from 'react-native-modal'
import { checkOrParseString2Url, getUrlFromText, checkOrGetUrlFromString } from '../Lib/Helper'

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

const urlPreviewStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    alignItems: 'center'
  },
  imageContainer: {

  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  closeAction: {
    marginLeft: 10,
  },
  titlePreview: {
    color: Colors.coal,
    fontSize: 16,
  },
  descPreview: {
    color: Colors.coal,
    fontSize: 14,
  },
  urlPreview: {
    color: Colors.link,
    fontSize: 12,
  },
})

class UrlPreview extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const thisData = this.props.data
    const nextData = nextProps.data

    return JSON.stringify(thisData) !== JSON.stringify(nextData)
  }

  render() {
    const { data, onClose } = this.props
    const { url, title, description, images } = data
    return (
      <Styled.Container padded isCard style={urlPreviewStyles.container}>
        <View>
          {(images.length > 0) && (
            <Image source={{ uri: images[0] }} style={urlPreviewStyles.imagePreview} />
          )}
        </View>
        <View style={urlPreviewStyles.contentContainer}>
          {(title !== undefined) && <Text numberOfLines={1} ellipsizeMode={'tail'} style={urlPreviewStyles.titlePreview}>{title}</Text>}
          {(description !== undefined) && <Text numberOfLines={2} ellipsizeMode={'tail'} style={urlPreviewStyles.descPreview}>{description}</Text>}
          {(url !== undefined) && <Text numberOfLines={1} ellipsizeMode={'tail'} style={urlPreviewStyles.urlPreview}>{url}</Text>}
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={urlPreviewStyles.closeAction}>
          <Icons name='times-circle' color={Colors.eggplant} size={20} />
        </TouchableOpacity>
      </Styled.Container>
    )
  }
}

class ChatInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      urlPreview: undefined,
      hidePreview: false,
    }

    this.sendMessage = this.sendMessage.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.checkMessageIfUrlExist = _.debounce(this.checkMessageIfUrlExist.bind(this), 500)
    this.checkMessageIfMentionExist = _.debounce(this.checkMessageIfMentionExist.bind(this), 500)
    this.onClosePreview = this.onClosePreview.bind(this)
  }

  textinputRef = undefined

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
    this.setState({ message }, () => {
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

  render() {
    const { onStartTyping, onEndTyping } = this.props
    const { message, urlPreview, hidePreview } = this.state
    return (
      <View>
        {urlPreview && !hidePreview && <UrlPreview data={urlPreview} onClose={this.onClosePreview} />}
        <View style={[styles.textInputContainer]}>
          <ChatInputContext.Provider value={{ message }}>
            <PlusButton onSubmit={this.sendMessage} />
            <StaticTextInput setRef={r => textinputRef = r} onChangeText={this.onChangeText} onStartTyping={onStartTyping} onEndTyping={onEndTyping} />
            <SubmitButton onPress={this.sendMessage} />
          </ChatInputContext.Provider>
        </View>
      </View>
    )
  }
}

export default ChatInput