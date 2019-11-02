import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import TestConnectionActions from '../Redux/TestConnectionRedux'

// Styles
import styles from './Styles/TestConnectionScreenStyle'

class TestConnectionScreen extends Component {
  constructor(props) {
    super(props)

    this.press200 = this.press200.bind(this)
    this.press400 = this.press400.bind(this)
    this.press500 = this.press500.bind(this)
  }

  press200() {
    const { test200Request } = this.props
    test200Request()
  }

  press400() {
    const { test400Request } = this.props
    test400Request()
  }

  press500() {
    const { test500Request } = this.props
    test500Request()
    setTimeout(() => {
      test500Request()
    }, 1000)
  }

  render() {
    return (
      <ScrollView style={[styles.container, { padding: 15 }]}>
        <Button
          title={'TEST 200 RESPONSE'}
          onPress={this.press200}
        />
        <Button
          title={'TEST 400 RESPONSE'}
          onPress={this.press400}
        />
        <Button
          title={'TEST 500 RESPONSE'}
          onPress={this.press500}
        />
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
    test200Request: (params) => dispatch(TestConnectionActions.test200Request(params)),
    test400Request: (params) => dispatch(TestConnectionActions.test400Request(params)),
    test500Request: (params) => dispatch(TestConnectionActions.test500Request(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestConnectionScreen)
