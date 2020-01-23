import React, { Component } from 'react'
import { Styled } from 'react-native-awesome-component'
import Video from 'react-native-video'
import { View, TouchableOpacity, Dimensions, ActivityIndicator, StatusBar, Text } from 'react-native'
import { Colors } from '../Themes'
import Icons from 'react-native-vector-icons/FontAwesome5'

const { width, height } = Dimensions.get('window')

const SKIP_VALUE = 15

const ORIENTATION = {
  landscape: 'landscape',
  potrait: 'potrait'
}

class VideoPlayer extends Component {
  constructor(props) {
    super(props)
    this.source = props.source ? props.source : undefined
    this.ispreview = props.ispreview

    if (this.ispreview) {
      this.playerWidth = width * 0.7
      this.playerHeight = this.playerWidth * 2 / 3

      this.playerActionWidth = 50
    } else {
      this.playerWidth = width
      this.playerHeight = width * 2 / 3

      this.playerActionWidth = 80
    }

    this.state = {
      ready: false,
      showControl: true,
      paused: true,
      progress: null,
      isError: false,

      fullscreen: false,
      naturalSize: null
    }

    this.onPressShowControl = this.onPressShowControl.bind(this)
    this.tooglePause = this.tooglePause.bind(this)
    this.onBuffer = this.onBuffer.bind(this)
    this.onProgress = this.onProgress.bind(this)
    this.onLoad = this.onLoad.bind(this)
    this.onError = this.onError.bind(this)

    this.onPressForward = this.onPressForward.bind(this)
    this.onPressBackward = this.onPressBackward.bind(this)
    this.onPressFullscreen = this.onPressFullscreen.bind(this)

    this.renderControl = this.renderControl.bind(this)
  }

  player = undefined

  onPressShowControl() {
    this.setState({ showControl: !this.state.showControl })
  }

  tooglePause() {
    let { paused } = this.state
    this.setState({ paused: !paused })
  }

  onProgress(progress) {
    this.setState({ progress })
  }

  onLoad(data) {
    if (this.ispreview) {
      this.player.seek(5)
    }
    this.setState({
      ready: true,
      progres: {
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: data.duration
      },
      naturalSize: data.naturalSize
    })
  }

  onBuffer(buffer) {
    console.tron.error({ buffer })
  }

  onPressForward() {
    if (this.player) {
      const { progress } = this.state

      if (progress) {
        const { currentTime, seekableDuration } = progress

        let seekValue = currentTime + SKIP_VALUE

        if (seekValue >= seekableDuration) {
          seekValue = seekableDuration
        }

        this.player.seek(seekValue)
      }
    }
  }

  onPressBackward() {
    if (this.player) {
      const { progress } = this.state

      if (progress) {
        const { currentTime } = progress
        let seekValue = currentTime - SKIP_VALUE

        if (seekValue <= 0) {
          seekValue = 0
        }

        this.player.seek(seekValue)
      }
    }
  }

  onPressFullscreen() {
    const { fullscreen } = this.state
    if (fullscreen) {
      this.player.dismissFullscreenPlayer()
    } else {
      this.player.presentFullscreenPlayer()
    }
  }

  onError() {
    this.setState({ isError: true })
  }

  renderControl() {
    const { paused, showControl, progress, ready, fullscreen, naturalSize, isError } = this.state
    let currentLength = 0;
    let playableLength = 0;
    let seekableLength = 1
    let seekProgress = 0

    if (progress) {
      const { currentTime, playableDuration, seekableDuration } = progress

      playableLength = playableDuration / seekableDuration
      currentLength = currentTime / seekableDuration
      playableLength = playableLength - currentLength
      seekableLength = 1 - playableLength - currentLength

      seekProgress = (currentTime / seekableDuration) * 100
    }

    let playerWidth = fullscreen ? width : this.playerWidth
    let playerHeight = fullscreen ? height : this.playerHeight
    let additionalStyle = {}

    if (naturalSize) {
      if (naturalSize.orientation === ORIENTATION.landscape) {
        if (fullscreen) {
          additionalStyle = { transform: [{ rotate: '-90deg' }] }
          playerWidth = height
          playerHeight = width

        }
      } else {
        playerWidth = width
        playerHeight = height
      }
    }

    if (isError) {
      return (
        <View
          style={
            [{
              position: 'absolute',
              width: playerWidth,
              height: playerHeight,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100
            }, additionalStyle]
          }
        >
          <Text
            style={{color: Colors.snow, fontSize: 16, fontWeight: '400'}}
          >
            Sorry, cannot load this video!
            </Text>
        </View>
      )
    }

    if (!ready) {
      return (
        <View
          style={
            [{
              position: 'absolute',
              width: playerWidth,
              height: playerHeight,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100
            }, additionalStyle]
          }
        >
          <ActivityIndicator color={Colors.snow} size={'large'} />
        </View>
      )
    } else {
      if (showControl || paused) {
        return (
          <TouchableOpacity
            disabled={this.ispreview}
            activeOpacity={1}
            onPress={this.onPressShowControl}
            style={[{
              position: 'absolute',
              width: playerWidth,
              height: playerHeight,
              justifyContent: 'flex-end',
              zIndex: 100,
            }, additionalStyle]}
          >
            {!this.ispreview && (
              <TouchableOpacity
                disabled={this.ispreview}
                activeOpacity={0.8}
                style={{
                  top: 20,
                  right: 20,
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  backgroundColor: Colors.eggplant,
                }}
                onPress={this.onPressFullscreen}
              >
                <Icons name='expand' color={Colors.snow} size={25} style={{ margin: 3 }} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={this.ispreview}
              activeOpacity={0.8}
              onPress={this.tooglePause}
              style={{
                alignSelf: 'center',
                position: 'absolute',
                top: (playerHeight / 2) - (this.playerActionWidth / 2),
              }}
            >
              <View
                style={{
                  width: this.playerActionWidth,
                  height: this.playerActionWidth,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.eggplant,
                  borderRadius: this.playerActionWidth / 2
                }}>
                <Icons name={paused ? 'play-circle' : 'pause-circle'} size={this.playerActionWidth * 0.7} color={Colors.snow} />
              </View>
            </TouchableOpacity>
            {!this.ispreview && (
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  height: 80,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                }}>
                <TouchableOpacity
                  disabled={this.ispreview}
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: Colors.snow,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                  activeOpacity={0.8}
                  onPress={this.onPressBackward}
                >
                  <Icons name='backward' color={Colors.eggplant} size={20} />
                </TouchableOpacity>
                <View
                  style={{ flex: 1, flexDirection: 'row', marginHorizontal: 20 }}
                >
                  <View style={{ flex: currentLength, backgroundColor: Colors.snow, height: 5 }} />
                  <View style={{ flex: playableLength, backgroundColor: Colors.steel, eight: 5 }} />
                  <View style={{ flex: seekableLength, backgroundColor: Colors.coal, eight: 5 }} />
                  <View
                    style={{ position: 'absolute', height: 10, width: 10, backgroundColor: 'white', top: -2.5, marginLeft: -5, left: `${seekProgress}%` }}
                  />
                </View>
                <TouchableOpacity
                  disabled={this.ispreview}
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: Colors.snow,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                  activeOpacity={0.8}
                  onPress={this.onPressForward}
                >
                  <Icons name='forward' color={Colors.eggplant} size={20} />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )
      }
    }

    return null
  }

  render() {
    const { source } = this.props
    const { paused, showControl, progress, ready, fullscreen, naturalSize } = this.state
    let currentLength = 0;
    let playableLength = 0;
    let seekableLength = 1
    let seekProgress = 0

    if (progress) {
      const { currentTime, playableDuration, seekableDuration } = progress

      playableLength = playableDuration / seekableDuration
      currentLength = currentTime / seekableDuration
      playableLength = playableLength - currentLength
      seekableLength = 1 - playableLength - currentLength

      seekProgress = (currentTime / seekableDuration) * 100
    }

    let playerWidth = fullscreen ? width : this.playerWidth
    let playerHeight = fullscreen ? height : this.playerHeight
    let additionalStyle = {}

    if (naturalSize) {
      if (naturalSize.orientation === ORIENTATION.landscape) {
        if (fullscreen) {
          additionalStyle = { transform: [{ rotate: '-90deg' }] }
          playerWidth = height
          playerHeight = width

        }
      } else {
        playerWidth = width
        playerHeight = height
      }
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.onPressShowControl}
          style={[{ width: playerWidth, height: playerHeight, zIndex: 100 }, additionalStyle]}
        >
          <Video
            ref={(ref) => {
              this.player = ref
            }}
            // source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}   // Can be a URL or a local file.
            source={{ uri: source }}   // Can be a URL or a local file.
            style={[{ width: playerWidth, height: playerHeight, backgroundColor: 'black' }]}
            paused={paused}
            onLoad={this.onLoad}
            eventProps={this.onBuffer}
            onProgress={this.onProgress}
            onVideoBuffer={this.onBuffer}
            onFullscreenPlayerWillPresent={() => {
              this.setState({ fullscreen: true })
            }}
            fullscreen={fullscreen}
            onFullscreenPlayerWillDismiss={() => {
              this.setState({ fullscreen: false })
            }}
            resizeMode={'contain'}
            onError={this.onError}
          />
        </TouchableOpacity>
        {this.renderControl()}
      </View>
    )
  }
}

export default VideoPlayer