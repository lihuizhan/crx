// https://developer.chrome.com/docs/extensions/reference/offscreen/#method-createDocument
let creating // A global promise to avoid concurrency issues
export async function setupOffscreenDocument(path) {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  // const offscreenUrl = chrome.runtime.getURL(path)
  const matchedClients = await clients.matchAll()

  if (matchedClients.some(item => item.url.includes('offscreen.html'))) {
    return
  }

  // create offscreen document
  if (creating) {
    await creating
  } else {
    creating = chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: [chrome.offscreen.Reason.BLOBS],
      justification: 'reason for needing the document'
    })
    await creating
    creating = null
  }
}

/**
 * @description Node.js path.parse(pathString) ponyfill.
 * @link https://github.com/jbgutierrez/path-parse
 * @export
 * @param {String} pathString
 * @returns
 * {
 *   root : '/',
 *   dir : '/home/user/dir',
 *   base : 'file.txt',
 *   ext : '.txt',
 *   name : 'file'
 *  }
 */
export function pathParse(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString)
  }
  var allParts = win32SplitPath(pathString)
  if (!allParts || allParts.length !== 5) {
    throw new TypeError("Invalid path '" + pathString + "'")
  }
  return {
    root: allParts[1],
    dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
    base: allParts[2],
    ext: allParts[4],
    name: allParts[3]
  }
  function win32SplitPath(filename) {
    const splitWindowsRe = /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/
    return splitWindowsRe.exec(filename).slice(1)
  }
}

export function safeFileName(str, replace = '-') {
  // return str.replace(/[\\\/\:\*\?\"\<\>\|]/g, replace)
  // str.replace(/[^\u4e00-\u9fa5a-zA-Z0-9，。]/g, '')
  // str.replace(/[^\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEFa-zA-Z\s\.,!?;:()\-“”‘’“”\[\]\{\}\/\<\>\@\#\$\%\^\&\*\_\+\=\\\|~`]/g, '');

  // 正则表达式解释：
  // \p{Script=Han} 匹配汉字
  // \p{L} 匹配任何字母（包括汉字、拉丁字母等）‌
  // [a-zA-Z] 匹配英文字母
  // \d 匹配数字
  // \p{P} 匹配标点符号（包括全角和半角）
  // [^...] 匹配不在括号内的任何字符，在这里用于匹配非中英文和非数字标点符号的部分
  // 全局替换为空字符串，即移除这些字符
  return str
    .replace(/[\\\/\:\：\*\?\"\<\>\|]/g, replace)
    .replace(/[^\p{Script=Han}\p{L}\d\p{P}\s]/gu, '')
    .replace(/\s+/g, ' ')
    // .replace(/[^\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEFa-zA-Z\s\.,!?;()\-“”‘’“”\[\]\{\}\/\<\>\@\#\$\%\^\&\*\_\+\=\\\|~•`]/g, '')
}

export function sleep(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function formatDate(t) {
  const date = new Date(t)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

export async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}
