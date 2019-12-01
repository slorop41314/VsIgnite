import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/UserListScreenStyle'
import { UserItem } from '../Components/UserItem'
import { ItemSeparator } from '../Components/ItemSeparator'
import FireEngineManager from '../Services/FireEngineManager'

class UserListScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: []
    }
    this.onPressUser = this.onPressUser.bind(this)
  }

  componentDidMount() {
  }

  async onPressUser(user) {
    const { navigation } = this.props
    const fireInstance = FireEngineManager.getInstance()
    const channel = await fireInstance.getChannelFromUser(user)
    navigation.navigate('ChatScreen', { channel })
  }

  render() {
    const { userList } = this.props
    return (
      <FlatList
        data={userList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <UserItem data={item} onPress={() => this.onPressUser(item)} />}
        ItemSeparatorComponent={() => <ItemSeparator />}
        contentContainerStyle={{ padding: 10 }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userList: state.fireEngine.userList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen)
