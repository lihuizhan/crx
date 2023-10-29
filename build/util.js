/*global require, __dirname, module */
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function findEntry() {
  const app_path = path.dirname(__dirname)
  const sep = path.sep
  const src_path = path.resolve(app_path, 'src')
  const modules = []
  const entries = {}
  const srcDirs = fs.readdirSync(path.resolve(app_path, 'src'))

  srcDirs.forEach(function(item) {
    const full_path = path.join(src_path, item)
    const stat = fs.statSync(full_path)

    if (stat.isDirectory()) {
      modules.push(full_path)
    }
  })

  // 获取所有的文件夹下面所有的入口文件.
  if (modules.length <= 0) {
    return {}
  }

  modules.forEach(function(item) {

  })

  for (let index = 0; index < modules.length; index++) {
    const item = modules[index]
    const entryPath = path.join(item, sep, 'index.js')
    if (!fs.existsSync(entryPath)) {
      continue
    }
    const entry = fs.statSync(entryPath)
    if (!entry.isFile()) {
      continue
    }

    const info = path.parse(entryPath)

    let dirname = info.dir.split(sep).pop()

    if (['panel', 'sidebar'].indexOf(dirname) > -1) {
      dirname = 'devtools' + sep + dirname
    }

    entries[dirname] = entryPath
  }

  if (fs.statSync(app_path + ['', 'src', 'content.js'].join(sep)).isFile()) {
    entries['content'] = app_path + ['', 'src', 'content.js'].join(sep)
  }

  // if (fs.statSync(app_path + ['', 'src', 'background.js'].join(sep)).isFile()) {
  //   entries['background'] = app_path + ['', 'src', 'background.js'].join(sep)
  // }
  // const backgroundPath = `${app_path}${sep}${['src', 'background', 'index.js'].join(sep)}`
  const backgroundPath = path.join(app_path, 'src', 'background', 'index.js')
  // E:\study\crx-xiaohongshu\src\background\index.js
  if (fs.statSync(backgroundPath).isFile()) {
    entries['background'] = backgroundPath
  }

  if (fs.statSync(app_path + ['', 'src', 'devtools.js'].join(sep)).isFile()) {
    entries['devtools'] = app_path + ['', 'src', 'devtools.js'].join(sep)
  }

  // const injectPath = `${app_path}${sep}${['src', 'inject.js'].join(sep)}`
  const injectPath = path.resolve(app_path, 'src', 'inject.js')
  if (fs.statSync(injectPath).isFile()) {
    entries['inject'] = injectPath
  }

  return entries
}

// 这里要做一些特殊处理才能进行打包. 对对应的sidebar, panel来进行打包. 主要是要注入代码才可以.
function genHtmlPlugins() {
  const entires = findEntry()
  const plugins = []
  const template = path.dirname(__dirname) + '/public/extension.html'
  const modules = Object.keys(entires)

  // 这里有问题. 需要重新改动一下就可以了.
  for (var index in modules) {
    const module_name = modules[index]
    const name = module_name.split('/').pop()

    if (['content', 'background', 'inject', 'contentHtml'].indexOf(module_name) > -1) {
      continue
    }
    // 打包对应的模块到指定的目录.其余就不打包了.

    const filename = module_name + '.html'

    plugins.push(new HtmlWebpackPlugin({
      // publicPath: './devtools',
      title: name,
      template: template,
      name: name,
      filename: filename,
      chunks: [module_name],
      inject: 'body',
      minify: {
        removeComments: true // 自动删除注释
      }
    }))
  }

  return plugins
}

module.exports = {
  findEntry: findEntry,
  genHtmlPlugins: genHtmlPlugins
}

const sep = path.sep
const app_path = path.dirname(__dirname)
const entry_path = [app_path, 'src', 'entry'].join(sep)
console.log(findEntry(), path.dirname(__dirname), ['', 'src', 'inject.js'].join(sep))
