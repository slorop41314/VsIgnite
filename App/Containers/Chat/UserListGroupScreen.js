import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Toolbar from '../../Components/Toolbar';
import UserItem from '../../Components/UserItem';
import { Images } from '../../Themes';

import QiscusActions from '../../Redux/QiscusRedux';
import { connect } from 'react-redux';
import { CustomFlatList, Styled, CustomButton } from 'react-native-awesome-component';
import { values } from 'ramda';

class UserListGroupScreen extends React.Component {
  itemPerPage = 50;
  currentPage = 1;

  constructor(props) {
    super(props)

    this.state = {
      selectedUser: {},
    }

    this.onBack = this.onBack.bind(this)
    this.fetchFunction = this.fetchFunction.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.onPressUser = this.onPressUser.bind(this)
    this.onPressInvite = this.onPressInvite.bind(this)
  }

  onBack() {
    this.props.navigation.goBack();
  };

  fetchFunction({ page }) {
    this.currentPage = page;
    this.props.getUsersRequest({
      searchQuery: null,
      page,
      limit: this.itemPerPage,
    });
  };

  onPressUser(user) {
    let newSelectedUser = { ...this.state.selectedUser }
    if (newSelectedUser[user.id]) {
      delete newSelectedUser[user.id]
    } else {
      newSelectedUser = {
        ...newSelectedUser,
        [user.id]: user,
      }
    }
    this.setState({ selectedUser: newSelectedUser })
  }

  onPressInvite() {
    const selectedUserArray = values(this.state.selectedUser)
    this.props.navigation.navigate('GroupCreateInfoScreen', { users: selectedUserArray })
  }

  renderItem(item) {
    return (
      <UserItem
        user={item}
        onPress={() => this.onPressUser(item)}
        selected={this.state.selectedUser[item.id] ? true : false}
      />
    );
  };

  render() {
    const { users, getUserStatus } = this.props;
    const { selectedUser } = this.state
    const selectedUserCount = values(selectedUser).length
    const { payload, fetching } = getUserStatus;
    let flatListMeta = { current_page: this.currentPage, next_page: undefined };
    if (payload) {
      const { meta } = payload;
      if (
        meta &&
        meta.total_data >= users.length &&
        meta.total_page >= this.currentPage
      ) {
        flatListMeta = {
          current_page: this.currentPage,
          next_page: this.currentPage + 1,
        };
      }
    }

    return (
      <Styled.FlexContainer>
        <Toolbar
          title="Create Group"
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ justifyContent: 'center' }}
            >
              <Image
                source={Images.qiscusBack}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          )}
        />
        <View style={styles.separator}>
          <Text style={styles.separatorText}>{`Invite Member (${selectedUserCount}/100)`}</Text>
        </View>
        <Styled.FlexContainer>
          <CustomFlatList
            data={users}
            fetchFunction={this.fetchFunction}
            renderItem={({ item }) => this.renderItem(item)}
            loading={fetching}
            meta={flatListMeta}
          />
        </Styled.FlexContainer>
        <CustomButton title={'INVITE'} onPress={this.onPressInvite} />
      </Styled.FlexContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    qiscusUser: state.qiscus.currentUser,
    users: state.qiscus.users,
    getUserStatus: state.qiscus.getUsers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUsersRequest: params => dispatch(QiscusActions.getUsersRequest(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserListGroupScreen);

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
    shadowColor: '#000',
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
  },
});
