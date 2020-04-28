import React, {Component} from 'react';
import {ScrollView, Text, KeyboardAvoidingView, View} from 'react-native';
import {connect} from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MainScreenStyle';
import {Styled} from 'react-native-awesome-component';
import TotalCount from '../Components/Main/TotalCount';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
  }

  addItem() {}

  render() {
    return (
      <Styled.FlexContainer>
        <TotalCount total={180000} />
      </Styled.FlexContainer>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
