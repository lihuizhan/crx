/* global module, require */
const { merge } = require('webpack-merge')
var base_config = require('./base')

// 重新处理一下.
module.exports = merge(base_config, {
  mode: 'production',
  // 指定入口.
  watch: true,
  cache: {
    type: 'filesystem' // 使用文件系统缓存
  }
})
