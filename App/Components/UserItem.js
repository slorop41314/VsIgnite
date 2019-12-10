import React from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { PlaceholderImage, PlaceholderText } from 'react-native-awesome-component';

export default class UserItem extends React.Component {
  render() {
    const { user } = this.props
    const avatarURL = user.avatar_url;
    const username = user.username;
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
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
        </View>
      </TouchableOpacity>
    );
  }
}
