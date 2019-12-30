import React, { Component } from 'react'
import { Image, StyleSheet, TextInput, Text } from 'react-native'
import { Styled, CustomInput, CustomButton } from 'react-native-awesome-component'
import { connect } from 'react-redux'
import { Images, Colors } from '../../Themes'
import AuthActions from '../../Redux/AuthRedux'
import Strings from '../../Themes/Strings'
import { DefaultAccount } from '../../Data/Const'
import { getBottomSpace } from 'react-native-iphone-x-helper'

const styles = StyleSheet.create({
  logo: {
    width: 125,
    height: 203,
    alignSelf: 'center',
    marginBottom: 40,
  },
  container: {
    flex: 1,
    paddingTop: 100,
  },
  button: {
    marginTop: 25
  },
  footerContaienr: {
    paddingBottom: getBottomSpace(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeText: {
    color: Colors.facebook, fontWeight: 'bold'
  }
})

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: DefaultAccount.email,
      password: DefaultAccount.password,

      emailError: true,
      passwordError: true,
    }

    this.onPressLogin = this.onPressLogin.bind(this)
    this.onPressRegister = this.onPressRegister.bind(this)
  }

  onPressLogin() {
    const { loginRequest } = this.props
    const { email, password } = this.state
    loginRequest({ email, password })
  }

  onPressRegister() {
    const { navigation } = this.props
    navigation.navigate('RegisterScreen')
  }

  render() {
    const { email, password, emailError, passwordError } = this.state
    return (
      <Styled.FlexContainer style={styles.container}>
        <Styled.FlexContainer padded>
          <Image source={Images.ignite} style={styles.logo} resizeMode='cover' />
          <CustomInput
            setRef={r => this.emailInput = r}
            label={Strings.input.label.email}
            placeholder={Strings.input.placeholder.email}
            onChangeText={(email) => this.setState({ email })}
            defaultValue={email}
            value={email}
            inputType='email'
            isRequired={true}
            onChangeValidation={(isError) => this.setState({ emailError: isError })}
            onSubmitEditing={() => this.passwordInput.focus()}
          />
          <CustomInput
            setRef={r => this.passwordInput = r}
            label={Strings.input.label.password}
            placeholder={Strings.input.label.password}
            onChangeText={(password) => this.setState({ password })}
            defaultValue={password}
            value={password}
            inputType='password'
            isRequired={true}
            onChangeValidation={(isError) => this.setState({ passwordError: isError })}
          />
          <CustomButton
            title={Strings.button.login}
            containerStyle={styles.button}
            onPress={this.onPressLogin}
            disabled={(emailError || passwordError) ? true : false}
          />
        </Styled.FlexContainer>
        <Styled.Container isCard padded style={styles.footerContaienr}>
          <Text>I don't have account yet,
            <Text onPress={this.onPressRegister} style={styles.activeText}> create now</Text>
          </Text>
        </Styled.Container>
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
    loginRequest: (params) => dispatch(AuthActions.loginRequest(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)