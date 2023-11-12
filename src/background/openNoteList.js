import { sleep, getCurrentTab } from '$/utils/utils'
import { getOptionsConfig } from '$/utils/config'
import {
  BACKGROUND_TO_CONTENT__MESSAGE
} from '$/globalConfig'

export const globalTabs = new Map()
// const filter = {
//   url: [{ hostContains: 'xiaohongshu.com' }, { hostPrefix: 'xiaohongshu' }]
// }

// async function logOnDOMContentLoaded(details) {
//   console.log('onDOMContentLoaded: ', details, details.url)
//   const { tabId } = details
//   const tab = globalTabs.get(tabId)
//   if (!tab) {
//     return
//   }
//   try {
//     await chrome.tabs.remove(tabId)
//     globalTabs.delete(tabId)
//   } catch (error) {
//     console.log(error)
//   }
// }

// chrome.webNavigation.onDOMContentLoaded.addListener(
//   logOnDOMContentLoaded,
//   filter
// )

export async function openNoteList(tab) {
  const initConfig = await getOptionsConfig()
  const res = await chrome.storage.local.get(tab.url)
  console.log(res)

  if (!initConfig.openTab) {
    console.log('任务-停用', initConfig)
    return
  }

  const list = res[tab.url]
  if (!Array.isArray(list)) {
    console.log('fail: ', list, tab.url)
    // await chrome.runtime.sendMessage({ cmd: BACKGROUND_TO_CONTENT__MESSAGE, message: `无列表数据` })
    // const currentTab = await getCurrentTab()

    await chrome.tabs.sendMessage(tab.id, { cmd: BACKGROUND_TO_CONTENT__MESSAGE, message: `无列表数据` })
    return
  }
  // 过滤已存储的数据
  const filterList = []
  for (let index = 0; index < list.length; index++) {
    const item = list[index]
    const { id, noteCard } = item
    const url = `https://www.xiaohongshu.com/explore/${id}`
    const note = await chrome.storage.local.get(url)
    if (!note || !note[url]) {
      filterList.push(item)
    }
  }

  console.log('filterList', filterList)
  const total = filterList.length
  while (filterList.length) {
    const config = await getOptionsConfig()
    if (!config.openTab) {
      break
    }
    const items = filterList.splice(0, config.batchTab || 5)
    const tasks = items.map(item => {
      const { id, noteCard } = item
      const { user } = noteCard
      // ?x=xhs
      const url = `https://www.xiaohongshu.com/user/profile/${user.userId}/${id}` // == `https://www.xiaohongshu.com/explore/${id}`
      return chrome.tabs.create({ url: url })
    })

    let tabs
    try {
      tabs = await Promise.all(tasks)
      setTabs(tabs)
      console.log(`${total - filterList.length}/${total}`, { tabs })
      await sleep(500 * items.length)
      // await sleep(3000 * items.length)
    } catch (error) {
      console.log(error)
    }

    console.log(tabs)
    // try {
    //   const removeTabs = tabs.map(({ id }) => chrome.tabs.remove(id))
    //   await Promise.allSettled(removeTabs)
    // } catch (error) {
    //   console.log(error)
    // }
    await sleep(1200)
  }
}

function setTabs(tabs = []) {
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    if (!globalTabs.has(tab.id)) {
      globalTabs.set(tab.id, tab)
    }
  }
}
