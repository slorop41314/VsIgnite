import React, { Component } from 'react'
import { FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button';

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ChannelScreenStyle'
import ChannelItem from '../Components/ChannelItem'
import { ItemSeparator } from '../Components/ItemSeparator';

class ChannelScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      channels: []
    }
    this.onPressFAB = this.onPressFAB.bind(this)
    this.onPressItem = this.onPressItem.bind(this)
  }

  componentDidMount() {
  }

  onPressFAB() {
    const { navigation } = this.props
    navigation.navigate('UserListScreen')
  }

  onPressItem(channel) {
    const { navigation } = this.props
    navigation.navigate('ChatScreen', { channel })
  }

  render() {
    const { channelList } = this.props
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={channelList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ChannelItem data={item} onPress={() => this.onPressItem(item)} />}
          ItemSeparatorComponent={() => <ItemSeparator />}
          contentContainerStyle={{ padding: 10 }}
        />
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={this.onPressFAB}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    channelList: state.fireEngine.channelList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelScreen)
