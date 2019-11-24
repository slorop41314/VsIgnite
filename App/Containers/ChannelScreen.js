import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ChannelScreenStyle'
import { getChannelList } from '../Services/ChatEngine'
import { ChannelItem } from '../Components/ChannelItem'

class ChannelScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      channels: []
    }
  }

  componentDidMount() {
    getChannelList(channelList => this.setState({ channels: channelList }))
  }

  render() {
    const { channels } = this.state
    return (
      <FlatList
        data={channels}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ChannelItem data={item} />}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelScreen)
