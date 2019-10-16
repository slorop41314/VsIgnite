import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/CustomFlatListItemStyle'
import { Styled, PlaceholderImage, PlaceholderText } from 'react-native-awesome-component'

const CustomFlatListItem = (props) => {
  let { data } = props
  return (
    <Styled.Container isCard padded style={{ flexDirection: 'row' }}>
      <PlaceholderImage
        uri={data.avatar}
      />
      <View style={{ marginLeft: 15, marginTop: 5, flex: 1 }}>
        <PlaceholderText numberOfLines={1}>{data.name}</PlaceholderText>
        <PlaceholderText numberOfLines={1}>{data.email}</PlaceholderText>
        <PlaceholderText numberOfLines={1}>{data.github}</PlaceholderText>
      </View>
    </Styled.Container>
  )
}

export default CustomFlatListItem