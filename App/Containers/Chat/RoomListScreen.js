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

import { connect } from 'react-redux'

class RoomListScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    const { qiscusUser } = this.props
    const rooms = []
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
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'red' }}
          renderItem={({ item }) => (
            <RoomItem
              room={item}
              onClick={roomId => this._onClickRoom(roomId)}
            />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    qiscusUser: state.qiscus.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

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
