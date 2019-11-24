import firebase from "react-native-firebase";
import { is } from 'ramda'
import { generateUUID } from "./modules/helper";

export let currentUser = undefined

export async function setUser({ id, email, fullname, photo }, callback) {
  try {
    const ref = firebase.firestore().collection('user')
    const user = await ref.where('email', '==', email).get()
    let uuid = id

    if (user.empty) {
      if (uuid === undefined) {
        uuid = generateUUID(email)
      }
      const newUser = { name: fullname, email, uuid, photo }
      const ref2 = firebase.firestore().collection('user').doc(uuid)
      ref2.set(newUser)
      currentUser = newUser
    } else {
      currentUser = user.docs[0].data()
    }

    if (is(Function, callback)) {
      callback(currentUser)
    }
  } catch (error) {
    console.log('Error Set User', error)
  }
}








