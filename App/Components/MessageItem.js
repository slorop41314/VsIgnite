import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../Themes/'
import { connect } from 'react-redux'

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

const MessageItem = (props) => {
  const moment = require('moment');

  const { data, currentUser } = props
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

const mapStateToProps = (state) => {
  return {
    currentUser: state.fireEngine.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem)