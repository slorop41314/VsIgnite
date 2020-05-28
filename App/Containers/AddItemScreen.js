import React, {Component} from 'react';
import {ScrollView, Text, KeyboardAvoidingView, View} from 'react-native';
import {connect} from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/AddItemScreenStyle';
import {CustomInput, CustomButton} from 'react-native-awesome-component';
import CartActions from '../Redux/CartRedux';

class AddItemScreen extends Component {
  item = undefined;

  type = 'add';

  constructor(props) {
    super(props);
    const type = props.navigation.getParam('type');
    let name = '';
    let price = '';
    let qty = '';
    let discount = '';
    if (type === 'edit') {
      this.type = 'edit';
      this.item = props.navigation.getParam('item');
      name = this.item.name;
      price = this.item.price;
      qty = this.item.qty;
      discount = this.item.discount;
    }

    this.state = {
      name,
      price,
      qty,
      discount,

      nameError: true,
      priceError: true,
      qtyError: true,
      discountError: true,
    };

    this.onSave = this.onSave.bind(this);
  }

  onSave() {
    const {addToCart, navigation, updateItemInCart} = this.props;
    const {name, price, qty, discount} = this.state;
    const params = {
      id: new Date().getTime(),
      name,
      price: price.length > 0 ? price : 0,
      qty: qty.length > 0 ? qty : 0,
      discount: discount.length > 0 ? discount : 0,
    };

    if (this.type === 'edit') {
      updateItemInCart({...params, id: this.item.id});
    } else {
      addToCart(params);
    }

    navigation.goBack();
  }

  render() {
    const {
      name,
      price,
      qty,
      discount,
      nameError,
      priceError,
      discountError,
      qtyError,
    } = this.state;

    let disableButton = true;

    if (!nameError && !priceError && !qtyError && !discountError) {
      disableButton = false;
    }

    return (
      <ScrollView
        style={styles.mainContainer}
        keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior="position">
          <CustomInput
            labelType="top-label"
            label="Nama Barang"
            setRef={r => (this.inputName = r)}
            placeholder="Nama Barang (contoh: Minyak goreng)"
            onChangeText={text => this.setState({name: text})}
            defaultValue={name}
            containerStyle={styles.inputContainer}
            style={styles.inputStyle}
            inputType="text"
            isRequired
            onChangeValidation={status => this.setState({nameError: status})}
            returnKeyType="next"
            onSubmitEditing={() => this.inputPrice.focus()}
            autoCompleteType="off"
            autoCorrect={false}
          />
          <CustomInput
            labelType="top-label"
            label="Harga Barang"
            setRef={r => (this.inputPrice = r)}
            placeholder="Harga Barang (contoh: 10000)"
            onChangeText={text => this.setState({price: text})}
            defaultValue={price}
            containerStyle={styles.inputContainer}
            style={styles.inputStyle}
            inputType="number"
            returnKeyType="done"
            onChangeValidation={status => this.setState({priceError: status})}
            onSubmitEditing={() => this.inputQty.focus()}
            autoCompleteType="off"
          />
          <View style={styles.rowContainer}>
            <View style={styles.rowItem}>
              <CustomInput
                labelType="top-label"
                label="Jumlah Barang"
                setRef={r => (this.inputQty = r)}
                placeholder="Default 1"
                onChangeText={text => this.setState({qty: text})}
                defaultValue={qty}
                containerStyle={styles.inputContainer}
                style={styles.inputStyle}
                inputType="number"
                returnKeyType="done"
                onChangeValidation={status => this.setState({qtyError: status})}
                onSubmitEditing={() => this.inputDiscount.focus()}
                autoCompleteType="off"
              />
            </View>
            <View style={styles.rowItem}>
              <CustomInput
                labelType="top-label"
                label="Diskon Barang (0%)"
                setRef={r => (this.inputDiscount = r)}
                placeholder="Default 0%"
                onChangeText={text => this.setState({discount: text})}
                defaultValue={discount}
                containerStyle={styles.inputContainer}
                style={styles.inputStyle}
                inputType="number"
                returnKeyType="done"
                onChangeValidation={status =>
                  this.setState({discountError: status})
                }
                max={100}
                autoCompleteType="off"
              />
            </View>
          </View>

          <CustomButton
            title="Simpan Barang"
            onPress={this.onSave}
            disabled={disableButton}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: params => dispatch(CartActions.addToCart(params)),
    updateItemInCart: params => dispatch(CartActions.updateItemInCart(params)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddItemScreen);
