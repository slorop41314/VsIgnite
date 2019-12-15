import React, { Component } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import SessionActions from '../../Redux/SessionRedux'

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
    this.onPressLogout = this.onPressLogout.bind(this)
  }

  onPressLogout() {
    this.props.doLogout()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoutContainer}>
          <Button title={'LOGOUT'} onPress={this.onPressLogout} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    doLogout: () => dispatch(SessionActions.logoutRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)