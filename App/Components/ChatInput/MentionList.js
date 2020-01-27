import React, { useState, useEffect, Component } from 'react'
import { Styled, Method } from 'react-native-awesome-component'
import { View, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Text, Image, ScrollView, FlatList } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../../Themes';
import _ from 'lodash'
import ImagePicker from 'react-native-image-crop-picker';
import PubnubStrings from '../../Pubnub/PubnubStrings';
import Modal from 'react-native-modal'
import { checkOrParseString2Url, getUrlFromText, checkOrGetUrlFromString } from '../../Lib/Helper'
import { connect } from 'react-redux'
import MentionItem, { MENTION_ITEM_HEIGHT } from './MentionItem';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    position: 'absolute',
    width: '100%'
  },
  border: {
    height: 1,
    backgroundColor: Colors.steel
  }
})

class MentionList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { members, onSelect, search } = this.props
    let containerStyle = styles.container

    // Filter User
    const filterMember = members.filter(m => {
      return m.name.toLowerCase().includes(search.toLowerCase())
    })

    console.tron.error({ filterMember, members, search })

    if (filterMember.length > 0) {
      if (filterMember.length > 3) {
        containerStyle = {
          ...containerStyle,
          height: 4 * MENTION_ITEM_HEIGHT,
          top: -(4 * MENTION_ITEM_HEIGHT)
        }
      } else {
        containerStyle = {
          ...containerStyle,
          height: filterMember.length * MENTION_ITEM_HEIGHT,
          top: -(filterMember.length * MENTION_ITEM_HEIGHT)
        }
      }
    }

    // containerStyle = {
    //   ...containerStyle,
    //   height: 100,
    //   top: -100
    // }

    return (
      <Styled.Container isCard style={containerStyle}>
        <FlatList
          data={filterMember}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <MentionItem data={item} onPress={onSelect} />}
          ItemSeparatorComponent={() => <View style={styles.border} />}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={'handled'}
        />
      </Styled.Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { channel } = props
  let members = []
  if (state.pubnubStore.spaces[channel] && state.pubnubStore.spaces[channel].members) {
    members = state.pubnubStore.spaces[channel].members.map(m => m.user)
  }

  return {
    members,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MentionList)