import React, { Component } from 'react'
import { Styled, CustomInput, CustomButton } from 'react-native-awesome-component'
import { Text, ScrollView, View, StyleSheet, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import Avatar from '../../Components/Avatar'
import PubnubManager from '../../Pubnub/PubnubManager'
import { Colors } from '../../Themes'
import PubnubActions from '../../Redux/PubnubRedux'
import PubnubStrings from '../../Pubnub/PubnubStrings'

const PADDING = 10

const styles = StyleSheet.create({
  container: {

  },
  memberContainer: {
    marginTop: 10,
  },
  memberLabel: {
    color: Colors.coal,
    fontSize: 13,
  },
  userItem: {
    width: (Dimensions.get('screen').width - (PADDING * 2)) / 5,
    alignItems: 'center',
    marginTop: 10,
  }
})

class GroupCreateScreen extends Component {
  constructor(props) {
    super(props)
    this.members = props.navigation.getParam('members')

    this.state = {
      groupName: '',
      groupDesc: '',
      groupNameError: true
    }

    this.currentPubnubUser = PubnubManager.getCurrentUser()
    this.onPressCreateGroup = this.onPressCreateGroup.bind(this)
  }

  onPressCreateGroup() {
    const { groupDesc, groupName } = this.state
    const { createPubnubSpaceRequest } = this.props
    const params = {
      name: groupName,
      description: groupDesc,
      users: this.members,
      type: PubnubStrings.space.type.group
    }
    createPubnubSpaceRequest(params)
  }

  render() {
    const { groupNameError } = this.state
    return (
      <Styled.FlexContainer padded padding={PADDING}>
        <ScrollView>
          <CustomInput
            label={'Group Name'}
            placeholder={'Group Name'}
            isRequired
            inputType={'text'}
            onChangeText={text => this.setState({ groupName: text })}
            onChangeValidation={status => this.setState({ groupNameError: status })}
          />
          <CustomInput
            label={'Group Description'}
            placeholder={'Group Description'}
            inputType={'text-area'}
            onChangeText={text => this.setState({ groupName: text })}
          />
          <CustomButton
            title={'Create Group'}
            disabled={groupNameError}
            onPress={this.onPressCreateGroup}
          />
          <Styled.Container style={[styles.memberContainer]}>
            <Text style={[styles.memberLabel]}>{`Total member ${this.members.length}`}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {this.members.map((u) => {
                let spliceName = u.name.length > 10 ? `${u.name.slice(0, 10)}...` : u.name

                if (u.id === this.currentPubnubUser.id) {
                  spliceName = 'You'
                }

                return (
                  <View style={[styles.userItem]} key={u.id}>
                    <Avatar source={u.profileUrl} name={u.name} />
                    <Text>{spliceName}</Text>
                  </View>
                )
              })}
            </View>
          </Styled.Container>
        </ScrollView>
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
    createPubnubSpaceRequest: (params) => dispatch(PubnubActions.createPubnubSpaceRequest(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupCreateScreen)

