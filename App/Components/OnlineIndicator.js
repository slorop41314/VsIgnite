import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Colors } from '../Themes'
import { ConnectionContext } from '../Containers/RootContainer'

const styles = StyleSheet.create({
  container: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
  online: {
    backgroundColor: Colors.green
  },
  offline: {
    backgroundColor: Colors.steel
  }
})

class OnlineIndicator extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    let isRender = true
    const thisProps = this.props

    if ((nextProps.channel === thisProps.channel) && (nextProps.uuid === thisProps.uuid)) {
      isRender = false
      if (JSON.stringify(nextProps.userPresence) !== JSON.stringify(thisProps.userPresence)) {
        isRender = true
      }
    }

    return isRender
  }

  render() {
    const { userPresence, uuid } = this.props

    const presence = userPresence[uuid]
    let isOnline = false
    if (presence) {
      isOnline = presence.online
    }

    return (
      <ConnectionContext.Consumer>
        {(isConnected) => {
          let userOnline = isOnline
          if (!isConnected) {
            userOnline = isConnected
          }
          return <View style={[styles.container, userOnline ? styles.online : styles.offline]} />
        }}
      </ConnectionContext.Consumer>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { channel } = props
  let userPresence = {}

  if (state.pubnubStore.userPresence[channel]) {
    userPresence = state.pubnubStore.userPresence[channel]
  }
  return {
    userPresence,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnlineIndicator)