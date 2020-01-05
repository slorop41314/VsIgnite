import React, { Component } from 'react'
import { Styled, CustomButton } from 'react-native-awesome-component'
import { connect } from 'react-redux'
import Strings from '../../Themes/Strings'
import AuthActions from '../../Redux/AuthRedux'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet } from 'react-native'
import PubnubActions from '../../Redux/PubnubRedux'

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
    navigation.navigate('GroupCreateScreen')
  }

  render() {
    return (
      <Styled.FlexContainer padded>
        <Styled.FlexContainer>
          <CustomButton
            title={Strings.button.logout}
            onPress={this.onPressLogout}
          />
        </Styled.FlexContainer>
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
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutRequest: () => dispatch(AuthActions.logoutRequest()),
    getAllSpaceRequest: (params) => dispatch(PubnubActions.getAllPubnubSpaceRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelListScreen)