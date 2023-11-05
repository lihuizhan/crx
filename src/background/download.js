import { pathParse, safeFileName, sleep, formatDate } from '$/utils/utils'
import { getNoteListByKey, getNoteDetailsList, getImage } from './data'
import { BACKGROUND_TO_OFFSCREEN } from '../../globalConfig'
import { getOptionsConfig } from '$/utils/config'

// 批量下载
export async function batchDownload(tab) {
  const list = await getNoteListByKey(tab.url)

  const result = await getNoteDetailsList(list)

  const { nickname } = getUser(list[0])
  const listFileName = `${nickname}/${nickname}_list.json`
  const detailFileName = `${nickname}/${nickname}_deatil_list.json`
  const [r1, r2] = await pathExists([
    { filename: listFileName },
    { filename: detailFileName }
  ])
  if (!r1.exist) {
    await chrome.runtime.sendMessage({ cmd: BACKGROUND_TO_OFFSCREEN, result: list, filename: listFileName })
    await sleep(500)
  }
  if (!r2.exist) {
    await chrome.runtime.sendMessage({ cmd: BACKGROUND_TO_OFFSCREEN, result: result, filename: detailFileName })
  }

  const imagesList = getImage(result)
  await downloadImageBatch(imagesList)
}

export async function downloadImageBatch(list) {
  if (!Array.isArray(list)) {
    console.log('fail: ', list)
    return
  }

  const res = await pathExists(list)
  const filterList = res.filter(({ exist }) => !exist)
  console.log(filterList)

  while (filterList.length) {
    const config = await getOptionsConfig()
    if (!config.download) {
      break
    }
    const items = filterList.splice(0, 2)
    const tasks = items.map(({ url, filename }) => {
      return chrome.downloads.download({ url, filename }).then(downloadId => {
        return { downloadId }
      })
    })
    await Promise.allSettled(tasks)
    await sleep(2000)
  }
}

// 有filename
export function downloadJSONFile({ url, filename }) {
  if (!filename) {
    console.log('download json file fail:', filename)
    return
  }
  chrome.downloads.download({ url: url, filename }).then(downloadId => {
    return { downloadId }
  })
}

function getUser(noteItem = {}) {
  const { noteCard } = noteItem || {}
  const { user } = noteCard || {}
  return user
}

// pathExists([{ url: '', filename: 'D:\\xxxx\\白色口罩为什么那么有纯净感？！-4.jpg' }])
function pathExists(list = []) {
  const body = { list }
  return fetch('http://localhost:3005/avmoo/fs/pathExists', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch((error) => {
      console.log(error)
      // return { reject: true }
      return list
    })
}
