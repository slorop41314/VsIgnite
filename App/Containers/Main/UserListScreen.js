import React, { Component } from 'react'
import { Styled, CustomFlatList } from 'react-native-awesome-component'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import PubnubActions from '../../Redux/PubnubRedux'
import UserRowitem from '../../Components/UserRowitem'
import { StackActions, NavigationActions } from 'react-navigation';
import PubnubStrings from '../../Pubnub/PubnubStrings'

class UserListScreen extends Component {
  constructor(props) {
    super(props)
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
    const { createPubnubSpaceRequest, currentUser } = this.props
    const params = {
      name: `${item.id}-${currentUser.uid}`,
      users: [item],
      type: PubnubStrings.space.type.single
    }
    createPubnubSpaceRequest(params)
    // const { navigation } = this.props

    // const replaceAction = StackActions.replace({
    //   routeName: 'ChatScreen',
    //   params: {
    //     type: PubnubStrings.space.type.single,
    //     data: item
    //   }
    // });
    // navigation.dispatch(replaceAction);
  }

  render() {
    const { userList, getUserList } = this.props
    const { fetching, error } = getUserList
    return (
      <Styled.FlexContainer>
        <CustomFlatList
          fetchFunction={this.fetchFunction}
          data={userList}
          renderItem={({ item }) => <UserRowitem data={item} onPress={() => this.onPressItem(item)} />}
          meta={{ current_page: 1, next_page: undefined }}
          loading={fetching}
          error={error}
        />
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
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

