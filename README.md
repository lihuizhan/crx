# crx
Chrome Extensions


### 参考

- [crx-template](https://github.com/AdolphGithub/crx-template)
- [把WebP格式图片保存成png/jpg（js实现）](https://juejin.cn/post/7069254092538773518)
- [How to avoid "Extension context invalidated" errors when messaging AFTER an Extension update?](https://stackoverflow.com/questions/53939205/how-to-avoid-extension-context-invalidated-errors-when-messaging-after-an-exte)
- [学习 Webpack5 之路（优化篇）](https://www.cnblogs.com/o2team/p/15220107.html)
- [How to fix 'Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.'](https://stackoverflow.com/questions/54619817/how-to-fix-unchecked-runtime-lasterror-could-not-establish-connection-receivi)
- [chrome插件开发 判断页面加载完](https://juejin.cn/s/chrome%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91%20%E5%88%A4%E6%96%AD%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%AE%8C)
- [webNavigation.onDOMContentLoaded](https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onDOMContentLoaded)


```js
chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.frameId === 0) {
    // 页面加载完成
    // 在这里执行你想要的操作
  }
});

chrome.webNavigation.onDOMContentLoaded 事件会在页面 DOM 加载完成后触发

```

### 引入Element Plus

```sh

yarn add element-plus
yarn add -D unplugin-vue-components unplugin-auto-import

```



https://www.cnblogs.com/brandonhulala/p/6057378.html

https://webpack.docschina.org/configuration/externals/#externals

- [ReferenceError: __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__ is not defined - keRee - 博客园](https://www.cnblogs.com/keRee/p/16090130.html)

### 通过 CDN 使用 Vue

https://unpkg.com/vue@3/dist/vue.global.js



### TODO

- 编译打包太慢
- 如何在content.js引入图片
- Caching failed for pack: Error: Unable to snapshot resolve dependencies
- 标题中表情包💇‍♀️ 如何处理
- Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
