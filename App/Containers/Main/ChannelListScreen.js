import React, { Component } from 'react'
import { Styled, CustomButton } from 'react-native-awesome-component'
import { connect } from 'react-redux'
import Strings from '../../Themes/Strings'
import AuthActions from '../../Redux/AuthRedux'

class ChannelListScreen extends Component {
  constructor(props) {
    super(props)

    this.onPressLogout = this.onPressLogout.bind(this)
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
    logoutRequest: () => dispatch(AuthActions.logoutRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelListScreen)