import { BACKGROUND_TO_OFFSCREEN, OFFSCREEN_TO_BACKGROUND } from '$/globalConfig'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('消息：', request, sender, sendResponse)
  const { cmd } = request
  if (cmd === BACKGROUND_TO_OFFSCREEN) {
    create(request)
  }
  sendResponse({ message: '我是 offscreen，已收到你的消息：', request })
})

async function create({ filename, result }) {
  if (!filename || !result) {
    return
  }
  const text = JSON.stringify(result, null, 2)
  const blob = new Blob([text], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  await chrome.runtime.sendMessage({ cmd: OFFSCREEN_TO_BACKGROUND, url, result, filename })
}
