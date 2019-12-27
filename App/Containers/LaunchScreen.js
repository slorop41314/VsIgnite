import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'

// Styles
import { Styled } from 'react-native-awesome-component'

export default class LaunchScreen extends Component {
  render() {
    return (
      <Styled.FlexContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={Images.ignite} style={{ width: 250, height: 406 }} resizeMode='contain' />
      </Styled.FlexContainer>
    )
  }
}
