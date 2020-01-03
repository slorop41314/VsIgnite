import React, { Component } from 'react'
import { Styled, CustomFlatList } from 'react-native-awesome-component'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import PubnubActions from '../../Redux/PubnubRedux'
import UserRowitem from '../../Components/UserRowitem'
import { StackActions, NavigationActions } from 'react-navigation';

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
    console.tron.error({ item })
    const { navigation } = this.props

    const replaceAction = StackActions.replace({
      routeName: 'ChatScreen'
    });
    navigation.dispatch(replaceAction);
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
    userList: state.pubnub.users,
    getUserList: state.pubnub.getPubnubUserList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserListRequest: () => dispatch(PubnubActions.getPubnubUserListRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen)

