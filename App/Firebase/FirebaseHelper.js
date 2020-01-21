import firebase from "react-native-firebase";

export const firebaseUploadFile = (refDir, filePath) => {
  return new Promise(async (resolve, reject) => {
    firebase
      .storage()
      .ref(refDir)
      .putFile(filePath)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        console.tron.error({err})
        reject(err)
      })
  })
}