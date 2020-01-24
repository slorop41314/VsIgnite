import URL from 'url'
import { ToastAndroid, Alert, Text, Linking } from 'react-native';
import { getLinkPreview } from 'link-preview-js';
import { Method } from 'react-native-awesome-component';
var linkify = require('linkifyjs')

let lastUrl = ''
let lasPreview = {}

export async function checkOrGetUrlFromString(string) {
  try {
    const res = linkify.find(string, 'url');
    if (res.length > 0) {
      const url = res[0].href
      if (lastUrl !== url) {
        const preview = await getLinkPreview(url)
        const parseUrl = URL.parse(url, true, true)
        const parsePreview = URL.parse(preview.url)
        const targetHost = parseUrl.host.replace('www.', '')
        const previewHost = parsePreview.host.replace('www.', '')
        if (preview && (targetHost === previewHost)) {
          lastUrl = url
          lasPreview = preview
          return {
            hasPreview: true,
            preview: lasPreview
          }
        } else {
          return {
            hasPreview: false,
            preview: null
          }
        }
      } else {
        if ((lastUrl !== '') && (lasPreview !== {})) {
          return {
            hasPreview: true,
            preview: lasPreview
          }
        } else {
          return {
            hasPreview: false,
            preview: null
          }
        }
      }
    } else {
      lasUrl = ''
      return {
        hasPreview: false,
        preview: null
      }
    }
  } catch (error) {
    console.tron.error({ error })
  }
}

export function getUrlsFromString(string) {
  return linkify.find(string, 'url');
}

export function generateTextWithLinkCompoent(defaultTextComponent, linkTextComponent, text) {
  const urls = getUrlsFromString(text)
  if (urls.length > 0) {
    // START CODE TO CHECK LINK
    let pos = 0
    let children = []
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].value
      const link = urls[i].href
      const urlStartPos = text.indexOf(url, pos)
      const urlEndPos = urlStartPos + url.length

      if (pos !== urlStartPos) {
        const message = text.substring(pos, urlStartPos)
        let prevComponent = Method.Object.appendObject(defaultTextComponent, 'key', `${pos}-${urlStartPos}`)
        prevComponent = Method.Object.appendChildToView(prevComponent, message)
        children.push(prevComponent)
      }

      const urlMessage = text.substring(urlStartPos, urlEndPos)
      let component = Method.Object.appendObject(linkTextComponent, 'key', `${urlStartPos}-${urlEndPos}`)
      component = Method.Object.appendChildToView(component, urlMessage)
      component = Method.Object.appendPropsToView(component, 'onPress', () => { Linking.openURL(link) })
      children.push(component)


      if ((i === (urls.length - 1)) && (urlEndPos !== text.length)) {
        const message = text.substring(urlEndPos, text.length)
        let lastComponent = Method.Object.appendObject(defaultTextComponent, 'key', `${urlEndPos}-${text.length}`)
        lastComponent = Method.Object.appendChildToView(lastComponent, message)
        children.push(lastComponent)
      }

      pos = urlEndPos
    }
    // END CODE TO CHECK LINK


    // APPEND NEW CHILD TO TEXT COMPONENT
    return Method.Object.appendChildToView(defaultTextComponent, children)
  } else {
    return Method.Object.appendChildToView(defaultTextComponent, text)
  }
}