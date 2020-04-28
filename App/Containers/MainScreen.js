import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import R from 'ramda';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MainScreenStyle';
import {Styled, CustomButton} from 'react-native-awesome-component';
import TotalCount from '../Components/Main/TotalCount';
import FAB from 'react-native-fab';
import {Colors} from '../Themes';
import CartItem from '../Components/Main/CartItem';
import {scale} from '../Transforms/Scale';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
  }

  addItem() {
    const {navigation} = this.props;
    navigation.navigate('AddItemScreen');
  }

  render() {
    const {activeCartItems, totalPrice} = this.props;
    const containerStyle =
      activeCartItems.length > 0
        ? {}
        : {flexGrow: 1, justifyContent: 'center', alignItems: 'center'};
    return (
      <Styled.FlexContainer style={[styles.mainContainer]}>
        <TotalCount total={totalPrice} itemCount={activeCartItems.length} />
        <FlatList
          data={activeCartItems}
          contentContainerStyle={containerStyle}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item, index}) => {
            return <CartItem data={item} />;
          }}
          ListEmptyComponent={() => {
            return (
              <View style={{marginTop: scale(-100)}}>
                <Text style={styles.emptyText}>
                  {`Belum Ada Barang\nDitambahkan`}
                </Text>

                <View style={{marginTop: scale(20)}}>
                  <CustomButton
                    title="Belanja Sekarang"
                    onPress={this.addItem}
                    isCard
                    radius={scale(5)}
                  />
                </View>
              </View>
            );
          }}
        />
        {activeCartItems.length > 0 && (
          <FAB
            buttonColor={Colors.mainActive}
            iconTextColor={Colors.snow}
            onClickAction={this.addItem}
            visible
          />
        )}
      </Styled.FlexContainer>
    );
  }
}

const mapStateToProps = state => {
  let activeCartItems = [];
  let totalPrice = 0;

  if (state.cart.activeCart) {
    activeCartItems = R.values(state.cart.activeCart);
    for (let i = 0; i < activeCartItems.length; i += 1) {
      totalPrice += parseInt(activeCartItems[i].price, 10);
    }
  }
  return {
    activeCartItems,
    totalPrice,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
