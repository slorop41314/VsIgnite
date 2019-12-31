import React from 'react'
import { TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Styled, PlaceholderText } from 'react-native-awesome-component'
import Avatar from './Avatar'

const UserRowItem = (props) => {
  const { currentUser, data, onPress } = props
  const isMe = data.email === currentUser.email
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Styled.Container padded style={{ flexDirection: 'row', alignItems: 'center' }} >
        <Avatar source={data.avatar} name={data.fullname} />
        <Styled.FlexContainer>
          <PlaceholderText numberOfLines={1} style={{ marginLeft: 10 }}>{data.loading ? undefined : `${data.fullname}${isMe ? ' (you)' : ''}`}</PlaceholderText>
        </Styled.FlexContainer>
      </Styled.Container>
    </TouchableOpacity>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRowItem)