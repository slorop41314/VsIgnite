import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../Themes/'
import { connect } from 'react-redux'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { arrayEqual } from '../Services/firestore-chat-engine/helper'
import FireEngineActions from '../Redux/FireEngineRedux'

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: '40%',
    maxWidth: '90%',
    marginTop: 5,
  },
  leftContainer: {
    backgroundColor: Colors.messageLeft,
  },
  rightContainer: {
    backgroundColor: Colors.messageRight,
  },
  textMessage: {
    fontSize: 16,
    color: Colors.coal,
    marginBottom: 5,
  },
  textTime: {
    fontSize: 10,
    color: Colors.coal,
  }
})

const MessageItem = (props) => {
  const moment = require('moment');
  const { data, currentUser, channel, readMessageRequest } = props
  const { timestamp, sender, members, receive_ids, read_ids } = data
  const dateTime = moment(timestamp)

  if (!read_ids.includes(currentUser.uuid)) {
    readMessageRequest({ channel, message: data })
  }

  if (currentUser.uuid === sender) {
    return (
      <View style={{ alignItems: 'flex-end' }}>
        <View style={[styles.rightContainer, styles.messageContainer]}>
          <Text style={[styles.textMessage]}>{data.message}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Icons name={arrayEqual(members, receive_ids) ? 'check-all' : 'check'} color={arrayEqual(members, read_ids) && arrayEqual(members, receive_ids) ? Colors.snow : Colors.coal} />
            <Text style={[styles.textTime, { textAlign: 'right', marginLeft: 5 }]}>{dateTime.format('HH:mm')}</Text>
          </View>
        </View>
      </View>
    )
  } else {
    return (
      <View style={{ alignItems: 'flex-start' }}>
        <View style={[styles.leftContainer, styles.messageContainer]}>
          <Text style={[styles.textMessage]}>{data.message}</Text>
          <Text style={[styles.textTime]}>{dateTime.format('HH:mm')}</Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.fireEngine.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    readMessageRequest: (params) => dispatch(FireEngineActions.readMessageRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem)