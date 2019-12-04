import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import RoomItem from "../../Components/RoomItem";
import Toolbar from "../../Components/Toolbar";
import { Images } from '../../Themes'

import QiscusActions from '../../Redux/QiscusRedux'
import { connect } from 'react-redux'

class RoomListScreen extends React.Component {
  constructor(props) {
    super(props)
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

  onClickRoom(room) {
    console.tron.log({room})
    this.props.navigation.push("ChatScreen", {
      room,
    });
  };

  render() {
    const { qiscusUser, rooms } = this.props
    return (
      <View style={styles.container}>
        <Toolbar
          title="Conversation"
          renderLeftButton={() => (
            <TouchableOpacity
              style={styles.btnAvatar}
              // onPress={this._openProfile}
              disabled={qiscusUser ? false : true}
            >
              {qiscusUser && qiscusUser.avatar_url && <Image style={styles.avatar} source={{ uri: qiscusUser.avatar_url }} />}
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <TouchableOpacity
              style={styles.btnAvatar}
            // onPress={this._openUserList}
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
    height: 30,
    width: 30,
    overflow: "hidden",
    backgroundColor: "transparent",
    flex: 0,
    flexShrink: 0,
    flexBasis: 30,
    borderRadius: 50
  },
  iconStartChat: {
    height: 30,
    width: 30,
    resizeMode: "contain"
  },
  avatar: {
    height: 30,
    width: 30,
    resizeMode: "cover",
    borderRadius: 50
  }
});
