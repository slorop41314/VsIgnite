import React, { Component } from 'react'
import { ScrollView, Text, Image, View, Button, Platform } from 'react-native'
import { Images } from '../Themes'
import { VideoPlayer, Trimmer } from 'react-native-video-processing';
import ImagePicker from 'react-native-image-picker';

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      video: undefined
    }

    this.onPressPicker = this.onPressPicker.bind(this)
  }

  onPressPicker() {
    ImagePicker.launchImageLibrary({ mediaType: 'video' }, (response) => {
      // Same code as in above section!
      console.log({ response })
      if (response) {
        if (!response.didCancel) {
          this.setState({ video: response })
        }
      }
    });
  }

  trimVideo() {
    const options = {
      startTime: 0,
      endTime: 15,
      quality: VideoPlayer.Constants.quality.QUALITY_1280x720, // iOS only
      saveToCameraRoll: true, // default is false // iOS only
      saveWithCurrentDate: true, // default is false // iOS only
    };
    this.videoPlayerRef.trim(options)
      .then((newSource) => console.log(newSource))
      .catch(console.warn);
  }

  compressVideo() {
    const options = {
      width: 720,
      height: 1280,
      bitrateMultiplier: 3,
      saveToCameraRoll: true, // default is false, iOS only
      saveWithCurrentDate: true, // default is false, iOS only
      minimumBitrate: 300000,
      removeAudio: true, // default is false
    };
    this.videoPlayerRef.compress(options)
      .then((newSource) => console.log(newSource))
      .catch(console.warn);
  }

  getPreviewImageForSecond(second) {
    const maximumSize = { width: 640, height: 1024 }; // default is { width: 1080, height: 1080 } iOS only
    this.videoPlayerRef.getPreviewForSecond(second, maximumSize) // maximumSize is iOS only
      .then((base64String) => console.log('This is BASE64 of image', base64String))
      .catch(console.warn);
  }

  getVideoInfo() {
    this.videoPlayerRef.getVideoInfo()
      .then((info) => console.log(info))
      .catch(console.warn);
  }
  render() {
    const { video } = this.state
    console.tron.error({ video })
    return (
      <View style={[styles.mainContainer, { marginTop: Platform.OS === 'ios' ? 20 : 0 }]}>
        {video !== undefined && (
          <View style={{ backgroundColor: 'red', flex: 1 }}>
            <VideoPlayer
              ref={ref => {
                this.videoPlayerRef = ref
                console.log({ ref })
              }}
              // startTime={30}  // seconds
              // endTime={120}   // seconds
              play={true}     // default false
              replay={true}   // should player play video again if it's ended
              rotate={true}   // use this prop to rotate video if it captured in landscape mode iOS only
              source={Platform.OS === 'ios' ? video.uri : `file://${video.path}`}
              playerWidth={300} // iOS only
              playerHeight={500} // iOS only
              style={{ width: 300, height: 500 }}
              resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}

              onChange={({ nativeEvent }) => console.log({ nativeEvent })} // get Current time on every second
            />
            <Trimmer
              source={Platform.OS === 'ios' ? video.uri : `file://${video.path}`}
              height={100}
              width={300}
              // onTrackerMove={(e) => console.log(e.currentTime)} // iOS only
              // currentTime={this.video.currentTime} // use this prop to set tracker position iOS only
              // themeColor={'white'} // iOS only
              // thumbWidth={30} // iOS only
              // trackerColor={'green'} // iOS only
              onChange={(e) => console.log(e.startTime, e.endTime)}
            />
          </View>
        )}
        <Button
          title={'Select Video'}
          onPress={this.onPressPicker}
        />
      </View>
    )
  }
}
