import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import dateFns from 'date-fns'
import { PlaceholderImage, PlaceholderText } from 'react-native-awesome-component';

export default class RoomItem extends React.PureComponent {
  getTime = (time) => {
    if (dateFns.isSameDay(time, new Date())) {
      return dateFns.format(time, 'HH:mm')
    }
    return dateFns.format(time, 'DD/MM/YYYY')
  };

  onClick = (roomId) => {
    this.props.onClick && this.props.onClick(roomId)
  };

  render() {
    const { data } = this.props
    let room = {}
    let lastComment = undefined
    let unreadCount = undefined
    let lastCommentDate = undefined


    if (data && data.loading !== true) {
      room = data
      lastComment = room.last_comment_message.startsWith('[file]') ? 'File attachment' : room.last_comment_message;
      unreadCount = Number(room.count_notif);
      lastCommentDate = this.getTime(room.last_comment_message_created_at)
    }

    return (
      <TouchableOpacity style={styles.container} onPress={() => this.onClick(room.id)}>
        <PlaceholderImage uri={room.avatar} width={40} height={40} radius={20} />
        <View style={styles.dataContainer}>
          <View style={styles.content}>
            <PlaceholderText numberOfLines={1} style={styles.name}>{room.name}</PlaceholderText>
            <PlaceholderText numberOfLines={1} style={styles.lastMessage}>{lastComment}</PlaceholderText>
          </View>
          <View style={styles.meta}>
            {data.loading !== true && (
              <Text numberOfLines={1} style={styles.time}>
                {lastCommentDate}
              </Text>
            )}
            {data.loading !== true && unreadCount > 0  && (
              <Text numberOfLines={1} style={styles.unreadCount}>{unreadCount}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
  },
  avatar: {
    flex: 0,
    flexBasis: 40,
    flexShrink: 0,
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  dataContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
    marginLeft: 10,
    paddingBottom: 16
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: '#2c2c36'
  },
  lastMessage: {
    fontSize: 11,
    color: '#979797',
    maxWidth: 175,
  },
  meta: {
    flex: 0,
    flexBasis: 55,
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  time: {
    fontSize: 10,
    textAlign: 'right',
    color: '#979797',
  },
  unreadCount: {
    fontSize: 10,
    color: 'white',
    backgroundColor: '#94ca62',
    borderRadius: 50,
    minWidth: 14,
    textAlign: 'center',
    marginTop: 5,
  }
});
