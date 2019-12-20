import React, { Component } from 'react'
import { Styled, CustomInput, CustomButton } from 'react-native-awesome-component'
import { Text, ScrollView, TouchableOpacity, Image, View } from 'react-native'
import Toolbar from '../../Components/Toolbar'
import images from '../../Themes/Images'
import { Colors } from '../../Themes'
import { connect } from 'react-redux'
import QiscusActions from '../../Redux/QiscusRedux'
import NavigationServices from '../../Services/NavigationServices'

class GroupCreateInfoScreen extends Component {
  constructor(props) {
    super(props)
    const users = props.navigation.getParam('users')

    this.state = {
      users,
    }

    this.groupName = ''
    this.onPressCreate = this.onPressCreate.bind(this)
  }

  onPressCreate() {
    const { users } = this.state
    const { createGroupRoomRequest } = this.props

    const params = {
      name: this.groupName,
      options: {
        avatarUrl: undefined
      },
      userIds: users.map(u => u.email)
    }

    createGroupRoomRequest(params)
  }

  render() {
    const { users } = this.state
    return (
      <Styled.FlexContainer>
        <Toolbar
          title="Create Info"
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ justifyContent: 'center' }}
            >
              <Image
                source={images.qiscusBack}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          )}
        />
        <Styled.Container padded isCard style={{ flexDirection: 'row' }}>
          <View style={{ marginRight: 10 }}>
            <Image style={{ backgroundColor: Colors.steel, width: 70, height: 70, borderRadius: 35 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <CustomInput
              ref={r => this.inputRef = r}
              placeholder='Group Name'
              focusColor={Colors.green1}
              onChangeText={text => this.groupName = text}
            />
          </View>
        </Styled.Container>
        <Styled.Container padded isCard>
          <Text>{`members ${users.length}/100`}</Text>
        </Styled.Container>
        <ScrollView>
          <Styled.FlexContainer padded style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {users.map((u) => {
              return <View style={{ alignItems: 'center', width: '25%', padding: 5 }}>
                <Image source={{ uri: u.avatar_url }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                <Text numberOfLines={1} ellipsizeMode={'tail'} >{u.name}</Text>
              </View>
            })}
          </Styled.FlexContainer>
        </ScrollView>
        <CustomButton title={'CREATE GROUP'} onPress={this.onPressCreate} />
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
    createGroupRoomRequest: (params) => dispatch(QiscusActions.createGroupRoomRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupCreateInfoScreen)