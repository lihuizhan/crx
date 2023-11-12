import { pathParse, safeFileName, sleep, formatDate } from '$/utils/utils'
import {
  BACKGROUND_TO_CONTENT__MESSAGE
} from '$/globalConfig'

/**
 * @description
 * @param {String} key
 * @returns {Array} Returns `array`.
 *
 * await getNoteListByKey('https://www.xiaohongshu.com/user/profile/5e3273250000000001008700')
 * => [{...}]
 */
export async function getNoteListByKey(key) {
  const storage = await chrome.storage.local.get(key)
  if (!storage) {
    return []
  }

  const list = storage[key]
  if (!Array.isArray(list)) {
    console.log('list null: ', list)
    await chrome.runtime.sendMessage({ cmd: BACKGROUND_TO_CONTENT__MESSAGE, message: `${key} 无数据` })
    return []
  }

  return list
}

// userId
/**
 * @description
 * @param {Array} list
 * @returns {Array} Returns `array`.
 */
export async function getNoteDetailsList(list = []) {
  const ids = list
    .filter((item) => item && item.id)
    .map(({ id }) => `https://www.xiaohongshu.com/explore/${id}`)

  const taskList = ids.map(key => chrome.storage.local.get(key))
  const res = await Promise.all(taskList).then(res => res.flat(1))
  const result = []
  for (let i = 0; i < res.length; i++) {
    const item = res[i]
    for (const [key, value] of Object.entries(item)) {
      if (value && Object.keys(value).length) {
        result.push(value)
      } else {
        console.log({ key, value })
        await chrome.storage.local.remove(key)
      }
    }
  }
  console.log(43, result)
  return result
}

export function getImage(array) {
  const imagesList = []
  for (let index = 0, len = array.length; index < len; index++) {
    const note = array[index]
    // note 为null或者{}
    if (!note || !note.user) {
      console.log('continue', note)
      continue
    }
    try {
      imagesList.push(...getImageByNote(note))
    } catch (error) {
      console.log(error, note, index)
    }
  }

  console.log({ imagesList })
  return imagesList
}

function getImageByNote(note = {}) {
  const { user, title, imageList, time, noteId } = note || {}
  const { nickname } = user
  if (!Array.isArray(imageList)) {
    return []
  }
  const list = imageList.map((image, i) => {
    const { infoList } = image
    const infoItem = infoList.filter(item => item.imageScene === 'CRD_WM_WEBP')[0] || {}

    const { url } = infoItem
    const { name, ext, base } = url.includes('!') ? pathParse(url.split('!')[0]) : pathParse(url)
    // const matchText = title.match(/[\u4e00-\u9fa5a-zA-Z\d,\.，。]+/)
    // const text = matchText[0] ? matchText[0] : title
    const safeTitle = `${safeFileName(title)}-${formatDate(time)}__${noteId}`
    return {
      url,
      // 创建标题文件夹单独存放
      // filename: ext ? `${nickname}/${safeTitle}/${base}` : `${nickname}/${safeTitle}/${name}.jpg`
      // 存放到用户名文件夹
      filename: ext ? `${nickname}/${safeTitle}-${i + 1}${ext}` : `${nickname}/${safeTitle}-${i + 1}.jpg`
    }
  })

  return list
}

export function getUser(noteItem = {}) {
  const { noteCard } = noteItem || {}
  const { user } = noteCard || {}
  return user
}
