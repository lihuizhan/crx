import { throttle } from 'lodash'
import {
  XHS_HOSTNAME,
  INJECT_TO_CONTENT_SCRIPT,
  INJECT_TO_CONTENT_SCRIPT__LIST
} from '$/globalConfig'

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

  if (note && Object.keys(note).length === 0) {
    console.log(53, 'empty', note)
  }
}

function init() {
  const elementToObserve = document.querySelector('#global')
  if (!elementToObserve) {
    window.setTimeout(init, 1000)
    return
  }

  // 创建一个叫 `observer` 的新 `MutationObserver` 实例，
  // 并将回调函数传给它
  const _mutationCallback = throttle(mutationCallback, 1000)
  const observer = new MutationObserver(_mutationCallback)

  // 在 MutationObserver 实例上调用 `observe` 方法，
  // 并将要观察的元素与选项传给此方法
  observer.observe(elementToObserve, { subtree: true, childList: true })
}

function mutationCallback() {
  if (location.host.includes(XHS_HOSTNAME)) {
    getNoteList()
    getNoteDetails()
  }
}

init()
