import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Colors } from '../Themes'
import { CHANNEL_TYPE } from '../Services/firestore-chat-engine/const'
import { connect } from 'react-redux'
import moment from 'moment'

const styles = StyleSheet.create({
  photoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grey,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  infoContainer: {
    flex: 1, 
    marginLeft: 10,
    justifyContent: 'center'
  },
  testMessage: {
    fontSize: 15,
    color: Colors.charcoal
  },
  textName: {
    fontSize: 18
  }
})

const ChannelItem = (props) => {
  const { data, onPress, currentUser } = props
  if (data && data.type === CHANNEL_TYPE.single) {
    const user = data.members.filter(u => u.uuid !== currentUser.uuid)[0]
    return (
      <TouchableOpacity activeOpacity={0.8} style={[styles.rowContainer]} onPress={onPress}>
        {user.photo ? (
          <Image source={{ uri: user.photo }} style={[styles.photoContainer]} resizeMethod='resize' resizeMode='cover' />
        ) : (
            <View style={[styles.photoContainer]} />
          )}
        <View style={[styles.infoContainer]}>
          <Text style={[styles.textName]}>{user.fullname}</Text>
          {data.last_message && (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.testMessage]}>{data.last_message.message}</Text>
              <Text style={[styles.testMessage]}>{moment(data.last_message.timestamp).format('DD/MM/YYYY')}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  } else {
    return <View />
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.fireEngine.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelItem)