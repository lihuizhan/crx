import { globalTabs } from './openNoteList.js'

export async function saveOneNote(request, sender) {
  const { result } = request
  const { url, note } = result
  console.log('content-script: ', result)
  if (url && note) {
    await chrome.storage.local.set({ [url]: note })

    // 关掉globalTabs里缓存的页签
    try {
      console.log({ globalTabs })
      const { tab } = sender
      if (globalTabs.has(tab.id)) {
        await chrome.tabs.remove(tab.id)
        globalTabs.delete(tab.id)
      }
    } catch (error) {
      console.log(error)
    }

    console.log('success')
  }
}

export async function saveNoteList(request) {
  const { result } = request
  const { url, note } = result
  console.log('content-script: ', result)
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
