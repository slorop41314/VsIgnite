import React from 'react'
import { CustomHeader } from 'react-native-awesome-component'
import { connect } from 'react-redux'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Avatar from './Avatar'

const styles = StyleSheet.create({
  rightContainer: {
    marginRight: 10
  }
})

const ChannelHeader = (props) => {
  const { navigation, currentUser } = props

  function onPressUser() {
    navigation.navigate('UserProfileScreen', { isMe: true, user: currentUser })
  }

  return (
    <CustomHeader
      navigation={navigation}
      isCard={true}
      title={'Chat'}
      renderRight={() => {
        return (
          <TouchableOpacity activeOpacity={0.8} style={styles.rightContainer} onPress={onPressUser}>
            <Avatar source={currentUser.profileUrl} name={currentUser.name} size={35} />
          </TouchableOpacity>
        )
      }}
    />
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.pubnubStore.user,
  }
}

const mapDispathToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispathToProps)(ChannelHeader)