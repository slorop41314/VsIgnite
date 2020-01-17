import React, { Component } from 'react'
import { Styled, CustomFlatList, CustomButton } from 'react-native-awesome-component'
import { Text, StyleSheet } from 'react-native'
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
    const { navigation } = this.props
    const currentPubnubUser = PubnubManager.getCurrentUser()
    navigation.navigate('GroupCreateScreen', { members: [currentPubnubUser].concat(R.values(selectedMember)) })
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
          renderItem={({ item }) => <UserRowitem isSelected={selectedMember[item.id] !== undefined} data={item} onPress={() => this.onPressItem(item)} />}
          meta={{ current_page: 1, next_page: undefined }}
          loading={fetching}
          error={error}
        />
        {this.isGroup && (
          <CustomButton
            title={'Next'}
            onPress={this.onPressCreateGroup}
            disabled={userCount <= 0}
          />
        )}
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.pubnubStore.user,
    userList: state.pubnub.users,
    getUserList: state.pubnub.getPubnubUserList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserListRequest: () => dispatch(PubnubActions.getPubnubUserListRequest()),
    getPubnubSpaceRequest: (params) => dispatch(PubnubActions.getPubnubSpaceRequest(params)),
    createPubnubSpaceRequest: (params) => dispatch(PubnubActions.createPubnubSpaceRequest(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen)

