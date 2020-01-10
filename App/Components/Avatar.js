import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { PlaceholderImage, PlaceholderText } from 'react-native-awesome-component'
import { Colors } from '../Themes'
import getInitialFromName from '../Transforms/GetInitialFromName'

const AVATAR_WIDTH = 50

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: Colors.steel,
    width: AVATAR_WIDTH, 
    height: AVATAR_WIDTH, 
    borderRadius: AVATAR_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

const Avatar = (props) => {
  const { source, name, size } = props
  if (source && source.includes('http')) {
    return (
      <View style={[styles.avatarContainer, size ? { width: size, height: size, borderRadius: size / 2 } : {}]}>
        <PlaceholderImage uri={source} width={size ? size : AVATAR_WIDTH} height={size ? size : AVATAR_WIDTH} radius={size ? size : AVATAR_WIDTH / 2} />
      </View>
    )
  } else {
    return (
      <View style={[styles.avatarContainer, size ? { width: size, height: size, borderRadius: size / 2 } : {}]}>
        <Text numberOfLines={1}>{getInitialFromName(name)}</Text>
      </View>
    )
  }
}

export default Avatar