import React, { Component } from 'react'
import { Styled } from 'react-native-awesome-component'
import { connect } from 'react-redux'

class ChannelListScreen extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Styled.FlexContainer>

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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelListScreen)