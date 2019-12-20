import React from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { PlaceholderImage, PlaceholderText } from 'react-native-awesome-component';
import { is } from 'ramda';
import { Colors } from '../Themes';

const Bullet = (props) => {
  const { active } = props
  return (
    <View
      style={{
        width: 15,
        height: 15,
        borderRadius: 15,
        backgroundColor: active ? Colors.green1 : Colors.cloud
      }}
    />
  )
}

export default class UserItem extends React.Component {
  render() {
    const { user, selected, onPress } = this.props
    const avatarURL = user.avatar_url;
    const username = user.username;
    let selectedComponent = null

    if (is(Boolean, selected)) {
      selectedComponent = (
        <View style={{ marginRight: 10 }}>
          <Bullet active={selected} />
        </View>
      )
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View
          style={{
            display: 'flex',
            height: 46.5,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}
        >
          <PlaceholderImage
            uri={avatarURL}
            width={30}
            height={30}
            resizeMethod='resize'
            resizeMode='cover'
            radius={15}
          />
          <View style={{
            flex: 1,
            marginLeft: 10,
            fontSize: 14,
            color: '#2c2c36',
            borderBottomWidth: 1,
            borderBottomColor: '#ececec',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <PlaceholderText numberOfLines={1}>{username}</PlaceholderText>
          </View>
          {selectedComponent}
        </View>
      </TouchableOpacity>
    );
  }
}
