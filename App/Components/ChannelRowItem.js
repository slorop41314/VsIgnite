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
  }
})

class ChannelRowItem extends Component {
  constructor(props) {
    super(props)
    this.renderDate = this.renderDate.bind(this)
    this.renderLastMessage = this.renderLastMessage.bind(this)
    this.renderUnread = this.renderUnread.bind(this)
  }

  renderLastMessage() {
    const { data, currentUser, onPress } = this.props
    if (!data.loading) {
      const { custom, name, messages, members } = data

      if (messages) {
        const message = R.values(messages).sort(Method.Array.compareValues('timetoken', 'desc', true, true))[0]
        if (message && message.message) {
          let textMessage = ''
          if (message.message.type === PubnubStrings.message.type.text) {
            textMessage = `${message.message.user.name}: ${message.message.text}`
          } else {
            textMessage = `${message.message.user.name}: send images`
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
    // return (
    //   <View style={styles.unreadBorder}>
    //     <Text style={styles.unreadText}>99+</Text>
    //   </View>
    // )
    return null
  }

  renderDate() {
    const { data, currentUser, onPress } = this.props
    if (!data.loading) {
      const { custom, name, messages, members } = data

      if (messages) {
        const message = R.values(messages).sort(Method.Array.compareValues('timetoken', 'desc', true, true))[0]
        if (message && message.message) {
          let dateMessage = ''

          dateMessage = moment(convertTimestampToDate(message.timetoken)).format('DD/MM/YYYY HH:mm')

          return (
            <Text style={[styles.lastMessageDate]}>{dateMessage}</Text>
          )
        }
      }
    }

    return null
  }

  render() {
    const { data, currentUser, onPress } = this.props
    let channelName = undefined
    let channelAvatar = undefined
    if (!data.loading || data.loading === undefined) {
      const isSingle = isSingleChat(data.id)
      if (isSingle) {
        const { custom, name, messages } = data
        const uids = name.split('-')
        const targetUserId = uids.filter(id => id !== currentUser.uid)[0]
        const targetUser = JSON.parse(custom[targetUserId])
        channelName = targetUser.name
        channelAvatar = targetUser.profileUrl
      }
    }
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => onPress ? onPress(data) : {}}>
        <View style={styles.container}>
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
    currentUser: state.session.currentUser,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelRowItem)