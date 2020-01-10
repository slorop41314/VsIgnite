import uuidv1 from 'uuid/v1'
import PubnubStrings from './PubnubStrings'
import R from 'ramda'

export function generateSingleSpaceUID(user1, user2) {
  return `single-${uuidv1()}`
}

export function generateGroupSpaceUID() {
  return `group-${uuidv1()}`
}

export function isSingleChat(id) {
  return id.includes(`${PubnubStrings.space.type.single}-`)
}

export function convertArrToObj(arr, key = 'id') {
  return R.reduce((result, item) => ((result[item[key]] = item), result), {}, arr)
}

export function convertTimestampToDate(timestamp) {
  const date = new Date(timestamp / 1e4)
  return date
}