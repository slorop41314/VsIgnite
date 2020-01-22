import firebase from "react-native-firebase";
import ImageResizer from 'react-native-image-resizer';
import { ROOT_DIR } from "../Lib/DownloadHelper";
import { Method } from "react-native-awesome-component";
import PubnubStrings from "../Pubnub/PubnubStrings";

const MAX_WIDTH = 2048
const MAX_HEIGHT = 2048

firebase.storage().setMaxUploadRetryTime(10000)
firebase.storage().setMaxOperationRetryTime(10000)

export const uplaodFileHelper = async (data, successCallback, errorCallback, progressCallback) => {
  try {
    let { channel, message } = data
    const { type } = message

    let file = undefined
    let refDir = `${channel}/${new Date().valueOf()}.jpg`

    if (type === PubnubStrings.message.type.image) {
      refDir = `${channel}/${new Date().valueOf()}.jpg`
      const { image } = message
      file = image
      const filePath = file.path.includes('file://') ? file.path : `file://${file.path}`
      const newFile = await ImageResizer.createResizedImage(filePath, MAX_WIDTH, MAX_HEIGHT, 'JPEG', 100, 0)
      file = {
        ...file,
        path: newFile.path
      }
    }

    if (type === PubnubStrings.message.type.video) {
      refDir = `${channel}/${new Date().valueOf()}.mp4`
      const { video } = message
      file = video
    }

    if (file) {
      const filePath = file.path.includes('file://') ? file.path : `file://${file.path}`
      const ref = firebase.storage().ref(refDir);
      const unsubscribe = ref.putFile(filePath)
        .on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
              successCallback({ ...snapshot, filePath })
              unsubscribe()
            } else {
              progressCallback(snapshot)
            }
          },
          (error) => {
            errorCallback(error)
            unsubscribe()
          })
    }
  } catch (error) {
    errorCallback(error)
  }
}


export const firebaseUploadFile = (folderName, filePath, isImage, progressCallback) => {

  return new Promise((resolve, reject) => {
    if (isImage) {
      ImageResizer.createResizedImage(filePath, MAX_WIDTH, MAX_HEIGHT, 'JPEG', 100, 0).then((response) => {
        // response.uri is the URI of the new image that can now be displayed, uploaded...
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image
        const { uri, path, name } = response
        const refDir = `${folderName}/${new Date().valueOf()}.jpg`
        const ref = firebase.storage().ref(refDir);
        const unsubscribe = ref.putFile(uri)
          .on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
              console.tron.log(refDir, snapshot)
              if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                // complete
                unsubscribe()
                resolve(snapshot.res)
              } else {
                progressCallback(snapshot)
              }
            },
            (error) => {
              unsubscribe()
              reject(error)
            })
      }).catch((err) => {
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
        reject(err)
      });
    } else {
      const refDir = `${folderName}/${new Date().valueOf()}.mp4`
      const ref = firebase.storage().ref(refDir);
      const unsubscribe = ref.putFile(filePath)
        .on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            console.tron.log(refDir, snapshot)
            if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
              // complete
              unsubscribe()
              resolve(snapshot.res)
            } else {
              progressCallback(snapshot)
            }
          },
          (error) => {
            unsubscribe()
            reject(error)
          })
    }
  })
}