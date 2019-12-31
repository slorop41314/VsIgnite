import firebase from "react-native-firebase"

class FireStoreManager {
  userRef = undefined

  constructor() {

    this.userRef = firebase.firestore().collection('user')

    this.addUser = this.addUser.bind(this)
  }

  addUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const userParams = {
          id: user.uid,
          fullname: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        }

        this.userRef.doc(user.uid).set(userParams)
        resolve(userParams)
      } catch (error) {
        reject(error)
      }
    })
  }

  getUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const userRef = firebase.firestore().collection('user')
        const userList = await userRef.orderBy('fullname', 'ASC').get()

        Promise.all(userList.docs.map(doc => {
          const user = doc.data()
          return user
        })).then((users) => {
          resolve(users)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default new FireStoreManager()