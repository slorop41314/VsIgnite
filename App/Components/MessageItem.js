import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PubnubStrings from '../Pubnub/PubnubStrings'
import { connect } from 'react-redux'
import { Colors } from '../Themes'
import moment from 'moment'
import { convertTimestampToDate, getMessageStatusByActions } from '../Pubnub/PubnubHelper'
import Icons from 'react-native-vector-icons/FontAwesome5'
import PubnubManager from '../Pubnub/PubnubManager'
import PubnubActions from '../Redux/PubnubRedux'

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
  },
  timeContainer: {
    flexDirection: 'row',
  },
  timeContainerMe: {
    alignSelf: 'flex-end'
  },
  timeContainerOther: {
    alignSelf: 'flex-start'
  },
  iconCheck: {
    marginTop: 5,
    marginLeft: 5
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

export class MessageItem extends Component {
  hasRead = false
  hasReceipt = false

  constructor(props) {
    super(props)

    this.checkAndUpdateActions = this.checkAndUpdateActions.bind(this)
  }

  componentDidMount() {
    const { data } = this.props
    const { timetoken, actions, channel } = data
    this.checkAndUpdateActions(channel, PubnubStrings.message.type.receipt, timetoken, PubnubStrings.event.value.delivered, actions)
    this.checkAndUpdateActions(channel, PubnubStrings.message.type.receipt, timetoken, PubnubStrings.event.value.read, actions)
  }

  checkAndUpdateActions(channel, actiontype, timetoken, value, actions) {
    const { updatePubnubMessageRequest, currentUser } = this.props
    const params = {
      channel, timetoken, actiontype, value
    }

    if (actions) {
      if (actions[actiontype]) {
        if (actions[actiontype][value]) {
          const isExist = actions[actiontype][value].find((action) => action.uuid === currentUser.uid)
          if (!isExist) {
            updatePubnubMessageRequest(params)
          }
        } else {
          updatePubnubMessageRequest(params)
        }
      }
    } else {
      updatePubnubMessageRequest(params)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props

    let thisMessage = undefined
    let nextMessage = undefined

    let thisActions = undefined
    let nextActions = undefined

    const { data, currentUser, isLast, isFirst, members, storeData } = nextProps
    const { message, timetoken, actions, channel } = data

    if (thisProps.data && thisProps.data.message) thisMessage = thisProps.data.message
    if (nextProps.data && nextProps.data.message) nextMessage = nextProps.data.message

    if (thisProps.data && thisProps.data.actions) thisActions = thisProps.data.actions
    if (nextProps.data && nextProps.data.actions) nextActions = nextProps.data.actions

    let shouldUpdate = true

    if (JSON.stringify(thisMessage) === JSON.stringify(nextMessage)) {
      shouldUpdate = false

      if (JSON.stringify(thisActions) !== JSON.stringify(nextActions)) {
        shouldUpdate = true
      }

    } else {
      if (isFirst) {
        this.checkAndUpdateActions(channel, PubnubStrings.message.type.receipt, timetoken, PubnubStrings.event.value.read, nextActions)
      }
    }

    return shouldUpdate
  }

  render() {
    const { data, currentUser, isLast, isFirst, members } = this.props
    if (data.loading !== true) {
      const { message, timetoken, actions, channel } = data
      const { user, type } = message
      const isMe = user.id === currentUser.uid
      const sameDay = _isSameDay(timetoken)

      let renderTopDateSeparator = null
      let renderBottomDateSeparator = null

      let checkIcon = 'check'
      let checkColor = Colors.steel

      const messageStatus = getMessageStatusByActions(actions, members)

      switch (messageStatus) {
        case PubnubStrings.message.status.delivered: {
          checkIcon = 'check-double'
          checkColor = Colors.steel
          break
        }
        case PubnubStrings.message.status.read: {
          checkIcon = 'check-double'
          checkColor = Colors.eggplant
          break
        }
      }

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
              <View style={[styles.timeContainer, isMe ? styles.timeContainerMe : styles.timeContainerOther]}>
                <Text style={[styles.dateText, isMe ? styles.dateMe : styles.dateOther]}>{moment(convertTimestampToDate(timetoken)).format('HH:mm')}</Text>
                {isMe && <Icons name={checkIcon} size={11} color={checkColor} style={[styles.iconCheck]} />}
              </View>
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
}

const mapStateToProps = (state, props) => {
  const { timetoken, channel } = props.data
  let storeData = { ...props.data }

  let members = []

  if (state.pubnubStore.spaces[channel]) {
    if (state.pubnubStore.spaces[channel].members) {
      members = state.pubnubStore.spaces[channel].members
    }

    if (state.pubnubStore.spaces[channel].messages && state.pubnubStore.spaces[channel].messages[timetoken]) {
      storeData = state.pubnubStore.spaces[channel].messages[timetoken]
    }
  }

  return {
    currentUser: state.session.currentUser,
    members,
    storeData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePubnubMessageRequest: (params) => dispatch(PubnubActions.updatePubnubMessageRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem)