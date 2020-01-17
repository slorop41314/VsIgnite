import React from 'react'
import { connect } from 'react-redux'
import { CustomHeader } from 'react-native-awesome-component'
import { View, Text, StyleSheet } from 'react-native'
import { isSingleChat } from '../Pubnub/PubnubHelper'
import { values } from 'ramda'
import Avatar from './Avatar'
import { Colors } from '../Themes'

const styles = StyleSheet.create({
  headerContaienr: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: '10%'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  avatarContainer: {
    marginRight: 10
  },
  textTyping: {
    fontSize: 12,
    color: Colors.eggplant
  },
  textTitle: {
    fontSize: 14,
    color: Colors.coal
  }
})

const ChatHeader = (props) => {
  const { navigation, currentUser, typings } = props
  const data = navigation.getParam('data')
  let channelName = ''
  let channelAvatar = undefined
  let typingsMessage = undefined
  const isSingle = isSingleChat(data.id)
  if (isSingle) {
    const { custom, name } = data
    const uids = name.split('-')
    const targetUserId = uids.filter(id => id !== currentUser.id)[0]
    const targetUser = JSON.parse(custom[targetUserId])
    channelName = targetUser.name
    channelAvatar = targetUser.profileUrl
  } else {
    channelName = data.name
  }

  if (typings.length > 0) {
    typingsMessage = typings.join(', ')
  }

  return (
    <CustomHeader
      navigation={navigation}
      isCard={true}
      renderTitle={() => {
        return (
          <View style={[styles.headerContaienr]}>
            <View style={[styles.avatarContainer]}>
              <Avatar source={channelAvatar} name={channelName} size={40} />
            </View>
            <View style={[styles.titleContainer]}>
              <Text style={[styles.textTitle]}>{channelName}</Text>
              {typingsMessage && <Text numberOfLines={1} lineBreakMode={'tail'} style={styles.textTyping}>{`${typingsMessage} typing`}</Text>}
            </View>
          </View>
        )
      }}
    />
  )
}

const mapStateToProps = (state, props) => {
  const { navigation } = props
  const data = navigation.getParam('data')
  let typings = []
  if (state.pubnubStore.typings[data.id]) {
    typings = values(state.pubnubStore.typings[data.id]).map((u) => u.name)
  }
  return {
    currentUser: state.pubnubStore.user,
    typings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader)

