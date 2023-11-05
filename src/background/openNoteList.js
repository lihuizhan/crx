import { sleep } from '$/utils/utils'
import { getOptionsConfig } from '$/utils/config'

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
    const items = filterList.splice(0, 5)
    const tasks = items.map(item => {
      const { id, noteCard } = item
      const { user } = noteCard
      const url = `https://www.xiaohongshu.com/user/profile/${user.userId}/${id}` // == `https://www.xiaohongshu.com/explore/${id}`
      return chrome.tabs.create({ url: url })
    })

    let tabs
    try {
      tabs = await Promise.all(tasks)
      console.log(`${total - filterList.length}/${total}`, { tabs })
      await sleep(3000 * items.length)
    } catch (error) {
      console.log(error)
    }

    try {
      const removeTabs = tabs.map(({ id }) => chrome.tabs.remove(id))
      await Promise.allSettled(removeTabs)
    } catch (error) {
      console.log(error)
    }
    await sleep(1500)
  }
}
