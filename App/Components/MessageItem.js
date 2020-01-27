import React, { Component, PureComponent } from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image, Linking } from 'react-native'
import PubnubStrings from '../Pubnub/PubnubStrings'
import { connect } from 'react-redux'
import { Colors } from '../Themes'
import moment from 'moment'
import { convertTimestampToDate, getMessageStatusByActions, isSingleChat } from '../Pubnub/PubnubHelper'
import Icons from 'react-native-vector-icons/FontAwesome5'
import PubnubManager from '../Pubnub/PubnubManager'
import PubnubActions from '../Redux/PubnubRedux'
import ImagePreview from './ImagePreview'
import { PlaceholderImage, Method } from 'react-native-awesome-component'
import R from 'ramda'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { isLocalFileExist, silentDownload, getLocalFileFromUrl } from '../Lib/DownloadHelper'
import PubnubStoreActions from '../Redux/PubnubStoreRedux'
import ProgressCircle from 'react-native-progress-circle'
import Video from 'react-native-video';
import VideoPreview from './VideoPreview'
import { getUrlsFromString, generateTextWithLinkCompoent } from '../Lib/Helper'

const { width, height } = Dimensions.get('window')

const imageWidth = width * 0.5

const styles = StyleSheet.create({
  container: (isMe) => {
    return {
      flexDirection: 'row',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      alignItems: 'center',
    }
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.cloud
  },
  othetMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.eggplant
  },
  messageText: {
    fontSize: 13,
  },
  myMessageText: {
    color: Colors.charcoal
  },
  otherMessageText: {
    color: Colors.snow
  },
  dateText: {
    marginTop: 5,
    fontSize: 10,
  },
  dateOther: {
    color: Colors.snow
  },
  dateMe: {
    textAlign: 'right',
    color: Colors.charcoal
  },
  dateSeparatorContainer: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: Colors.charcoal,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: Colors.snow
  },
  timeContainer: {
    flexDirection: 'row',
  },
  timeContainerMe: {
    alignSelf: 'flex-end'
  },
  timeContainerOther: {
    alignSelf: 'flex-start'
  },
  iconCheck: {
    marginTop: 5,
    marginLeft: 5
  },
  groupUserName: {
    fontWeight: 'bold',
    color: Colors.snow,
    marginBottom: 3,
  },
  imageContainer: {
    // height: imageWidth
  },
  resend: {
    backgroundColor: Colors.eggplant,
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  resendBig: {
    backgroundColor: Colors.eggplant,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEmptyContainer: {
    width: imageWidth,
    height: imageWidth,
    backgroundColor: Colors.steel,
    justifyContent: 'center',
    alignItems: 'center'
  },
  urlPreviewContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
  },
  urlPreviewImage: {
    width: 50, height: 50, borderRadius: 5
  },
  urlPreviewTitle: {
    fontSize: 14,
    color: Colors.coal
  },
  urlPreviewDesc: {
    fontSize: 12,
    color: Colors.coal
  },
  urlPreviewLink: {
    fontSize: 10,
    color: Colors.link
  },
  textHyperlink: {
    color: Colors.link
  }
})

let currentMessageTimetoken = undefined

function _isSameDay(timetoken) {
  let status, prev, next
  if (currentMessageTimetoken === undefined) {
    currentMessageTimetoken = timetoken
    status = true
    prev = undefined
    next = timetoken
  } else {
    const prevTimetokenDate = moment(convertTimestampToDate(currentMessageTimetoken)).format('DD/MM/YYYY')
    const curTimeTokenDate = moment(convertTimestampToDate(timetoken)).format('DD/MM/YYYY')
    if (prevTimetokenDate !== curTimeTokenDate) {
      status = false
      prev = currentMessageTimetoken
      currentMessageTimetoken = timetoken
      next = currentMessageTimetoken
    } else {
      status = true
      prev = currentMessageTimetoken
      next = timetoken
    }
  }

  return {
    status, prev, next
  }
}

export class MessageItem extends Component {
  hasRead = false
  hasReceipt = false

  constructor(props) {
    super(props)
    this.state = {
      activeVideo: false
    }

    this.checkAndUpdateActions = this.checkAndUpdateActions.bind(this)
    this.checkAndDownloadLocalImageMessage = this.checkAndDownloadLocalImageMessage.bind(this)
    this.onPressResend = this.onPressResend.bind(this)
    this.getTextMessageContent = this.getTextMessageContent.bind(this)

  }

  componentDidMount() {
    const { data } = this.props
    const { timetoken, actions, channel, status } = data
    this.checkAndUpdateActions(channel, PubnubStrings.message.type.receipt, timetoken, PubnubStrings.event.value.delivered, actions, status)
    this.checkAndUpdateActions(channel, PubnubStrings.message.type.receipt, timetoken, PubnubStrings.event.value.read, actions, status)
  }

  async checkAndDownloadLocalImageMessage(data) {
    const { putLocalImageMessage } = this.props
    const { message, status } = data

    if ((status === PubnubStrings.message.status.waiting) || (status === PubnubStrings.message.status.failure)) return

    try {
      if (message) {
        if (message.type === PubnubStrings.message.type.image) {
          let { image, localPath } = message
          if (localPath === undefined) {
            const isExist = await isLocalFileExist(image)
            if (isExist) {
              localPath = getLocalFileFromUrl(image)
            } else {
              localPath = await silentDownload(image)
            }

            putLocalImageMessage({ message: data, localPath })
          } else {
            const isExist = await isLocalFileExist(image)
            if (!isExist) {
              localPath = await silentDownload(image)
              putLocalImageMessage({ message: data, localPath })
            }
          }
        }
      }
    } catch (error) {
      console.tron.error('FAILED TO PUT LOCAL IMAGE MESSAGE')
      console.tron.error({ error })
    }
  }

  checkAndUpdateActions(channel, actiontype, timetoken, value, actions, status) {
    if ((status === PubnubStrings.message.status.waiting) || (status === PubnubStrings.message.status.failure)) return

    const { updatePubnubMessageRequest, currentUser } = this.props
    const params = {
      channel, timetoken, actiontype, value
    }

    if (actions) {
      if (actions[actiontype]) {
        if (actions[actiontype][value]) {
          const isExist = actions[actiontype][value].find((action) => action.uuid === currentUser.id)
          if (!isExist) {
            updatePubnubMessageRequest(params)
          }
        } else {
          updatePubnubMessageRequest(params)
        }
      }
    } else {
      updatePubnubMessageRequest(params)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props

    let thisMessage = undefined
    let nextMessage = undefined

    let thisActions = undefined
    let nextActions = undefined

    let thisStatus = undefined
    let nextStatus = undefined

    let thisUpload = undefined
    let nextUpload = undefined

    const { data, currentUser, isLast, isFirst, members } = nextProps
    const { message, timetoken, actions, channel, status } = data

    if (thisProps.data && thisProps.data.message) thisMessage = thisProps.data.message
    if (nextProps.data && nextProps.data.message) nextMessage = nextProps.data.message

    if (thisProps.data && thisProps.data.actions) thisActions = thisProps.data.actions
    if (nextProps.data && nextProps.data.actions) nextActions = nextProps.data.actions

    if (thisProps.data && thisProps.data.status) thisStatus = thisProps.data.status
    if (nextProps.data && nextProps.data.status) nextStatus = nextProps.data.status

    if (thisProps.data && thisProps.data.upload) thisUpload = thisProps.data.upload
    if (nextProps.data && nextProps.data.upload) nextUpload = nextProps.data.upload

    let shouldUpdate = true

    if (JSON.stringify(thisMessage) === JSON.stringify(nextMessage)) {
      shouldUpdate = false

      if (JSON.stringify(thisActions) !== JSON.stringify(nextActions)) {
        shouldUpdate = true
      }

      if (thisStatus !== nextStatus) {
        shouldUpdate = true
      }

      if (thisUpload && nextUpload && (JSON.stringify(thisUpload) !== JSON.stringify(nextUpload))) {
        shouldUpdate = true
      }

    } else {
      if (isFirst) {
        this.checkAndUpdateActions(channel, PubnubStrings.message.type.receipt, timetoken, PubnubStrings.event.value.read, nextActions, status)
      }
    }

    this.checkAndDownloadLocalImageMessage(nextProps.data)

    return shouldUpdate
  }

  onPressResend() {
    const { data, sendPubnubMessage } = this.props
    sendPubnubMessage({ ...data, status: PubnubStrings.message.status.waiting })
  }

  getTextMessageContent(isMe, message) {
    const urls = getUrlsFromString(message.text)
    if (urls.length > 0) {
      const { preview, text } = message
      const { url, title, description, images } = preview

      const mainText = <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]} />
      const linkText = <Text style={{ color: Colors.link }} />
      const styledMessage = generateTextWithLinkCompoent(mainText, linkText, text)

      return (
        <View>
          {preview && (
            <TouchableOpacity
              style={styles.urlPreviewContainer}
              activeOpacity={0.8}
              onPress={() => {
                Linking.openURL(url);
              }}
            >
              {images.length > 0 && <Image source={{ uri: images[0] }} style={styles.urlPreviewImage} />}
              <View style={{ flex: 1, marginLeft: 5 }}>
                {title && <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.urlPreviewTitle}>{title}</Text>}
                {description && <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.urlPreviewDesc}>{description}</Text>}
                {url && <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.urlPreviewLink}>{url}</Text>}
              </View>
            </TouchableOpacity>
          )}
          {styledMessage}
        </View>
      )
    }

    return <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>{message.text}</Text>

  }

  render() {
    const { data, currentUser, isLast, isFirst, members, imageIndex, parseImageMessages } = this.props
    if (data.loading !== true) {
      const { message, timetoken, actions, channel, status } = data

      const { user, type } = message
      const isMe = user.id === currentUser.id
      const sameDay = _isSameDay(timetoken)

      let renderTopDateSeparator = null
      let renderBottomDateSeparator = null

      let checkIcon = 'check'
      let checkColor = Colors.steel

      const messageStatus = getMessageStatusByActions(actions, members)

      switch (messageStatus) {
        case PubnubStrings.message.status.delivered: {
          checkIcon = 'check-double'
          checkColor = Colors.steel
          break
        }
        case PubnubStrings.message.status.read: {
          checkIcon = 'check-double'
          checkColor = Colors.eggplant
          break
        }
      }

      if (status) {
        checkIcon = 'clock'
      }


      if (!isFirst && !isLast && !sameDay.status) {
        renderBottomDateSeparator = (
          <View style={[styles.dateSeparatorContainer]}>
            <Text style={[styles.dateSeparatorText]}>{moment(convertTimestampToDate(sameDay.prev)).format('DD/MM/YYYY')}</Text>
          </View>
        )
      }

      if (isLast && sameDay.status) {
        renderTopDateSeparator = (
          <View style={[styles.dateSeparatorContainer]}>
            <Text style={[styles.dateSeparatorText]}>{moment(convertTimestampToDate(sameDay.prev)).format('DD/MM/YYYY')}</Text>
          </View>
        )
      }

      if (type === PubnubStrings.message.type.text) {
        const urls = getUrlsFromString(message.text)

        return (
          <View>
            {renderTopDateSeparator}
            <View style={styles.container(isMe)}>
              <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.othetMessage, { flexGrow: urls.length > 0 ? 1 : 0 }]}>
                {!isMe && !isSingleChat(channel) && (
                  <Text style={[styles.messageText, styles.groupUserName]}>{`${user.name}:`}</Text>
                )}
                {this.getTextMessageContent(isMe, message)}
                <View style={[styles.timeContainer, isMe ? styles.timeContainerMe : styles.timeContainerOther]}>
                  <Text style={[styles.dateText, isMe ? styles.dateMe : styles.dateOther]}>{moment(convertTimestampToDate(timetoken)).format('HH:mm')}</Text>
                  {isMe && <Icons name={checkIcon} size={11} color={checkColor} style={[styles.iconCheck]} />}
                </View>
              </View>
              {isMe && status === PubnubStrings.message.status.failure && (
                <TouchableOpacity activeOpacity={0.8} style={styles.resend} onPress={this.onPressResend}>
                  <Icons name='redo' size={20} color={Colors.snow} />
                </TouchableOpacity>
              )}
            </View>
            {renderBottomDateSeparator}
          </View>
        )
      }

      if (type === PubnubStrings.message.type.image) {
        const { image, localPath } = message
        let imageContent = (
          <ImagePreview
            index={imageIndex}
            images={parseImageMessages}
          >
            <Image source={{ uri: localPath }} style={{ width: imageWidth, height: imageWidth }} />
          </ImagePreview>
        )

        if (status) {
          if (status === PubnubStrings.message.status.waiting) {
            const { upload } = data
            let progress = 0
            if (upload) {
              const { bytesTransferred, totalBytes } = upload
              progress = (bytesTransferred / totalBytes) * 100
            }
            imageContent = (
              <View style={styles.imageEmptyContainer}>
                {/* <ActivityIndicator size='large' color={Colors.eggplant} /> */}
                <ProgressCircle
                  percent={progress}
                  radius={30}
                  borderWidth={8}
                  color={Colors.eggplant}
                  shadowColor={Colors.steel}
                  bgColor={Colors.snow}
                >
                  <Icons name='upload' size={25} color={Colors.eggplant} />
                </ProgressCircle>
              </View>
            )
          }

          if (status === PubnubStrings.message.status.failure) {
            imageContent = (
              <View style={styles.imageEmptyContainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.resendBig} onPress={this.onPressResend}>
                  <Icons name='redo' size={30} color={Colors.snow} />
                </TouchableOpacity>
              </View>
            )
          }
        }

        return (
          <View>
            {renderTopDateSeparator}
            <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.othetMessage]}>
              {!isMe && !isSingleChat(channel) && (
                <Text style={[styles.messageText, styles.groupUserName]}>{`${user.name}:`}</Text>
              )}
              <View style={styles.imageContainer}>
                {imageContent}
              </View>
              <View style={[styles.timeContainer, isMe ? styles.timeContainerMe : styles.timeContainerOther]}>
                <Text style={[styles.dateText, isMe ? styles.dateMe : styles.dateOther]}>{moment(convertTimestampToDate(timetoken)).format('HH:mm')}</Text>
                {isMe && <Icons name={checkIcon} size={11} color={checkColor} style={[styles.iconCheck]} />}
              </View>
            </View>
            {renderBottomDateSeparator}
          </View>
        )
      }

      if (type === PubnubStrings.message.type.video) {
        const { video, localPath } = message
        let videoContent = (
          <View>
            <VideoPreview source={video} />
          </View>
        )

        if (status) {
          if (status === PubnubStrings.message.status.waiting) {
            const { upload } = data
            let progress = 0
            if (upload) {
              const { bytesTransferred, totalBytes } = upload
              progress = (bytesTransferred / totalBytes) * 100
            }
            videoContent = (
              <View style={styles.imageEmptyContainer}>
                {/* <ActivityIndicator size='large' color={Colors.eggplant} /> */}
                <ProgressCircle
                  percent={progress}
                  radius={30}
                  borderWidth={8}
                  color={Colors.eggplant}
                  shadowColor={Colors.steel}
                  bgColor={Colors.snow}
                >
                  <Icons name='upload' size={25} color={Colors.eggplant} />
                </ProgressCircle>
              </View>
            )
          }

          if (status === PubnubStrings.message.status.failure) {
            videoContent = (
              <View style={styles.imageEmptyContainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.resendBig} onPress={this.onPressResend}>
                  <Icons name='redo' size={30} color={Colors.snow} />
                </TouchableOpacity>
              </View>
            )
          }
        }

        return (
          <View>
            {renderTopDateSeparator}
            <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.othetMessage]}>
              {!isMe && !isSingleChat(channel) && (
                <Text style={[styles.messageText, styles.groupUserName]}>{`${user.name}:`}</Text>
              )}
              <View>
                {videoContent}
              </View>
              <View style={[styles.timeContainer, isMe ? styles.timeContainerMe : styles.timeContainerOther]}>
                <Text style={[styles.dateText, isMe ? styles.dateMe : styles.dateOther]}>{moment(convertTimestampToDate(timetoken)).format('HH:mm')}</Text>
                {isMe && <Icons name={checkIcon} size={11} color={checkColor} style={[styles.iconCheck]} />}
              </View>
            </View>
            {renderBottomDateSeparator}
          </View>
        )
      }

    } else {
      return <View />
    }
  }
}

const mapStateToProps = (state, props) => {
  const { timetoken, channel, message } = props.data
  let imageMessages = []
  let parseImageMessages = []
  let imageIndex = undefined

  let members = []

  if (state.pubnubStore.spaces[channel]) {
    if (state.pubnubStore.spaces[channel].members) {
      members = state.pubnubStore.spaces[channel].members
    }

    const { type } = message
    if (type === PubnubStrings.message.type.image) {
      if (state.pubnubStore.spaces[channel].messages) {

        const messages = R.values(state.pubnubStore.spaces[channel].messages)
        imageMessages = messages.filter(m => m && (m.message.type === PubnubStrings.message.type.image) && (typeof m.message.image === 'string'))
        imageIndex = imageMessages.findIndex(m => m.timetoken === timetoken)
        parseImageMessages = imageMessages.map(m => {
          let newMessage = {
            ...m,
            ...m.message,
            url: m.message.localPath ? m.message.localPath : m.message.image
          }
          delete newMessage.message
          delete newMessage.image
          delete newMessage.type
          return newMessage
        })

      }
    }
  }

  return {
    currentUser: state.pubnubStore.user,
    members,
    imageMessages,
    imageIndex,
    parseImageMessages,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePubnubMessageRequest: (params) => dispatch(PubnubActions.updatePubnubMessageRequest(params)),
    sendPubnubMessage: (params) => dispatch(PubnubActions.sendPubnubMessageRequest(params)),
    putLocalImageMessage: (params) => dispatch(PubnubStoreActions.putLocalImageMessage(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem)