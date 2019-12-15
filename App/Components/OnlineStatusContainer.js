import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import dateFns from 'date-fns';

const styles = StyleSheet.create({
  onlineStatusText: {
    fontSize: 12,
    color: '#94ca62',
  },
  text: {
    fontSize: 12,
    color: '#979797',
  },
})

class OnlineStatusContainer extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props
    if (nextProps.userOnlineStatus && thisProps.userOnlineStatus) {
      if (nextProps.userOnlineStatus.isOnline === thisProps.userOnlineStatus.isOnline) {
        return false
      }
    }

    return true
  }

  render() {
    const { userOnlineStatus } = this.props

    if (userOnlineStatus) {
      const { isOnline, lastOnline } = userOnlineStatus
      if (isOnline) {
        return <Text style={styles.onlineStatusText}>Online</Text>
      } else {
        const lastOnlineText = dateFns.isSameDay(lastOnline, new Date())
          ? dateFns.format(lastOnline, 'hh:mm')
          : '';
        return <Text style={styles.text}>Last Online {lastOnlineText}</Text>
      }
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, props) => {
  const { userOnlineCollection } = state.qiscus
  const { targetUser } = props
  let userOnlineStatus = undefined

  if (targetUser && userOnlineCollection[targetUser.email]) {
    userOnlineStatus = userOnlineCollection[targetUser.email]
  }

  return {
    userOnlineStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnlineStatusContainer)