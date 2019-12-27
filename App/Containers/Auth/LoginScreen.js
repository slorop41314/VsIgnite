import React, { Component } from 'react'
import { Image, StyleSheet } from 'react-native'
import { Styled, CustomInput, CustomButton } from 'react-native-awesome-component'
import { connect } from 'react-redux'
import { Images } from '../../Themes'
import AuthActions from '../../Redux/AuthRedux'

const styles = StyleSheet.create({
  logo: {
    width: 125,
    height: 203,
    alignSelf: 'center',
    marginBottom: 40,
  },
  container: {
    paddingTop: '30%'
  },
  button: {
    marginTop: 25
  }
})

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: 'rahmat@virtualspirit.me',
      password: 'Useruser12345!',

      emailError: true,
      passwordError: true,
    }

    this.onPressButton = this.onPressButton.bind(this)
  }

  onPressButton() {
    const { loginRequest } = this.props
    const { email, password } = this.state
    loginRequest({ email, password })
  }

  render() {
    const { email, password, emailError, passwordError } = this.state
    return (
      <Styled.FlexContainer padded style={styles.container}>
        <Image source={Images.ignite} style={styles.logo} resizeMode='cover' />
        <CustomInput
          setRef={r => this.emailInput = r}
          label='Email'
          placeholder='Enter Email'
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
          label='Password'
          placeholder='Enter Password'
          onChangeText={(password) => this.setState({ password })}
          defaultValue={password}
          value={password}
          inputType='password'
          isRequired={true}
          onChangeValidation={(isError) => this.setState({ passwordError: isError })}
        />
        <CustomButton
          title='login'
          containerStyle={styles.button}
          onPress={this.onPressButton}
          disabled={(emailError || passwordError) ? true : false}
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
    loginRequest: (params) => dispatch(AuthActions.loginRequest(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)