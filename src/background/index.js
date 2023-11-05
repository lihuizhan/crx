import {
  menuInit,
  X_OPEN_NOTE_LIST,
  X_DOWNLOAD_NOTE_IMAGE,
  X_DOWNLOAD_LIST,
  X_DOWNLOAD_TAB
} from './menu.js'

import {
  CONTENT_TO_BACKGROUND,
  CONTENT_TO_BACKGROUND__LIST,
  OFFSCREEN_TO_BACKGROUND
} from '../../globalConfig' // $/globalConfig

import { openNoteList } from './openNoteList.js'
import { createTab } from './createTab.js'
import { batchDownload, downloadJSONFile, batchDownloadJSONFile } from './download.js'
import { setupOffscreenDocument } from '$/utils/utils'

menuInit()

chrome.contextMenus.onClicked.addListener(async function(info, tab) {
  const { menuItemId } = info
  console.log(info, tab)

  if (menuItemId === X_OPEN_NOTE_LIST) {
    openNoteList(tab)
  }
  if (menuItemId === X_DOWNLOAD_NOTE_IMAGE) {}
  if (menuItemId === X_DOWNLOAD_LIST) {
    await setupOffscreenDocument()
    batchDownload(tab)
  }

  if (menuItemId === X_DOWNLOAD_TAB) {
    createTab('./list.html')
  }
})

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  console.log('消息：', request, sender, sendResponse)
  const { cmd, url, result, filename } = request

  // download json file
  // TODO
  if (cmd === OFFSCREEN_TO_BACKGROUND) {
    downloadJSONFile({ ...request })
  }
  if (cmd === CONTENT_TO_BACKGROUND) {
    console.log('content-script: ', result)
    const { url, note } = result
    if (url && note) {
      await chrome.storage.local.set({ [url]: note })
      console.log('success')
    }
  }
  if (cmd === CONTENT_TO_BACKGROUND__LIST) {
    console.log('content-script: ', result)
    const { url, note } = result
    const obj = await chrome.storage.local.get(url)
    if (obj && Array.isArray(obj[url])) {
      console.log({ ...obj })
      // 追加处理
      // TODO 用数据库
      const storageData = obj[url]
      const res = append(storageData, note || [])
      await chrome.storage.local.set({ [url]: res })
      return
    }
    if (url && note) {
      await chrome.storage.local.set({ [url]: note })
      console.log('success')
    }
  }

  sendResponse({ message: '我是后台，已收到你的消息：', request })
})

function append(oldValue = [], newValue = []) {
  const result = [...oldValue]
  const m = {}
  oldValue.forEach(item => {
    m[item.id] = item
  })
  for (let index = 0, len = newValue.length; index < len; index++) {
    const item = newValue[index]
    if (!m[item.id]) {
      result.push(item)
    }
  }

  return result
}
