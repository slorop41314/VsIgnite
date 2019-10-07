import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { Styled, PlaceholderImage, PlaceholderText, CustomButton } from 'react-native-awesome-component'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ExampleScreenStyle'
import { GlobalConst } from 'react-native-awesome-component'

class ExampleScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({ text: 'Hello this is sample of text placeholder' }), 3000)
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
            Image Placeholder
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
