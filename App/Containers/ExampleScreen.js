import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View } from 'react-native'
import { connect } from 'react-redux'
import { Styled, PlaceholderImage, PlaceholderText, CustomButton, Method } from 'react-native-awesome-component'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import CustomColor from 'react-native-awesome-component/src/colors'

// Styles
import styles from './Styles/ExampleScreenStyle'
import { Colors, Images } from '../Themes'

const SUCCESS_ALERT_OPTIONS = {
  enableDismiss: true,
  type: 'success',
  imgSuccess: undefined,
  successColor: CustomColor.alertSuccess,
  title: 'Success',
  // message: 'This is success alert modal',
  confirm: {
    title: 'Ok',
    callback: () => null
  },
}

const INFO_ALERT_OPTION = {
  enableDismiss: true,
  type: 'info',
  imgInfo: undefined,
  infoColor: CustomColor.alertInfo,
  title: 'Info',
  message: 'This is info alert modal',
  confirm: {
    title: 'Ok',
    callback: () => null
  },
  cancel: {
    title: 'Cancel',
    callback: () => null
  }
}

const ERROR_ALERT_OPTION = {
  enableDismiss: true,
  type: 'error',
  imgError: undefined,
  errorColor: CustomColor.alertError,
  title: 'Sorry',
  message: 'This is error alert modal',
  confirm: {
    title: 'Ok',
    callback: () => null
  },
}

const CUSTOM_ALERT_OPTIONS = {
  enableDismiss: true,
  type: 'success',
  imgSuccess: Images.clearLogo,
  successColor: Colors.background,
  title: 'Custom Alert',
  message: 'This is custom alert sample',
  confirm: {
    title: 'Ok',
    callback: () => null
  },
  cancel: {
    title: 'Cancel',
    callback: () => null
  }
}

const CUSTOM_ALERT_STYLE = {
  imageStyle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.background
  },
  containerStyle: {
    borderRadius: 0,
  }
}

const CUSTOM_ALERT_NO_TYPE_OPTION = {
  type: undefined,
  imgSuccess: undefined,
  successColor: Colors.banner,
  title: 'No Type alert',
  message: 'This is alert without type',
  confirm: {
    title: 'Ok',
    callback: () => null
  },
}

class ExampleScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }

    this.showSuccessAlert = this.showSuccessAlert.bind(this)
    this.showInfoAlert = this.showInfoAlert.bind(this)
    this.showErrorAlert = this.showErrorAlert.bind(this)
    this.showAlertWithCustomStyle = this.showAlertWithCustomStyle.bind(this)
    this.showAlertWithoutType = this.showAlertWithoutType.bind(this)
  }

  componentDidMount() {
    setTimeout(() => this.setState({ text: 'Hello this is sample of text placeholder' }), 3000)
  }

  showSuccessAlert() {
    Method.AlertHandler.showAlert(SUCCESS_ALERT_OPTIONS)
  }

  showInfoAlert() {
    Method.AlertHandler.showAlert(INFO_ALERT_OPTION)
  }

  showErrorAlert() {
    Method.AlertHandler.showAlert(ERROR_ALERT_OPTION)
  }

  showAlertWithCustomStyle() {
    Method.AlertHandler.showAlert(CUSTOM_ALERT_OPTIONS, CUSTOM_ALERT_STYLE)
  }

  showAlertWithoutType() {
    Method.AlertHandler.showAlert(CUSTOM_ALERT_NO_TYPE_OPTION)
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Styled.Container isCard padded style={{ marginTop: 10 }}>
          <Styled.H5>
            Typography
          </Styled.H5>
          <Styled.H1>
            H1
          </Styled.H1>
          <Styled.H2>
            H2
          </Styled.H2>
          <Styled.H3>
            H3
          </Styled.H3>
          <Styled.H4>
            H4
          </Styled.H4>
          <Styled.H5>
            H5
          </Styled.H5>
          <Styled.H6>
            H6
          </Styled.H6>
          <Styled.H7>
            H7
          </Styled.H7>
        </Styled.Container>

        <Styled.Container isCard padded style={{ marginTop: 10 }}>
          <Styled.H5>
            Image Placeholder
          </Styled.H5>
          <Styled.H2>Once No Uri / Loading</Styled.H2>
          <PlaceholderImage uri={''} />
          <Styled.H2>Once Uri Corrent</Styled.H2>
          <PlaceholderImage uri={'http://rahmatzulfikri.xyz/images/avatar.jpg'} />
          <Styled.H2>Once Uri Not Found / Error</Styled.H2>
          <PlaceholderImage uri={'http://rahmatzulfikri.xyz/images/avatar2.jpg'} />
        </Styled.Container>

        <Styled.Container isCard padded style={{ marginTop: 10 }}>
          <Styled.H5>
            Text Placeholder
          </Styled.H5>
          <PlaceholderText>{this.state.text}</PlaceholderText>
        </Styled.Container>

        <Styled.Container isCard padded style={{ marginTop: 10 }}>
          <Styled.H5>
            Custom Button
          </Styled.H5>
          <Styled.H2>Active Button</Styled.H2>
          <CustomButton
            title='INI TITLE'
            isCard
          />
          <Styled.H2>Disable Button</Styled.H2>
          <CustomButton
            title='INI TITLE'
            disabled
            width={'50%'}
          />
          <Styled.H2>Loading Button</Styled.H2>
          <CustomButton
            title='INI TITLE'
            loading
            radius={10}
          />
        </Styled.Container>
        <Styled.Container isCard padded style={{ marginTop: 10 }}>
          <Styled.H5>
            Custom Alert
          </Styled.H5>
          <Styled.H2>No Type Alert</Styled.H2>
          <CustomButton
            title='Show alert without type'
            isCard
            activeColor={Colors.banner}
            onPress={this.showAlertWithoutType}
          />
          <Styled.H2>Success Alert</Styled.H2>
          <CustomButton
            title='Show success alert'
            isCard
            activeColor={CustomColor.alertSuccess}
            onPress={this.showSuccessAlert}
          />
          <Styled.H2>Info Alert</Styled.H2>
          <CustomButton
            title='Show info alert'
            isCard
            activeColor={CustomColor.alertInfo}
            onPress={this.showInfoAlert}
          />
          <Styled.H2>Error Alert</Styled.H2>
          <CustomButton
            title='Show error alert'
            isCard
            activeColor={CustomColor.alertError}
            onPress={this.showErrorAlert}
          />
          <Styled.H2>Alert With Custom Style</Styled.H2>
          <CustomButton
            title='Show error alert'
            isCard
            activeColor={Colors.background}
            onPress={this.showAlertWithCustomStyle}
          />
        </Styled.Container>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExampleScreen)
