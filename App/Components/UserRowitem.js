import React from 'react'
import { TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Styled, PlaceholderText } from 'react-native-awesome-component'
import Avatar from './Avatar'
import Icons from 'react-native-vector-icons/FontAwesome5'
import { Colors } from '../Themes'

const UserRowItem = (props) => {
  const { currentUser, data, onPress, isSelected } = props
  const isMe = data.id === currentUser.id
  let renderCheck = null

  if ((data.loading === undefined) && !isMe && isSelected !== undefined) {
    if (isSelected) {
      renderCheck = <Icons name='circle' solid size={18} color={Colors.eggplant} />
    } else {
      renderCheck = <Icons name='circle' light size={18} color={Colors.eggplant} />
    }
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={isMe}>
      <Styled.Container padded style={{ flexDirection: 'row', alignItems: 'center' }} >
        <Avatar source={data.profileUrl} name={data.name} />
        <Styled.FlexContainer>
          <PlaceholderText numberOfLines={1} style={{ marginLeft: 10 }}>{data.loading ? undefined : `${data.name}${isMe ? ' (you)' : ''}`}</PlaceholderText>
        </Styled.FlexContainer>
        {renderCheck}
      </Styled.Container>
    </TouchableOpacity>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.pubnubStore.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRowItem)