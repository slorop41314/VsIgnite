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
import debounce from 'lodash.debounce';
import xs from 'xstream';
import dateFns from 'date-fns';

import * as Qiscus from '../../Qiscus';

import Toolbar from '../../Components/Toolbar';
import MessageList from '../../Components/MessageList';
import Form from '../../Components/Form';
import EmptyChat from '../../Components/EmptyChat';
import { Images } from '../../Themes';

import QiscusActions from '../../Redux/QiscusRedux'
import { connect } from 'react-redux'

class ChatScreen extends React.Component {
  itemPerPage = 50;

  constructor(props) {
    super(props)
    const room = props.navigation.getParam('room');

    this.state = {
      room,
      isOnline: false,
      isTyping: false,
      lastOnline: undefined,
      typingUsername: undefined,
    }
  }

  componentDidMount() {
    this.props.getMessagesRequest({
      roomId: this.state.room.id, 
      options: {
        // last_comment_id: room.last_comment_id,
        limit: this.itemPerPage,
      },
    })

    // const subscription1 = Qiscus.isLogin$()
    //   .take(1)
    //   .map(() => xs.from(Qiscus.qiscus.getRoomById(roomId)))
    //   .flatten()
    //   .subscribe({
    //     next: room => this.setState({room}),
    //   });
    // const subscription2 = Qiscus.isLogin$()
    //   .take(1)
    //   .map(() => xs.from(Qiscus.qiscus.loadComments(roomId)))
    //   .flatten()
    //   .subscribe({
    //     next: messages => {
    //       const message = messages[0] || {};
    //       const isLoadMoreable = message.comment_before_id !== 0;
    //       const formattedMessages = messages.reduce((result, message) => {
    //         result[message.unique_temp_id] = message;
    //         return result;
    //       }, {});
    //       this.setState({
    //         messages: formattedMessages,
    //         isLoadMoreable,
    //       });
    //     },
    //   });

    // this.subscription = xs
    //   .merge(
    //     Qiscus.newMessage$().map(this._onNewMessage),
    //     Qiscus.messageRead$().map(this._onMessageRead),
    //     Qiscus.messageDelivered$().map(this._onMessageDelivered),
    //     Qiscus.onlinePresence$().map(this._onOnline),
    //     Qiscus.typing$()
    //       .filter(it => Number(it.room_id) === this.state.room.id)
    //       .map(this._onTyping),
    //   )
    //   .subscribe({
    //     next: () => {},
    //     error: error => console.tron.error('subscription error', error),
    //   });
  }

  // componentDidUpdate(prevProps) {
  //   console.tron.log({ prevProps });
  //   console.tron.log({ 'this.props': this.props });
  //   const { messages, getMessages } = this.props

  //   if(!getMessages.fetching && prevProps.getMessages.fetching) {
  //     console.tron.log({ 'this.state.messages': this.state.messages });
  //     const message = messages[0] || {};
  //     const isLoadMoreable = messages[0].comment_before_id !== 0;
  //     const formattedMessages = messages.reduce((result, message) => {
  //       result[message.unique_temp_id] = message;
  //       return result;
  //     }, {});
  //     this.setState({
  //       messages: formattedMessages,
  //       isLoadMoreable,
  //     });
  //   }
  // }

  componentWillUnmount() {
    // Qiscus.qiscus.exitChatRoom();

    // this.subscription && this.subscription.unsubscribe();
  }

  render() {
    const {room, isTyping, isOnline, lastOnline, typingUsername} = this.state;
    const messages = this.messages;
    const roomName = room ? room.name : 'Chat';
    const avatarURL = room ? room.avatar : null;

    const showTyping = room != null && !this.isGroup && isTyping;

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
                source={{uri: avatarURL}}
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
          // renderMeta={() => (
          //   <View style={styles.onlineStatus}>
          //     {this._renderOnlineStatus()}
          //     {showTyping && (
          //       <Text style={styles.typingText}>
          //         {typingUsername} is typing...
          //       </Text>
          //     )}
          //     {this.isGroup && (
          //       <Text style={styles.typingText}>{this.participants}</Text>
          //     )}
          //   </View>
          // )}
        />

        {messages.length === 0 && <EmptyChat />}
        {messages.length > 0 && (
          <MessageList
            isLoadMoreable={messages[0].comment_before_id !== 0}
            messages={messages}
            scroll={this.state.scroll}
            onLoadMore={this._loadMore}
          />
        )}

        <Form
          onSubmit={this._submitMessage}
          onSelectFile={() => this.openCamera()}
        />
      </View>
    );
  }

  _renderOnlineStatus = () => {
    const {isGroup} = this;
    const {isTyping, isOnline, lastOnline, room} = this.state;
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

  _onTyping = debounce(({username}) => {
    this.setState(
      {
        isTyping: true,
        typingUsername: username,
      },
      () => {
        setTimeout(
          () =>
            this.setState({
              isTyping: false,
              typingUsername: null,
            }),
          850,
        );
      },
    );
  }, 300);
  _onOnline = data => {
    this.setState({
      isOnline: data.isOnline,
      lastOnline: data.lastOnline,
    });
    return ['Online presence', data];
  };
  _onNewMessage = message => {
    this.setState(state => ({
      messages: {
        ...state.messages,
        [message.unique_temp_id]: message,
      },
    }));
    return 'New message';
  };

  _onMessageRead = ({comment}) => {
    // toast("message read");
    // const date = new Date(comment.timestamp);
    const results = this.messages
      // .filter(it => new Date(it.timestamp) <= date)
      .filter(it => it.timestamp <= comment.timestamp)
      .map(it => ({...it, status: 'read'}));

    const messages = results.reduce((result, item) => {
      const uniqueId = item.unique_id || item.unique_temp_id;
      result[uniqueId] = item;
      return result;
    }, {});
    this.setState(state => ({
      messages: {
        ...state.messages,
        ...messages,
      },
    }));
    return 'Message read';
  };

  _onMessageDelivered = ({comment}) => {
    // toast("message delivered");

    const results = this.messages
      .filter(it => it.timestamp <= comment.timestamp && it.status !== 'read')
      .map(it => ({...it, status: 'delivered'}));

    const messages = results.reduce((result, item) => {
      const uniqueId = item.unique_id || item.unique_temp_id;
      result[uniqueId] = item;
      return result;
    }, {});

    this.setState(state => ({
      messages: {
        ...state.messages,
        ...messages,
      },
    }));
    return 'Message delivered';
  };

  _prepareMessage = message => {
    const date = new Date();
    return {
      id: date.getTime(),
      uniqueId: '' + date.getTime(),
      unique_temp_id: '' + date.getTime(),
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
      uniqueId: message.unique_temp_id, 
      type: message.type,
    })

    // const resp = await Qiscus.qiscus.sendComment(
    //   this.state.room.id,
    //   text,
    //   message.unique_temp_id,
    // );
    // this._updateMessage(message, resp);
    
    // toast("Success sending message!");
  };

  _onSelectFile = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Select image',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      resp => {
        if (resp.didCancel) return console.tron.error('user cancel');
        if (resp.error)
          return console.tron.error('error when getting file', resp.error);

        const message = this._prepareFileMessage('File attachment', resp.uri);

        this.props.sendMessageRequest({
          roomId: this.state.room.id, 
          text: message.message, 
          uniqueId: message.uniqueId, 
          type: 'custom', // message type
          needToUpload: true,
          toUpload: resp,
        })

        this._addMessage(message, true)
          .then(() => {
            const name = resp.name;
            const obj = {
              uri: resp.uri,
              type: resp.type,
              name: resp.fileName,
            };

            // return Qiscus.qiscus.upload(obj, (error, progress, fileURL) => {
            //   if (error)
            //     return console.tron.error('error when uploading', error);
            //   if (progress) return console.tron.error(progress.percent);
            //   if (fileURL != null) {
            //     const payload = JSON.stringify({
            //       type: 'image',
            //       content: {
            //         url: fileURL,
            //         file_name: name,
            //         caption: '',
            //       },
            //     });
            //     Qiscus.qiscus
            //       .sendComment(
            //         this.state.room.id,
            //         message.message,
            //         message.uniqueId,
            //         'custom', // message type
            //         payload,
            //       )
            //       .then(resp => {});
            //   }
            // });
          })
          .catch(error => {
            console.tron.error('Catch me if you can', error);
          });
      },
    );
  };

  async openCamera() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this._onSelectFile()
      } else {
        console.tron.warn('Camera permission denied');
      }
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
            this.setState({scroll: false}, () => {
              clearTimeout(timeoutId);
              resolve();
            });
          }, 400);
        },
      );
    });

  // _updateMessage = (message, newMessage) => {
  //   this.setState(state => ({
  //     messages: {
  //       ...state.messages,
  //       [message.unique_temp_id]: newMessage,
  //     },
  //   }));
  // };

  _loadMore = () => {
    const { messages, navigation } = this.props;

    if (messages[0].comment_before_id === 0) return;
    const roomId = navigation.getParam('roomId', null);
    if (roomId == null) return;

    const lastCommentId = this.messages[0].id;
    // toast(`Loading more message ${lastCommentId}`);

    Qiscus.qiscus
      .loadComments(roomId, {last_comment_id: lastCommentId})
      .then(messages => {
        // toast("Done loading message");
        // const isLoadMoreable = messages[0].comment_before_id !== 0;
        this.setState(state => ({
          messages: {
            ...state.messages,
            ...messages.reduce(
              (result, item) => ((result[item.unique_temp_id] = item), result),
              {},
            ),
          },
          // isLoadMoreable,
        }));
      })
      .catch(error =>
        console.tron.error('Error when loading more comment', error),
      );
  };

  _sortMessage = messages =>
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  _onToolbarClick = () => {
    const roomId = this.state.room.id;
    this.props.navigation.navigate('RoomInfo', {roomId});
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
    return this._sortMessage(Object.values(this.props.messages));
  }
}

const mapStateToProps = (state) => {
  return {
    qiscusUser: state.qiscus.currentUser,
    messages: state.qiscus.messages,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMessagesRequest: (params) => dispatch(QiscusActions.getMessagesRequest(params)),
    sendMessageRequest: (params) => dispatch(QiscusActions.sendMessageRequest(params)),
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
