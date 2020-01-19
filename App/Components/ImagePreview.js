import React, { useState } from 'react'
import { View, TouchableOpacity, Platform, ToastAndroid, Alert, StyleSheet, Image } from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import ImageViewer from 'react-native-image-zoom-viewer'
import Icons from 'react-native-vector-icons/FontAwesome5'
import { Colors } from '../Themes'
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper'
import { Styled, PlaceholderImage } from 'react-native-awesome-component'
// import RNFS from 'react-native-fs';
// import { Method } from 'react-native-awesome-component'
// import CameraRoll from "@react-native-community/cameraroll";
// import I18n from '../../I18n'

// function getLocalFileFromUrl(url) {
//   const rootDir = Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath : `file://${RNFS.TemporaryDirectoryPath}`;
//   return localFile = `${rootDir}/TVMS/${Method.Helper.getFileNameFromPath(url)}`;
// }

// function onPressDownload(url) {
//   const options = {
//     fromUrl: url,
//     toFile: getLocalFileFromUrl(url)
//   };
//   if (Platform.OS === 'ios') {
//     CameraRoll.save(url, { album: 'TVMS', type: 'photo' })
//       .then(() => {
//         Alert.alert('Download completed', 'kindly check your TVMS album')
//       })
//       .catch(() => {
//         Alert.alert('Download failure', 'Please check your persmission and internet connection, and try again')
//       })
//   } else {
//     RNFS.downloadFile(options).promise
//       .then(() => {
//         CameraRoll.save(options.toFile, { album: 'TVMS', type: 'photo' })
//           .then(() => {
//             ToastAndroid.show('Download completed. kindly check your TVMS album', ToastAndroid.LONG)
//           })
//       })
//       .catch(() => {
//         ToastAndroid.show('Download failure. Please check your persmission and internet connection, and try again', ToastAndroid.LONG)
//       })
//   }
// }

const styles = StyleSheet.create({
  headerContainer: {
    top: Platform.OS === 'ios' ? getStatusBarHeight() : 0, zIndex: 100, position: 'absolute', paddingLeft: 10
  },
  headerButton: {
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center'
  },
  footerContainer: {
    width: '100%', position: 'absolute', zIndex: 100, paddingRight: 20
  },
  footerButton: {
    alignSelf: 'flex-end', width: 40, height: 40, justifyContent: 'center', alignItems: 'center'
  },
  footer: {
    width: '100%', height: getBottomSpace() + 50
  }
})

const ImagePreview = (props) => {
  const { index, images } = props

  const [visible, setVisible] = useState(false)

  function onPressChild() {
    setVisible(true)
  }

  function onClose() {
    setVisible(false)
  }

  return (
    <Styled.Container>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onBackButtonPress={onClose}
        style={{ margin: 0 }}
      >
        <ImageViewer
          imageUrls={images}
          index={index}
          onSwipeDown={() => onClose()}
          enableSwipeDown={true}
          renderHeader={() => {
            return (
              <View style={styles.headerContainer}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => onClose()} style={styles.headerButton}>
                  <Icons name={'times-circle'} size={30} color={Colors.snow} />
                </TouchableOpacity>
              </View>
            )
          }}
          renderFooter={(currentIndex) => {
            return (
              <View style={styles.footerContainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.footerButton}>
                  <Icons name={'file-download'} size={30} color={Colors.snow} />
                </TouchableOpacity>
              </View>
            )
          }}
          renderImage={(image) => {
            const { style, source } = image
            return (
              <Image
                style={style}
                source={source}
                resizeMethod={'resize'}
              />
            )
          }}
          footerContainerStyle={styles.footer}
          saveToLocalByLongPress={false}
          onLongPress={false}
        />
      </Modal>
      <TouchableOpacity activeOpacity={0.8} onPress={onPressChild}>
        {props.children}
      </TouchableOpacity>
    </Styled.Container>
  )
}

const imagesShape = PropTypes.shape({
  url: PropTypes.string,
})

ImagePreview.propTypes = {
  index: PropTypes.number,
  images: PropTypes.arrayOf(imagesShape),
}

export default ImagePreview