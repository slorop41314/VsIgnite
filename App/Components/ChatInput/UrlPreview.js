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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    alignItems: 'center'
  },
  imageContainer: {

  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  closeAction: {
    marginLeft: 10,
  },
  titlePreview: {
    color: Colors.coal,
    fontSize: 16,
  },
  descPreview: {
    color: Colors.coal,
    fontSize: 14,
  },
  urlPreview: {
    color: Colors.link,
    fontSize: 12,
  },
})

class UrlPreview extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const thisData = this.props.data
    const nextData = nextProps.data

    return JSON.stringify(thisData) !== JSON.stringify(nextData)
  }

  render() {
    const { data, onClose } = this.props
    const { url, title, description, images } = data
    return (
      <Styled.Container padded isCard style={styles.container}>
        <View>
          {(images.length > 0) && (
            <Image source={{ uri: images[0] }} style={styles.imagePreview} />
          )}
        </View>
        <View style={styles.contentContainer}>
          {(title !== undefined) && <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.titlePreview}>{title}</Text>}
          {(description !== undefined) && <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.descPreview}>{description}</Text>}
          {(url !== undefined) && <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.urlPreview}>{url}</Text>}
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={styles.closeAction}>
          <Icons name='times-circle' color={Colors.eggplant} size={20} />
        </TouchableOpacity>
      </Styled.Container>
    )
  }
}

export default UrlPreview