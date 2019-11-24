import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Colors } from '../Themes'

const styles = StyleSheet.create({
  photoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grey,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  infoContainer: {
    marginLeft: 10,
    justifyContent: 'center'
  },
  textEmail: {
    fontSize: 15
  },
  textName: {
    fontSize: 18
  }
})

export const UserItem = (props) => {
  const { data, onPress } = props
  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.rowContainer]} onPress={onPress}>
      {data.photo ? (
        <Image source={{ uri: data.photo }} style={[styles.photoContainer]} resizeMethod='resize' resizeMode='cover' />
      ) : (
          <View style={[styles.photoContainer]} />
        )}
      <View style={[styles.infoContainer]}>
        <Text style={[styles.textName]}>{data.name}</Text>
        <Text style={[styles.textEmail]}>{data.email}</Text>
      </View>
    </TouchableOpacity>
  )
}