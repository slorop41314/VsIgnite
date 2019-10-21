import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { CustomInput, Styled } from 'react-native-awesome-component'

// Styles
import styles from './Styles/CustomInputScreenStyle'

class CustomInputScreen extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        {/* <KeyboardAvoidingView behavior='position'> */}
        <Styled.Container padded isCard>
          <CustomInput
            placeholder={'Enter Id'}
            label={'User ID'}
            labelType={'top-label'}
            underlineWidth={1}
            isRequired={true}
          />
          <CustomInput
            placeholder={'Enter Password'}
            label={'Password'}
            labelType={'top-label'}
            underlineWidth={1}
            inputType={'password'}
            isRequired={true}
            onChangeText={(text) => console.log({text})}
          />
          <CustomInput
            placeholder={'Enter Email'}
            label={'Email'}
            labelType={'top-label'}
            underlineWidth={1}
            inputType={'email'}
            isRequired={true}
          />
        </Styled.Container>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
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
