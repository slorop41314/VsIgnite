import React, { useState, useEffect, Component } from 'react'
import { Styled } from 'react-native-awesome-component'
import { View, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../../Themes';
import _ from 'lodash'
import ImagePicker from 'react-native-image-crop-picker';
import PubnubStrings from '../../Pubnub/PubnubStrings';
import Modal from 'react-native-modal'
import { checkOrParseString2Url, getUrlFromText, checkOrGetUrlFromString } from '../../Lib/Helper'
import { connect } from 'react-redux'
import Avatar from '../Avatar'

export const MENTION_ITEM_HEIGHT = 45

const styles = StyleSheet.create({
  container: {
    height: MENTION_ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  name: {
    fontSize: 15,
    color: Colors.charcoal,
    marginLeft: 5
  }
})

class MentionItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, onPress } = this.props
    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(data)} activeOpacity={0.9}>
        <Avatar source={data.profileUrl} name={data.name} size={30} />
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.name} >{data.name}</Text>
      </TouchableOpacity>
    )
  }
}

export default MentionItem