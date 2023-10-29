import {
  INJECT_TO_CONTENT_SCRIPT,
  INJECT_TO_CONTENT_SCRIPT__LIST
} from '../globalConfig'

console.log('load my script', window?.__INITIAL_STATE__)

//
/**
 * 笔记列表
 * https://www.xiaohongshu.com/user/profile/62a497cb00000000210255af
 */

function getNoteList() {
  if (!location.href.includes('//www.xiaohongshu.com/user/profile')) {
    return
  }

  let result = JSON.parse(JSON.stringify(window?.__INITIAL_STATE__?.user?.notes?.value))
  if (Array.isArray(result)) {
    result = result.flat(1)
  }
  console.log(result.length)

  window.postMessage({
    cmd: INJECT_TO_CONTENT_SCRIPT__LIST,
    url: location.href,
    note: result
  }, '*')
}

function getNoteDetails() {
  if (!location.href.includes('//www.xiaohongshu.com/explore/')) {
    return
  }

  const noteDetailMap = { ...window?.__INITIAL_STATE__?.note?.noteDetailMap }
  const [{ note }] = Object.values(noteDetailMap)
  if (note) {
    const result = JSON.parse(JSON.stringify(note))

    console.log(result)
    window.postMessage({
      cmd: INJECT_TO_CONTENT_SCRIPT,
      url: location.href,
      note: { ...result }
    }, '*')
  }
}

if (location.host.includes('www.xiaohongshu.com')) {
  getNoteList()
  getNoteDetails()
}
