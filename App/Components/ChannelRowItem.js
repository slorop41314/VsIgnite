import React from 'react'
import { Styled, PlaceholderImage, PlaceholderText } from "react-native-awesome-component"
import { Text, StyleSheet, View, TouchableOpacity } from "react-native"
import PubnubStrings from '../Pubnub/PubnubStrings'
import { isSingleChat } from '../Pubnub/PubnubHelper'
import { connect } from 'react-redux'
import Avatar from './Avatar'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  channelName: {
  },
  channelAvatar: {
    marginRight: 10
  }
})

export const ChannelRowItem = (props) => {
  const { data, currentUser, onPress } = props
  let channelName = undefined
  let channelAvatar = undefined
  if (!data.loading || data.loading === undefined) {
    const isSingle = isSingleChat(data.id)
    if (isSingle) {
      const { custom, name } = data
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
        <View style={styles.titleContainer}>
          <PlaceholderText numberOfLines={1} style={styles.channelName}>{channelName}</PlaceholderText>
        </View>
      </View>
    </TouchableOpacity>
  )
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