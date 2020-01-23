import React, { Component } from 'react'
import Modal from 'react-native-modal'
import { Styled } from 'react-native-awesome-component'
import Video from 'react-native-video'
import { View, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import { Colors } from '../Themes'
import VideoPlayer from './VideoPlayer'
import Icons from 'react-native-vector-icons/FontAwesome5'

const { width, height } = Dimensions.get('window')

const videoWidth = width * 0.7
const videoHeight = videoWidth * 2 / 3

class VideoPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      hideStatusBar: false
    }
  }

  render() {
    const { source } = this.props
    const { visible } = this.state
    return (
      <View>
        <Modal
          isVisible={visible}
          onBackButtonPress={() => this.setState({ visible: false })}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          swipeDirection={['down']}
          onSwipeComplete={() => this.setState({ visible: false })}
          style={{ padding: 0, margin: 0 }}
          onModalWillShow={() => this.setState({ hideStatusBar: true })}
        >
          {visible && (
            <VideoPlayer source={source} ispreview={false} />
          )}
        </Modal>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.setState({ visible: true })}
          style={{ width: videoWidth, height: videoHeight, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}
        >
          <Icons name={'play-circle'} size={50} color={Colors.snow} />
        </TouchableOpacity>
      </View>
    )
  }
}

export default VideoPreview