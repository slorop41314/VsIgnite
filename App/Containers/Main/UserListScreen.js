import React, { Component } from 'react'
import { Styled, CustomFlatList } from 'react-native-awesome-component'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import UserActions from '../../Redux/UserRedux'
import UserRowitem from '../../Components/UserRowitem'

class UserListScreen extends Component {
  constructor(props) {
    super(props)
    this.fetchFunction = this.fetchFunction.bind(this)
  }

  componentDidMount() {

  }

  fetchFunction(page) {
    const { getUserListRequest } = this.props
    getUserListRequest()
  }

  render() {
    const { userList, getUserList } = this.props
    const { fetching, error } = getUserList
    return (
      <Styled.FlexContainer>
        <CustomFlatList
          fetchFunction={this.fetchFunction}
          data={userList}
          renderItem={({ item }) => <UserRowitem data={item} />}
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
    userList: state.user.users,
    getUserList: state.user.getUserList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserListRequest: () => dispatch(UserActions.getUserListRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen)

