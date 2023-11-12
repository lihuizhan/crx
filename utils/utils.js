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
  return str.replace(/[\\\/\:\*\?\"\<\>\|]/g, replace)
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
