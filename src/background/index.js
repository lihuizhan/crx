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
import { batchDownload, downloadJSONFile } from './download.js'
import { saveOneNote, saveNoteList } from './saveNote.js'
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
  console.log('消息：', request, { sender }, sendResponse)
  const { cmd, url, result, filename } = request

  // download json file
  if (cmd === OFFSCREEN_TO_BACKGROUND) {
    downloadJSONFile({ ...request })
  }

  // 保存单个笔记详情
  if (cmd === CONTENT_TO_BACKGROUND) {
    saveOneNote(request, sender)
  }
  if (cmd === CONTENT_TO_BACKGROUND__LIST) {
    saveNoteList(request)
  }

  sendResponse({ message: '我是后台，已收到你的消息：', request })
})
