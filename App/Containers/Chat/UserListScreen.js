import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import Toolbar from "../../Components/Toolbar";
import UserItem from "../../Components/UserItem";
import { Images } from '../../Themes'

import QiscusActions from '../../Redux/QiscusRedux'
import { connect } from 'react-redux'
import { CustomFlatList, Styled } from "react-native-awesome-component";

class UserListScreen extends React.Component {
  itemPerPage = 50
  currentPage = 1

  _onBack = () => {
    this.props.navigation.goBack();
  };

  _fetchFunction = ({ page }) => {
    this.currentPage = page
    this.props.getUsersRequest({
      searchQuery: null,
      page,
      limit: this.itemPerPage,
    })
  }

  _renderItem = item => {
    return (
      <UserItem user={item} onPress={() => this.props.openRoomRequest(item.email)} />
    );
  };

  render() {
    const { users, getUserStatus } = this.props;
    const { payload, fetching } = getUserStatus
    let flatListMeta = { current_page: this.currentPage, next_page: undefined }
    if (payload) {
      const { meta } = payload
      if (meta && (meta.total_data >= users.length) && (meta.total_page >= this.currentPage)) {
        flatListMeta = { current_page: this.currentPage, next_page: this.currentPage + 1 }
      }
    }
    return (
      <Styled.FlexContainer>
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
        <Styled.FlexContainer>
          <CustomFlatList
            data={users}
            fetchFunction={this._fetchFunction}
            renderItem={({ item }) => this._renderItem(item)}
            loading={fetching}
            meta={flatListMeta}
          />
        </Styled.FlexContainer>
      </Styled.FlexContainer>
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
    getUserStatus: state.qiscus.getUsers
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
