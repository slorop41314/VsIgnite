import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { currentUser } from '../Services/firestore-chat-engine/chat-engine'
import {Colors} from '../Themes/'

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
  },
  textTime: {
    fontSize: 10,
    color: Colors.coal,
  }
})

export const MessageItem = (props) => {
  const moment = require('moment');

  const { data } = props
  const dateTime = moment(data.timestamp)

  if (currentUser.uuid === data.sender) {
    return (
      <View style={{ alignItems: 'flex-end' }}>
        <View style={[styles.rightContainer, styles.messageContainer]}>
          <Text style={[styles.textMessage]}>{data.message}</Text>
          <Text style={[styles.textTime, { textAlign: 'right' }]}>{dateTime.format('HH:mm')}</Text>
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