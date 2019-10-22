import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { CustomInput, Styled } from 'react-native-awesome-component'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icons from 'react-native-vector-icons/FontAwesome5'

// Styles
import styles from './Styles/CustomInputScreenStyle'
import { Colors } from '../Themes'

class CustomInputScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      password: '',
      confirmPassword: '',
      email: '',
      phoneNumber: '',
      description: '',
      qty: '',
      showPassword: false,
    }
  }

  render() {
    const { userId, password, confirmPassword, email, phoneNumber, description, qty, showPassword } = this.state

    return (
      <KeyboardAwareScrollView style={{ flex: 1 }} extraScrollHeight={30}>
        <Styled.Container padded isCard >
          <CustomInput
            placeholder={'Enter Id'}
            label={'User ID'}
            labelType={'top-label'}
            underlineWidth={1}
            isRequired={true}
            maxLength={10}
            minLength={5}
            value={userId}
            onChangeText={(text) => this.setState({ userId: text })}
            renderLeftAction={() => {
              return (
                <View style={{ marginRight: 10 }}>
                  <Icons name={'envelope'} color={Colors.steel} size={20} />
                </View>
              )
            }}
          />
          <CustomInput
            placeholder={'Enter Password'}
            label={'Password'}
            labelType={'top-label'}
            underlineWidth={1}
            inputType={'password'}
            isRequired={true}
            value={password}
            onChangeText={(text) => this.setState({ password: text })}
            secureTextEntry={showPassword ? false : true}
            renderRightAction={() => {
              return (
                <TouchableOpacity activeOpacity={0.8} style={{ marginLeft: 10 }} onPress={() => this.setState({ showPassword: !showPassword })}>
                  <Icons name={showPassword ? 'eye' : 'eye-slash'} color={Colors.steel} size={20} />
                </TouchableOpacity>
              )
            }}
          />
          <CustomInput
            placeholder={'Re Enter Password'}
            label={'Confirm password'}
            labelType={'top-label'}
            underlineWidth={1}
            inputType={'password'}
            isRequired={true}
            value={confirmPassword}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            forceErrorMessage={password !== confirmPassword && 'Confirmation password do not match'}
          />
          <CustomInput
            placeholder={'Enter Email'}
            label={'Email'}
            labelType={'top-label'}
            underlineWidth={1}
            inputType={'email'}
            isRequired={true}
            value={email}
            onChangeText={(text) => this.setState({ email: text })}
          />
          <CustomInput
            placeholder={'Enter Phone Number'}
            label={'Phone number'}
            labelType={'top-label'}
            underlineWidth={1}
            inputType={'phone'}
            isRequired={true}
            value={phoneNumber}
            onChangeText={(text) => this.setState({ phoneNumber: text })}
          />
          <CustomInput
            placeholder={'Enter Description'}
            label={'Description'}
            labelType={'top-label'}
            underlineWidth={1}
            inputType={'text-area'}
            isRequired={true}
            value={description}
            onChangeText={(text) => this.setState({ description: text })}
          />
          <CustomInput
            placeholder={'Enter qty'}
            label={'Qty'}
            labelType={'top-label'}
            underlineWidth={1}
            inputType={'number'}
            isRequired={true}
            value={qty}
            onChangeText={(text) => this.setState({ qty: text })}
          />
        </Styled.Container>
      </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomInputScreen)
