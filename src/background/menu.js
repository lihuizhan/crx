
export const X_OPEN_NOTE_LIST = 'x_open_note_list'
export const X_DOWNLOAD_NOTE_IMAGE = 'x_download_note_image'
export const X_DOWNLOAD_LIST = 'x_download_list'
export const X_DOWNLOAD_TAB = 'x_download_tab'

export const menus = [
  {
    'id': X_OPEN_NOTE_LIST,
    'type': 'normal',
    'title': 'open Note List'
  },
  {
    'id': X_DOWNLOAD_NOTE_IMAGE,
    'type': 'normal',
    'title': 'download Note Image'
  },
  {
    'id': X_DOWNLOAD_LIST,
    'type': 'normal',
    'title': 'download List'
  },
  {
    'id': X_DOWNLOAD_TAB,
    'type': 'normal',
    'title': '打开下载页签'
  }
]

export function menuInit() {
  chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.removeAll(function() {
      menus.forEach(menu => {
        chrome.contextMenus.create(menu)
      })
    })
  })
}
