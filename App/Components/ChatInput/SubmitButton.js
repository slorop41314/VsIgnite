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
import { ChatInputContext } from '.';

const styles = StyleSheet.create({
  sendButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.eggplant,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

const SubmitButton = (props) => {
  const { onPress } = props
  function onPressMic() {

  }

  return (
    <ChatInputContext.Consumer>
      {({ message }) => {
        const disableSubmit = message.length <= 0
        if (disableSubmit) {
          return (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.sendButtonContainer} activeOpacity={0.8}
                onPress={onPressMic}
              >
                <Icons name='microphone' size={20} color={Colors.snow} />
              </TouchableOpacity>
            </View>
          )
        } else {
          return (
            <TouchableOpacity
              style={[styles.sendButtonContainer]} activeOpacity={0.8}
              onPress={() => onPress(PubnubStrings.message.type.text, message)}>
              <Icons name='paper-plane' size={18} color={Colors.snow} />
            </TouchableOpacity>
          )
        }
      }}
    </ChatInputContext.Consumer>
  )
}

export default SubmitButton