import { is } from 'ramda'
import NavigationServices from '../Services/NavigationServices'
import firebase from "react-native-firebase";
import { call } from '@redux-saga/core/effects';

let currentUser = undefined

export const CHANNEL_TYPE = {
  single: 'single',
  group: 'group',
}

export async function setUser({ id, email, fullname, photo }, callback) {
  const ref = firebase.firestore().collection('user')
  const user = await ref.where('email', '==', email).get()
  let uuid = id

  if (uuid === undefined) {
    const uuidv1 = require('uuid/v1');
    const uuidv3 = require('uuid/v3');
    const MY_NAMESPACE = uuidv1()
    uuid = uuidv3(email, MY_NAMESPACE);
  }

  if (user.empty) {
    const newUser = { name: fullname, email, uuid, photo }
    ref.add(newUser)
    currentUser = newUser
  } else {
    currentUser = user.docs[0].data()
  }

  if (is(Function, callback)) {
    callback(currentUser)
  }
}

export async function getUserList(callback) {
  const ref = firebase.firestore().collection('user')
  const users = await ref.get()
  Promise.all(users.docs.map(doc => {
    return doc.data()
  })).then(res => {
    return callback(res)
  })
}

export async function getChannelList(callback) {
  const ref = firebase.firestore().collection('channels')
  ref.onSnapshot((snapshot) => {
    Promise.all(snapshot.docs.map(doc => {
      return doc.data()
    })).then(res => callback(res))
  }, (error) => {
    console.log({error})
  })
}

/**
 * @param {*} users user object can be array or target channel
 * @param {*} type channel type (group | single)
 * @param {*} meta meta information required
 */
export async function createOrgetChannel(users, type, meta) {
  const ref = firebase.firestore().collection('channels')
  const channel = await ref.where('type', '==', type)

  // if (type === CHANNEL_TYPE.group) {

  // } else {

  // }
}

