import React, { Component } from 'react'
import { Styled, CustomFlatList, CustomButton, Method } from 'react-native-awesome-component'
import { Text, StyleSheet, Group } from 'react-native'
import { connect } from 'react-redux'
import PubnubActions from '../../Redux/PubnubRedux'
import UserRowitem from '../../Components/UserRowitem'
import { StackActions, NavigationActions } from 'react-navigation';
import PubnubStrings from '../../Pubnub/PubnubStrings'
import R from 'ramda'
import PubnubManager from '../../Pubnub/PubnubManager'

const styles = StyleSheet.create({
  groupLabel: {
    textAlign: 'right',
    fontSize: 13
  }
})

class UserListScreen extends Component {
  constructor(props) {
    super(props)

    this.isGroup = props.navigation.getParam('isGroup')
    this.action = props.navigation.getParam('action')

    this.state = {
      selectedMember: {}
    }

    this.onPressCreateGroup = this.onPressCreateGroup.bind(this)
    this.fetchFunction = this.fetchFunction.bind(this)
    this.onPressItem = this.onPressItem.bind(this)
  }

  componentDidMount() {

  }

  fetchFunction(page) {
    const { getUserListRequest } = this.props
    getUserListRequest()
  }

  onPressItem(item) {
    if (this.isGroup) {
      let newSelectedMember = this.state.selectedMember
      if (newSelectedMember[item.id]) {
        delete newSelectedMember[item.id]
      } else {
        newSelectedMember = {
          ...newSelectedMember,
          [item.id]: item
        }
      }

      this.setState({ selectedMember: newSelectedMember })
    } else {
      const { createPubnubSpaceRequest, currentUser } = this.props
      const params = {
        name: `${item.id}-${currentUser.id}`,
        users: [item],
        type: PubnubStrings.space.type.single
      }
      createPubnubSpaceRequest(params)
    }
  }

  onPressCreateGroup() {
    const { selectedMember } = this.state
    const { navigation, addPubnubSpaceMemberRequest, currentUser } = this.props
    if (this.action === PubnubStrings.invite_type.invite) {
      const channelId = navigation.getParam('channelId')
      addPubnubSpaceMemberRequest({ spaceId: channelId, users: R.values(selectedMember), invite_type: PubnubStrings.invite_type.invite })
    }

    if (this.action === PubnubStrings.invite_type.create) {
      navigation.navigate('GroupCreateScreen', { members: [currentUser].concat(R.values(selectedMember)) })
    }
  }

  render() {
    const { selectedMember } = this.state
    const { userList, getUserList } = this.props
    const { fetching, error } = getUserList

    let userCount = R.values(selectedMember)

    return (
      <Styled.FlexContainer>
        {this.isGroup && (
          <Styled.Container padded>
            <Text style={[styles.groupLabel]}>{`${userCount.length} user${userCount > 1 ? 's' : ''} selected`}</Text>
          </Styled.Container>
        )}
        <CustomFlatList
          fetchFunction={this.fetchFunction}
          data={userList}
          renderItem={({ item }) => <UserRowitem isSelected={this.isGroup ? selectedMember[item.id] !== undefined : undefined} data={item} onPress={() => this.onPressItem(item)} />}
          meta={{ current_page: 1, next_page: undefined }}
          loading={fetching}
          error={error}
        />
        {this.isGroup && (
          <CustomButton
            title={this.action === PubnubStrings.invite_type.invite ? 'Invite' : 'Next'}
            onPress={this.onPressCreateGroup}
            disabled={userCount <= 0}
          />
        )}
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state, props) => {
  const currentUser = state.pubnubStore.user
  let excludeUser = [currentUser]
  let userList = state.pubnub.users

  const isGroup = props.navigation.getParam('isGroup')
  const action = props.navigation.getParam('action')

  if (isGroup) {
    if (action === PubnubStrings.invite_type.invite) {
      const channelId = props.navigation.getParam('channelId')
      if (state.pubnubStore.spaces[channelId]) {
        const channel = state.pubnubStore.spaces[channelId]
        if (channel.members) {
          const members = channel.members.map((m) => m.user)
          excludeUser = Method.Array.mergeAndReplace(excludeUser, members, 'id')
        }
      }
    }
  }

  userList = R.differenceWith((a, b) => a.id === b.id, userList, excludeUser)

  return {
    currentUser,
    userList,
    getUserList: state.pubnub.getPubnubUserList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserListRequest: () => dispatch(PubnubActions.getPubnubUserListRequest()),
    getPubnubSpaceRequest: (params) => dispatch(PubnubActions.getPubnubSpaceRequest(params)),
    createPubnubSpaceRequest: (params) => dispatch(PubnubActions.createPubnubSpaceRequest(params)),
    addPubnubSpaceMemberRequest: (params) => dispatch(PubnubActions.addPubnubSpaceMemberRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen)

