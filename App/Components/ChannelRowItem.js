import React, { Component } from 'react'
import { Styled, PlaceholderImage, PlaceholderText, Method } from "react-native-awesome-component"
import { Text, StyleSheet, View, TouchableOpacity } from "react-native"
import PubnubStrings from '../Pubnub/PubnubStrings'
import { isSingleChat, convertTimestampToDate } from '../Pubnub/PubnubHelper'
import { connect } from 'react-redux'
import Avatar from './Avatar'
import R from 'ramda'
import { Colors } from '../Themes'
import moment from 'moment'
import OnlineIndicator from './OnlineIndicator'

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  channelContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  messageContainer: {
    flexDirection: 'row',
  },
  channelName: {
    fontSize: 14,
    color: Colors.coal,
  },
  channelAvatar: {
    marginRight: 10
  },
  lastMessage: {
    fontSize: 12,
    color: Colors.charcoal
  },
  lastMessageDate: {
    fontSize: 10,
    color: Colors.charcoal,
    textAlign: 'right'
  },
  unreadText: {
    color: Colors.snow,
    fontSize: 10,
  },
  unreadBorder: {
    width: 25,
    height: 25,
    backgroundColor: Colors.eggplant,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.5
  },
  onlineContainer: {
    position: 'absolute', zIndex: 1
  }
})

class ChannelRowItem extends Component {
  constructor(props) {
    super(props)
    this.renderDate = this.renderDate.bind(this)
    this.renderLastMessage = this.renderLastMessage.bind(this)
    this.renderUnread = this.renderUnread.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    let isRender = true
    const thisProps = this.props
    if (nextProps.data && (nextProps.data.loading === undefined)) {
      const thisData = thisProps.data
      const nextData = nextProps.data
      const isSingle = isSingleChat(nextData.id)
      if (isSingle) {
        if (nextData.id === thisData.id) {
          if (JSON.stringify(nextData.custom) === JSON.stringify(thisData.custom)) {
            isRender = false

            if (
              (JSON.stringify(nextData.lastMessage) !== JSON.stringify(thisData.lastMessage)) ||
              (nextData.lastMessageTimetoken !== thisData.lastMessageTimetoken) ||
              (nextData.lastReadMessageTimetoken !== thisData.lastReadMessageTimetoken) ||
              (nextData.unreadCount !== thisData.unreadCount)
            ) {
              isRender = true
            }
          }
        }
      } else {
        if (nextData.id === thisData.id) {
          if ((nextData.name === thisData.data) && (nextData.description === thisData.description)) {
            isRender = false

            if (
              (JSON.stringify(nextData.lastMessage) !== JSON.stringify(thisData.lastMessage)) ||
              (nextData.lastMessageTimetoken !== thisData.lastMessageTimetoken) ||
              (nextData.lastReadMessageTimetoken !== thisData.lastReadMessageTimetoken) ||
              (nextData.unreadCount !== thisData.unreadCount)
            ) {
              isRender = true
            }
          }
        }
      }
    }

    return isRender
  }

  renderLastMessage() {
    const { data, currentUser, onPress } = this.props
    if (data.loading !== true) {
      const { lastMessage } = data

      if (lastMessage) {
        if (lastMessage && lastMessage.message) {
          let textMessage = ''

          switch (lastMessage.message.type) {
            case PubnubStrings.message.type.text: {
              textMessage = `${currentUser.id !== lastMessage.message.user.id ? lastMessage.message.user.name : 'You'}: ${lastMessage.message.text}`
              break
            }
            case PubnubStrings.message.type.image: {
              textMessage = `${currentUser.id !== lastMessage.message.user.id ? lastMessage.message.user.name : 'You'}: send image`
              break
            }
            case PubnubStrings.message.type.video: {
              textMessage = `${currentUser.id !== lastMessage.message.user.id ? lastMessage.message.user.name : 'You'}: send video`
              break
            }
          }

          return (
            <Text numberOfLines={2} ellipsizeMode={'tail'} style={[styles.lastMessage]}>{textMessage}</Text>
          )
        }
      }
    }

    return null
  }

  renderUnread() {
    const { data } = this.props
    if (data.loading !== true) {
      const { unreadCount } = data

      if (unreadCount > 0) {
        return (
          <View style={styles.unreadBorder}>
            <Text style={styles.unreadText}>{unreadCount > 99 ? `99+` : unreadCount}</Text>
          </View>
        )
      }
    }

    return null
  }

  renderDate() {
    const { data, currentUser, onPress } = this.props
    if (data.loading !== true) {
      const { lastMessageTimetoken } = data

      if (lastMessageTimetoken) {
        let dateMessage = ''
        dateMessage = moment(lastMessageTimetoken).format('DD/MM/YYYY HH:mm')

        return (
          <Text style={[styles.lastMessageDate]}>{dateMessage}</Text>
        )
      }
    }

    return null
  }

  render() {
    const { data, currentUser, onPress } = this.props
    let channelName = undefined
    let channelAvatar = undefined
    let onlineIndicator = undefined
    if (data.loading !== true) {
      const isSingle = isSingleChat(data.id)
      if (isSingle) {
        const { custom, name, messages } = data
        const uids = name.split('-')
        const targetUserId = uids.filter(id => id !== currentUser.id)[0]
        const targetUser = JSON.parse(custom[targetUserId])
        channelName = targetUser.name
        channelAvatar = targetUser.profileUrl
        onlineIndicator = (
          <View style={[styles.onlineContainer]}>
            <OnlineIndicator channel={data.id} uuid={targetUserId} />
          </View>
        )
      } else {
        channelName = data.name
      }
    }
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => onPress ? onPress(data) : {}}>
        <View style={styles.container}>
          {onlineIndicator}
          <View style={styles.channelAvatar}>
            <Avatar source={channelAvatar} name={channelName} />
          </View>
          <View style={styles.channelContainer}>
            <View style={styles.titleContainer}>
              <View style={styles.flex}>
                <PlaceholderText numberOfLines={1} style={styles.channelName} ellipsizeMode={'tail'} >{channelName}</PlaceholderText>
              </View>
              {this.renderDate()}
            </View>
            <View style={styles.messageContainer}>
              <View style={styles.flex}>
                {this.renderLastMessage()}
              </View>
              {this.renderUnread()}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.pubnubStore.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelRowItem)