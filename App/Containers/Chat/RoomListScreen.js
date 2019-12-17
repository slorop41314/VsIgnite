import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NavigationEvents } from 'react-navigation'
import RoomItem from "../../Components/RoomItem";
import Toolbar from "../../Components/Toolbar";
import { Images } from '../../Themes'

import QiscusActions from '../../Redux/QiscusRedux'
import { connect } from 'react-redux'

class RoomListScreen extends React.Component {
  constructor(props) {
    super(props)

    this.onClickProfile = this.onClickProfile.bind(this)
    this.onClickRoom = this.onClickRoom.bind(this)
  }

  componentDidMount() {
    const { getRoomsRequest } = this.props
    const params = {
      page: 1,
      limit: 100,
      show_participants: false,
      show_empty: false
    }

    getRoomsRequest(params)
  }

  onClickProfile() {
    this.props.navigation.push("ProfileScreen");
  }

  onClickRoom(room) {
    this.props.navigation.push("ChatScreen", {
      room,
    });
  };

  openUserList() {
    this.props.navigation.push("UserListScreen");
  };

  sortRooms = rooms =>
    rooms.sort((a, b) => new Date(a.last_comment_message_created_at) < new Date(b.last_comment_message_created_at));

  get rooms() {
    return this.sortRooms(Object.values(this.props.rooms || []));
  }

  render() {
    const { qiscusUser } = this.props
    const rooms = this.rooms;

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={() => this.componentDidMount()} />
        <Toolbar
          title="Message"
          renderLeftButton={() => (
            <TouchableOpacity
              style={styles.btnAvatar}
              onPress={this.onClickProfile}
              disabled={qiscusUser ? false : true}
            >
              {qiscusUser && qiscusUser.avatar_url && <Image style={styles.avatar} source={{ uri: qiscusUser.avatar_url }} />}
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <TouchableOpacity
              style={styles.btnAvatar}
              onPress={() => this.openUserList()}
            >
              <Image
                style={styles.iconStartChat}
                source={Images.qiscusNewChat}
              />
            </TouchableOpacity>
          )}
        />
        <FlatList
          data={rooms}
          keyExtractor={it => `key-${it.id}`}
          contentContainerStyle={{ flexGrow: 1, }}
          renderItem={({ item }) => (
            <RoomItem
              room={item}
              onClick={() => this.onClickRoom(item)}
            />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    qiscusUser: state.qiscus.currentUser,
    rooms: state.qiscus.rooms,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRoomsRequest: (params) => dispatch(QiscusActions.getRoomsRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomListScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnAvatar: {
    overflow: "hidden",
    backgroundColor: "transparent",
    flex: 0,
    flexShrink: 0,
    flexBasis: 30,
    borderRadius: 50
  },
  iconStartChat: {
    height: 30,
    width: 20,
    resizeMode: "contain"
  },
  avatar: {
    height: 30,
    width: 30,
    resizeMode: "cover",
    borderRadius: 50
  }
});
