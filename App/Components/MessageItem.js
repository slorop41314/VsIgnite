import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PubnubStrings from '../Pubnub/PubnubStrings'
import { connect } from 'react-redux'
import { Colors } from '../Themes'
import moment from 'moment'
import { convertTimestampToDate } from '../Pubnub/PubnubHelper'

const styles = StyleSheet.create({
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

export const MessageItem = (props) => {
  const { data, currentUser, isLast, isFirst } = props
  if (data.loading !== true) {
    const { message, timetoken } = data
    const { user, type } = message
    const isMe = user.id === currentUser.uid
    const sameDay = _isSameDay(timetoken)

    let renderTopDateSeparator = null
    let renderBottomDateSeparator = null

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
      return (
        <View>
          {renderTopDateSeparator}
          <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.othetMessage]}>
            <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>{message.text}</Text>
            <Text style={[styles.dateText, isMe ? styles.dateMe : styles.dateOther]}>{moment(convertTimestampToDate(timetoken)).format('HH:mm')}</Text>
          </View>
          {renderBottomDateSeparator}
        </View>
      )
    } else {
      return (
        <View>
          <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.othetMessage]}>
            <Text>CANNOT DISPLAY DATA YET</Text>
          </View>
        </View>
      )
    }
  } else {
    return <View />
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem)