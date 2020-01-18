import React, { Component } from 'react'
import { Styled, CustomButton, CustomFlatList, Method } from 'react-native-awesome-component'
import { connect } from 'react-redux'
import Strings from '../../Themes/Strings'
import AuthActions from '../../Redux/AuthRedux'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, View } from 'react-native'
import PubnubActions from '../../Redux/PubnubRedux'
import { values } from 'ramda'
import ChannelRowItem from '../../Components/ChannelRowItem'
import { Colors } from '../../Themes'

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})

class ChannelListScreen extends Component {
  constructor(props) {
    super(props)

    this.onPressNewChat = this.onPressNewChat.bind(this)
    this.onPressGroup = this.onPressGroup.bind(this)
    this.onPressLogout = this.onPressLogout.bind(this)
    this.fetchFunction = this.fetchFunction.bind(this)
    this.onPressChannel = this.onPressChannel.bind(this)
  }

  componentDidMount() {
  }

  fetchFunction() {
    const { getAllSpaceRequest } = this.props
    getAllSpaceRequest({ limit: 100 })
  }

  onPressLogout() {
    const { logoutRequest } = this.props
    logoutRequest()
  }

  onPressNewChat() {
    const { navigation } = this.props
    navigation.navigate('UserListScreen')
  }

  onPressGroup() {
    const { navigation } = this.props
    navigation.navigate('GroupInviteScreen')
  }

  onPressChannel(item) {
    const { navigation } = this.props
    navigation.navigate('ChatScreen', { data: item })
  }

  render() {
    const { spaces, getAllSpacesStatus } = this.props
    const { fetching, error, data, payload } = getAllSpacesStatus
    return (
      <Styled.FlexContainer padded>
        <CustomFlatList
          fetchFunction={this.fetchFunction}
          data={spaces}
          renderItem={({ item }) => <ChannelRowItem data={item} onPress={this.onPressChannel} />}
          meta={{ current_page: 1, next_page: undefined }}
          loading={fetching}
          error={error}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.steel }} />}
        />
        <CustomButton
          title={Strings.button.logout}
          onPress={this.onPressLogout}
        />
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Chat" onPress={this.onPressNewChat}>
            <Icon name="user" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Create Group" onPress={this.onPressGroup}>
            <Icon name="users" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state) => {
  const spaces = values(state.pubnubStore.spaces).sort(Method.Array.compareValues('lastMessageTimetoken', 'desc', true))
  return {
    spaces,
    getAllSpacesStatus: state.pubnub.getAllPubnubSpace,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutRequest: () => dispatch(AuthActions.logoutRequest()),
    getAllSpaceRequest: (params) => dispatch(PubnubActions.getAllPubnubSpaceRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelListScreen)