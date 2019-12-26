import React, { Component } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import SessionActions from '../../Redux/SessionRedux'
import { CustomInput, Styled, CustomButton } from 'react-native-awesome-component'
import Toolbar from '../../Components/Toolbar'
import { Images, Colors } from '../../Themes'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import QiscusActions from '../../Redux/QiscusRedux'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  logoutContainer: {
    marginTop: 100
  }
})

class ProfileScreen extends Component {
  constructor(props) {
    super(props)
    const { qiscusUser } = props
    this.state = {
      name: qiscusUser.username,
      status: qiscusUser.extras.status ? qiscusUser.extras.status : ''
    }
    this.onPressUpdate = this.onPressUpdate.bind(this)
    this.onPressLogout = this.onPressLogout.bind(this)
  }

  onPressLogout() {
    this.props.doLogout()
  }

  onPressUpdate() {
    const { updateUserRequest } = this.props
    const { name, status } = this.state
    const params = {
      name,
      extras: { status }
    }
    updateUserRequest(params)
  }

  render() {
    const { name, status } = this.state
    return (
      <Styled.FlexContainer>
        <Toolbar
          title="Profile"
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ justifyContent: 'center' }}
            >
              <Image
                source={Images.qiscusBack}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          )}
        />
        <Styled.FlexContainer padded>
          <CustomInput
            labelType='top-label'
            label='Name'
            placeholder='Input Name'
            defaultValue={name}
            onChangeText={name => this.setState({ name })}
          />
          <CustomInput
            labelType='top-label'
            label='Status'
            placeholder='Input Status'
            defaultValue={status}
            onChangeText={status => this.setState({ status })}
          />
          <CustomButton
            title='Update'
            radius={5}
            onPress={this.onPressUpdate}
          />
        </Styled.FlexContainer>
        <Styled.Container padded style={{ paddingBottom: getBottomSpace() }}>
          <CustomButton
            title='Logout'
            radius={5}
            onPress={this.onPressLogout}
            activeColor={Colors.error}
          />
        </Styled.Container>
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    qiscusUser: state.qiscus.currentUser,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserRequest: (params) => dispatch(QiscusActions.updateUserRequest(params)),
    doLogout: () => dispatch(SessionActions.logoutRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)