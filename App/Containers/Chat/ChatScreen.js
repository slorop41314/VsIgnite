import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { values } from 'ramda'
import debounce from 'lodash.debounce';
import xs from 'xstream';
import dateFns from 'date-fns';

import * as Qiscus from '../../Qiscus';

import Toolbar from '../../Components/Toolbar';
import MessageList from '../../Components/MessageList';
import ChatInput from '../../Components/ChatInput';
import EmptyChat from '../../Components/EmptyChat';
import { Images } from '../../Themes';

import QiscusActions from '../../Redux/QiscusRedux'
import { connect } from 'react-redux'
import QiscusStrings from '../../Qiscus/QiscusStrings';
import QiscusManager from '../../Qiscus/QiscusManager';

class ChatScreen extends React.Component {
  itemPerPage = 20;

  constructor(props) {
    super(props)
    const room = props.navigation.getParam('room');
    props.setActiveRoomRequest({ roomId: room.id })

    this.state = {
      room,
      isOnline: false,
      isTyping: false,
      lastOnline: undefined,
      typingUsername: undefined,
    }
  }

  componentDidMount() {
    const { room } = this.state
    this.props.getMessagesRequest({
      roomId: room.id,
      options: {
        // last_comment_id: room.last_comment_id,
        limit: this.itemPerPage,
      },
    })

    this.props.readMessageRequest({
      roomId: room.id,
      lastReadMessageId: room.last_comment_id,
    })
  }

  componentWillUnmount() {
    this.props.exitActiveRoomRequest()
  }

  render() {
    const { room } = this.state;
    const messages = this.messages;
    const roomName = room ? room.name : 'Chat';
    const avatarURL = room ? room.avatar : null;

    const { roomTypingStatus } = this.props

    return (
      <View
        style={styles.container}
        keyboardVerticalOffset={StatusBar.currentHeight}
        behavior="padding"
        enabled>
        <Toolbar
          title={<Text style={styles.titleText}>{roomName}</Text>}
          onPress={this._onToolbarClick}
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flex: 0,
              }}>
              <Image
                source={Images.qiscusBack}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
              <Image
                source={{ uri: avatarURL }}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'cover',
                  borderRadius: 50,
                  marginLeft: 10,
                }}
              />
            </TouchableOpacity>
          )}
          renderMeta={() => (
            <View style={styles.onlineStatus}>
              {roomTypingStatus && (
                <Text style={styles.typingText}>
                  {roomTypingStatus.username} is typing...
                </Text>
              )}
              {/* {this._renderOnlineStatus()} */}
              {/* {this.isGroup && (
              <Text style={styles.typingText}>{this.participants}</Text>
            )} */}
            </View>
          )}
        />

        {messages.length === 0 && <EmptyChat />}
        {messages.length > 0 && (
          <MessageList
            isLoadMoreable={messages[0].comment_before_id !== 0}
            messages={messages}
            scroll={this.state.scroll}
          // onLoadMore={this._loadMore}
          />
        )}

        <ChatInput
          room={room}
          onSubmit={this._submitMessage}
          onSelectFile={() => this.openCamera()}
        />
      </View>
    );
  }

  _renderOnlineStatus = () => {
    const { isGroup } = this;
    const { isTyping, isOnline, lastOnline, room } = this.state;
    if (room == null) return;
    if (isGroup || isTyping) return;

    const lastOnlineText = dateFns.isSameDay(lastOnline, new Date())
      ? dateFns.format(lastOnline, 'hh:mm')
      : '';

    return (
      <>
        {isOnline && <Text style={styles.onlineStatusText}>Online</Text>}
        {!isOnline && <Text style={styles.typingText}>{lastOnlineText}</Text>}
      </>
    );
  };

  _prepareMessage = message => {
    const date = new Date();
    return {
      id: date.getTime(),
      timestamp: date.getTime(),
      type: 'text',
      status: 'sending',
      message: message,
      // email: Qiscus.currentUser().email,
    };
  };

  _prepareFileMessage = (message, fileURI) => {
    return {
      ...this._prepareMessage(message),
      type: 'upload',
      fileURI,
    };
  };

  _submitMessage = async text => {
    const message = this._prepareMessage(text);
    await this._addMessage(message, true);

    this.props.sendMessageRequest({
      roomId: this.state.room.id,
      text: text,
      type: message.type,
    })
  };

  _onSelectFile = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Select image',
        storageOptions: {
          skipBackup: true,
          // path: 'images',
        },
      },
      resp => {
        if (resp.didCancel) console.tron.error('user cancel');
        if (resp.error) console.tron.error('error when getting file', resp.error);

        const message = this._prepareFileMessage('File attachment', resp.uri);

        this.props.sendMessageRequest({
          roomId: this.state.room.id,
          text: message.message,
          uniqueId: message.uniqueId,
          type: QiscusStrings.message_type.custom, // message type
          needToUpload: true,
          toUpload: {
            uri: resp.uri,
            type: resp.type,
            name: resp.fileName,
          },
        })
      },
    );
  };

  async openCamera() {
    try {
      this._onSelectFile()
    } catch (err) {
      console.tron.error(err);
    }
  }

  _addMessage = (message, scroll = false) =>
    new Promise(resolve => {
      this.setState({
        scroll,
      },
        () => {
          if (scroll === false) return;
          const timeoutId = setTimeout(() => {
            this.setState({ scroll: false }, () => {
              clearTimeout(timeoutId);
              resolve();
            });
          }, 400);
        },
      );
    });

  _sortMessage = messages =>
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  _onToolbarClick = () => {
    const roomId = this.state.room.id;
    this.props.navigation.navigate('RoomInfo', { roomId });
  };

  get isGroup() {
    if (this.state.room == null || this.state.room.room_type == null)
      return false;
    return this.state.room.room_type === 'group';
  }

  get participants() {
    const room = this.state.room;
    if (room == null || room.participants == null) return;
    const limit = 3;
    const overflowCount = room.participants.length - limit;
    const participants = room.participants
      .slice(0, limit)
      .map(it => it.username.split(' ')[0]);
    if (room.participants.length <= limit) return participants.join(', ');
    return participants.concat(`and ${overflowCount} others.`).join(', ');
  }

  get messages() {
    return this._sortMessage(Object.values(this.props.messages[this.state.room.id] || []));
  }
}

const mapStateToProps = (state) => {
  return {
    qiscusUser: state.qiscus.currentUser,
    messages: state.qiscus.messages,
    roomTypingStatus: state.qiscus.roomTypingStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveRoomRequest: (params) => dispatch(QiscusActions.setActiveRoomRequest(params)),
    exitActiveRoomRequest: () => dispatch(QiscusActions.exitActiveRoomRequest()),
    getMessagesRequest: (params) => dispatch(QiscusActions.getMessagesRequest(params)),
    sendMessageRequest: (params) => dispatch(QiscusActions.sendMessageRequest(params)),
    readMessageRequest: (params) => dispatch(QiscusActions.readMessageRequest(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  onlineStatus: {},
  onlineStatusText: {
    fontSize: 12,
    color: '#94ca62',
  },
  typingText: {
    fontSize: 12,
    color: '#979797',
  },
  titleText: {
    fontSize: 16,
  },
});
