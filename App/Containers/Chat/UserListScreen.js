import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import * as Qiscus from "../../Qiscus";

import Toolbar from "../../Components/Toolbar";
import UserItem from "../../Components/UserItem";
import { Images } from '../../Themes'

import QiscusActions from '../../Redux/QiscusRedux'
import { connect } from 'react-redux'

class UserListScreen extends React.Component {
  perPage = 20;

  // _onUserClick = async userId => {
  //   try {
  //     const room = await Qiscus.qiscus.chatTarget(userId);
  //     console.tron.log({room})

  //     this.props.navigation.push("ChatScreen", {
  //       room
  //     });
  //   } catch (error) {
  //     console.tron.error("error when getting room", error);
  //   }
  // };

  // _loadUsers = (query = null) => {
  //   Qiscus.qiscus
  //     .getUsers(query, 1, this.perPage)
  //     .then(resp => {
  //       this.setState({ users: resp.users });
  //     })
  //     .catch(error => {
  //       console.tron.error("Error when getting user list", error);
  //     });
  // };

  _onBack = () => {
    this.props.navigation.goBack();
  };

  _onEndReached = ({ distanceFromEnd }) => {
    console.tron.log("on end reached", distanceFromEnd);
  };

  componentDidMount() {
    this.props.getUsersRequest({
      searchQuery: null,
      page: 1,
      limit: this.perPage,
    })
  }

  _renderItem = item => {
    if (item.type === "load-more") return this._loadMore();
    return (
      <UserItem user={item} onPress={() => this.props.openRoomRequest(item.email)} />
    );
  };

  render() {
    const { users } = this.props;
    return (
      <View style={styles.container}>
        <Toolbar
          title="Choose Contacts"
          renderLeftButton={() => (
            <TouchableOpacity onPress={this._onBack}>
              <Image source={Images.qiscusBack} />
            </TouchableOpacity>
          )}
        />
        <View>
          {/* <TouchableOpacity
            style={styles.createGroupBtn}
            // onPress={this._onCreateGroup}
          >
            <Image
              style={styles.createGroupIcon}
              source={Images.qiscusNewChatGroup}
            />
            <Text style={styles.createGroupBtnText}>Create Group Chat</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.separator}>
          <Text style={styles.separatorText}>Contact</Text>
        </View>
        <FlatList
          data={users}
          keyExtractor={it => `key-${it.email}`}
          onEndReached={this._onEndReached}
          renderItem={({ item }) => this._renderItem(item)}
        />
      </View>
    );
  }

  // _onCreateGroup = () => {
  //   this.props.navigation.navigate("CreateGroup");
  // };
}

const mapStateToProps = (state) => {
  return {
    qiscusUser: state.qiscus.currentUser,
    users: state.qiscus.users,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUsersRequest: (params) => dispatch(QiscusActions.getUsersRequest(params)),
    openRoomRequest: (userId) => dispatch(QiscusActions.openRoomRequest(userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen)

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  createGroupBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
  },
  createGroupBtnText: {
    fontSize: 14,
    color: '#2c2c36',
    paddingHorizontal: 6,
  },
  createGroupIcon: {
    width: 25,
    height: 25,
  },
  separator: {
    backgroundColor: '#fafafa',
    padding: 5,
    height: 40,
    justifyContent: 'flex-end',
  },
  separatorText: {
    fontWeight: '600',
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#666',
  }
});
