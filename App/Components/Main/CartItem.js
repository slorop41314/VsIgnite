import React, {Component} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {scale} from '../../Transforms/Scale';
import {Colors} from '../../Themes';
import NumToRp from '../../Transforms/NumToRp';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SwipeOut} from '@rn-components-kit/swipe-out';
import NavigationServices from '../../Services/NavigationServices';
import {connect} from 'react-redux';
import CartActions from '../../Redux/CartRedux';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: scale(55),
    alignItems: 'center',
    backgroundColor: Colors.snow,
    paddingHorizontal: scale(20),
  },
  textName: {
    fontSize: scale(18),
    color: Colors.blackNavi,
  },
  textPrice: {
    fontSize: scale(18),
    color: Colors.blackNavi,
  },
  separator: {
    height: scale(1),
    backgroundColor: Colors.borderGrey,
  },
  actionContainer: {
    backgroundColor: Colors.error,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(10),
  },
  actionLabel: {
    fontSize: scale(16),
    color: Colors.snow,
  },
});

class CartItem extends Component {
  constructor(props) {
    super(props);

    this.renderSwipeOut = this.renderSwipeOut.bind(this);
    this.onPressItem = this.onPressItem.bind(this);
    this.onPressDelete = this.onPressDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  onPressItem() {
    const {data} = this.props;
    NavigationServices.navigate('EditItemScreen', {item: data});
  }

  onPressDelete() {
    Alert.alert(
      'Konfirmasi Hapus',
      'Barang ini akan dihapus dari list belanja anda, hapus barang?',
      [
        {
          text: 'Hapus',
          onPress: () => {
            this.refSwipeOut.playReboundAnimation('reset');
            this.confirmDelete();
          },
        },
        {
          text: 'Batal',
          onPress: () => {
            this.refSwipeOut.playReboundAnimation('reset');
          },
        },
      ],
    );
  }

  confirmDelete() {
    const {data, removeItemFromCart} = this.props;
    removeItemFromCart(data);
  }

  renderSwipeOut() {
    return (
      <TouchableOpacity
        style={styles.actionContainer}
        activeOpacity={0.8}
        onPress={this.onPressDelete}>
        <Text style={styles.actionLabel}>Hapus</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {data} = this.props;
    return (
      <SwipeOut ref={r => (this.refSwipeOut = r)} right={this.renderSwipeOut}>
        <TouchableOpacity activeOpacity={0.8} onPress={this.onPressItem}>
          <View style={styles.container}>
            <Text style={styles.textName}>{data.name}</Text>
            <Text style={styles.textPrice}>
              {`${NumToRp(data.price, 'Rp. ')}`}
            </Text>
          </View>
          <View style={styles.separator} />
        </TouchableOpacity>
      </SwipeOut>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispath => {
  return {
    removeItemFromCart: params =>
      dispath(CartActions.removeItemFromCart(params)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartItem);
