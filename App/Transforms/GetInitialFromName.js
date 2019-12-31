export default function getInitialFromName(name) {
  if (name) {
    const nameSplit = name.split(' ')
    if (nameSplit.length > 1) {
      const lastIndex = nameSplit.length - 1
      return `${nameSplit[0].charAt(0)}${nameSplit[lastIndex].charAt(0)}`
    } else {
      return nameSplit[0].charAt(0)
    }
  } else {
    return ''
  }
}