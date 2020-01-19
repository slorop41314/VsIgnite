import React, { Component } from 'react'
import { Styled, CustomButton, PlaceholderImage, PlaceholderText } from 'react-native-awesome-component'
import { Text, ScrollView, Dimensions, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import Strings from '../../Themes/Strings'
import AuthActions from '../../Redux/AuthRedux'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import PubnubActions from '../../Redux/PubnubRedux'
import { Colors } from '../../Themes'
import FullButton from '../../Components/FullButton'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  textName: {
    color: Colors.eggplant,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  textEmail: {
    color: Colors.coal,
    fontWeight: 'normal',
    fontSize: 14,
    textAlign: 'center',
  },
  nameContainer: {
    marginTop: 20,
    marginBottom: 40
  },
  emptyPhotoContainer: {
    width,
    height: width,
    backgroundColor: Colors.steel
  }
})

class UserProfileScreen extends Component {
  constructor(props) {
    super(props)
    this.isMe = props.navigation.getParam('isMe')
    this.onPressLogout = this.onPressLogout.bind(this)
  }

  onPressLogout() {
    const { logoutRequest } = this.props
    logoutRequest()
  }

  render() {
    const { currentUser } = this.props
    const user = this.isMe ? currentUser : {}
    return (
      <Styled.FlexContainer>
        <ScrollView>
          {user.profileUrl ? (
            <PlaceholderImage
              uri={user.profileUrl}
              width={width}
              height={width}
            />
          ) : (
            <View style={styles.emptyPhotoContainer}>

            </View>
          )}
          <Styled.Container padded style={styles.nameContainer}>
            <PlaceholderText style={styles.textName} numberOfLines={1}>{user.name}</PlaceholderText>
            <PlaceholderText style={styles.textEmail} numberOfLines={1}>{user.email}</PlaceholderText>
          </Styled.Container>
          {this.isMe && (
            <CustomButton
              title={Strings.button.logout}
              onPress={this.onPressLogout}
              containerStyle={{ marginBottom: getBottomSpace() }}
            />
          )}
        </ScrollView>
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.pubnubStore.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutRequest: () => dispatch(AuthActions.logoutRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen)

