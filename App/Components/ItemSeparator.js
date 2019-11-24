import React from 'react'
import { View } from 'react-native'
import { Colors } from '../Themes'

export const ItemSeparator = (props) => {
  return (
    <View style={[{height: 1, backgroundColor: Colors.grey}]} />
  )
}