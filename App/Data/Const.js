export const DEFAULT_STATE = {
  data: undefined,
  fetching: undefined,
  payload: undefined,
  error: undefined,
}

export const FirebaseStrings = {
  hasUser: 'has-user',
  nouser: 'no-user',
}

// export const DefaultAccount = {
//   email: __DEV__ ? 'rahmat@virtualspirit.me' : '',
//   password: __DEV__ ? 'Useruser12345!' : '',
//   name: __DEV__ ? 'Rahmat Zulfikri' : '',
//   photoUrl: __DEV__ ? 'http://rahmatzulfikri.xyz/images/avatar.jpg' : ''
// }

export const DefaultAccount = {
  email: __DEV__ ? 'me@rahmatzulfikri.xyz' : '',
  password: __DEV__ ? 'Useruser12345!' : '',
  name: __DEV__ ? 'Zulfikri' : '',
  photoUrl: __DEV__ ? '' : ''
}