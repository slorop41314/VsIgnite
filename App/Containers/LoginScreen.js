import React, { Component } from 'react'
import { ScrollView, Text, View, KeyboardAvoidingView, TextInput, Button, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import FEActions from '../Redux/FireEngineRedux'

// Styles
import styles from './Styles/LoginScreenStyle'
import { setUser } from '../Services/firestore-chat-engine/chat-engine'

import FireEngine from '../Services/firestore-chat-engine'
import FireEngineManager from '../Services/FireEngineManager'

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: 'me@rahmat.xyz',
      fullname: 'rahmat',
      photo: 'http://rahmatzulfikri.xyz/images/avatar.jpg'
    }
    this.onPressLogin = this.onPressLogin.bind(this)
  }

  async onPressLogin() {
    const user = this.state
    this.props.fireEngineInit(user)
  }

  render() {
    const { email, fullname } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 10, justifyContent: "center", }}>
          <TextInput
            placeholder='enter email'
            style={{ height: 50, borderWidth: 1, paddingHorizontal: 10, marginBottom: 10, borderRadius: 5 }}
            onChangeText={(email) => this.setState({ email })}
            defaultValue={email}
          />
          <TextInput
            placeholder='enter fullname'
            style={{ height: 50, borderWidth: 1, paddingHorizontal: 10, marginBottom: 10, borderRadius: 5 }}
            onChangeText={(fullname) => this.setState({ fullname })}
            defaultValue={fullname}
          />
          <Button
            title={'CHAT NOW'}
            onPress={this.onPressLogin}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fireEngineInit: (params) => dispatch(FEActions.initFireEngineRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
