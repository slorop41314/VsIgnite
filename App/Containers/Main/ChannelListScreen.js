import React, { Component } from 'react'
import { Styled, CustomButton } from 'react-native-awesome-component'
import { connect } from 'react-redux'
import Strings from '../../Themes/Strings'
import AuthActions from '../../Redux/AuthRedux'
import UserActions from '../../Redux/UserRedux'

class ChannelListScreen extends Component {
  constructor(props) {
    super(props)

    this.onPressLogout = this.onPressLogout.bind(this)
  }

  componentDidMount() {
    const { getUserListRequest } = this.props
    getUserListRequest()
  }

  onPressLogout() {
    const { logoutRequest } = this.props
    logoutRequest()
  }

  render() {
    return (
      <Styled.FlexContainer padded>
        <CustomButton
          title={Strings.button.logout}
          onPress={this.onPressLogout}
        />
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
    getUserListRequest: () => dispatch(UserActions.getUserListRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelListScreen)