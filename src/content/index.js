import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Content from '@/content/content.vue'

// 创建id为CRX-container的div
const crxApp = document.createElement('div')
crxApp.id = 'CRX-container'
// 将刚创建的div插入body最后
document.body.appendChild(crxApp)

// 创建Vue APP
const app = createApp(Content)
// 集成Element Plus
app.use(ElementPlus, {
  locale: zhCn
})
// 将Vue APP插入刚创建的div
app.mount('#CRX-container')

import {
  INJECT_TO_CONTENT_SCRIPT,
  INJECT_TO_CONTENT_SCRIPT__LIST,
  CONTENT_TO_BACKGROUND,
  CONTENT_TO_BACKGROUND__LIST
} from '$/globalConfig'

/**
 * @link https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions
 */
function injectCustomScript(jsPath) {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL(jsPath) // chrome-extension://xxxxxx/js/inject-script.js
  script.onload = function() {
    console.log('load')
    this.parentNode.removeChild(this)
  };
  (document.head || document.documentElement).appendChild(script)
}

injectCustomScript('inject.js')

// 接收 inject 消息
window.addEventListener('message', async function(e) {
  console.log('content message', e)
  if (e?.data?.cmd === INJECT_TO_CONTENT_SCRIPT) {
    await chrome.runtime.sendMessage({ cmd: CONTENT_TO_BACKGROUND, url: location.href, result: e.data })
  }

  if (e?.data?.cmd === INJECT_TO_CONTENT_SCRIPT__LIST) {
    await chrome.runtime.sendMessage({ cmd: CONTENT_TO_BACKGROUND__LIST, url: location.href, result: e.data })
  }
}, false)
