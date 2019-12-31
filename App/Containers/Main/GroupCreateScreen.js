import React, { Component } from 'react'
import { Styled } from 'react-native-awesome-component'
import { Text } from 'react-native'
import { connect } from 'react-redux'

class GroupCreateScreen extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Styled.FlexContainer>
        <Text>Group Screen</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupCreateScreen)

