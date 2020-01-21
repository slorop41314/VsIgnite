import firebase from "react-native-firebase";
import ImageResizer from 'react-native-image-resizer';
import { ROOT_DIR } from "../Lib/DownloadHelper";
import { Method } from "react-native-awesome-component";

const MAX_WIDTH = 2048
const MAX_HEIGHT = 2048

export const firebaseUploadFile = (folderName, filePath) => {

  return new Promise((resolve, reject) => {
    ImageResizer.createResizedImage(filePath, MAX_WIDTH, MAX_HEIGHT, 'JPEG', 100, 0).then((response) => {
      // response.uri is the URI of the new image that can now be displayed, uploaded...
      // response.path is the path of the new image
      // response.name is the name of the new image with the extension
      // response.size is the size of the new image
      const { uri, path, name } = response
      const refDir = `${folderName}/${new Date().valueOf()}.jpg`
      firebase
        .storage()
        .ref(refDir)
        .putFile(uri)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      // Oops, something went wrong. Check that the filename is correct and
      // inspect err to get more details.
      reject(err)
    });
  })
}