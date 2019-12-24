import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { NavigationEvents } from 'react-navigation'
import RoomItem from "../../Components/RoomItem";
import Toolbar from "../../Components/Toolbar";
import { Images } from '../../Themes'

import QiscusActions from '../../Redux/QiscusRedux'
import { connect } from 'react-redux'
import { Styled, CustomFlatList } from "react-native-awesome-component";
import { Colors } from '../../Themes'

class RoomListScreen extends React.Component {
  itemPerPage = 100;
  currentPage = 1;

  constructor(props) {
    super(props)

    this.fetchFunction = this.fetchFunction.bind(this)
    this.onClickProfile = this.onClickProfile.bind(this)
    this.onClickRoom = this.onClickRoom.bind(this)
    this.onPressCreateGroup = this.onPressCreateGroup.bind(this)
  }

  fetchFunction({ page }) {
    const { getRoomsRequest } = this.props
    this.currentPage = page;
    const params = {
      page,
      limit: this.itemPerPage,
      show_participants: true,
      show_empty: true
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

  onPressCreateGroup() {
    this.props.navigation.navigate('UserListGroupScreen')
  }

  render() {
    const { qiscusUser, getRoomsStatus } = this.props
    const { payload, fetching, data } = getRoomsStatus;
    const rooms = this.rooms;

    let flatListMeta = { current_page: this.currentPage, next_page: undefined };
    if (fetching === false && payload) {
      if (payload.length === this.itemPerPage) {
        flatListMeta = {
          current_page: data.page,
          next_page: data.page + 1,
        };
      }
    }

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={() => this.fetchFunction({ page: this.currentPage })} />
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
        <Styled.Container padded isCard style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity activeOpacity={0.8} onPress={this.onPressCreateGroup}>
            <Text style={{ fontSize: 15, color: Colors.charcoal }}>Create Group</Text>
          </TouchableOpacity>
        </Styled.Container>
        <CustomFlatList
          data={rooms}
          fetchFunction={this.fetchFunction}
          loading={fetching}
          meta={flatListMeta}
          renderItem={({ item }) => {
            return <RoomItem
              data={item}
              onClick={() => this.onClickRoom(item)}
            />
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    qiscusUser: state.qiscus.currentUser,
    rooms: state.qiscus.rooms,
    getRoomsStatus: state.qiscus.getRooms,
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
