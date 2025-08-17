export async function getNoteDetail(options = {}) {
  console.log('getNoteDetail', options, typeof window, globalThis)
  console.log('getNoteDetail', window?.__INITIAL_STATE__)
  // const noteDetailMap = { ...window?.__INITIAL_STATE__?.note?.noteDetailMap }
  // const [{ note }] = Object.values(noteDetailMap)
  function extractGlobal(variableName) {
    const array = new Uint32Array(5)
    const handShake = window.crypto.getRandomValues(array).toString()

    function propagateVariable(handShake, variableName) {
      const message = { handShake }
      message[variableName] = window[variableName]
      window.postMessage(message, '*')
    }

    (function injectPropagator() {
      const script = `( ${propagateVariable.toString()} )('${handShake}', '${variableName}');`
      const scriptTag = document.createElement('script')
      const scriptBody = document.createTextNode(script)

      scriptTag.id = 'chromeExtensionDataPropagator'
      scriptTag.appendChild(scriptBody)
      document.body.append(scriptTag)
    })()

    return new Promise(resolve => {
      window.addEventListener('message', function({ data }) {
        // We only accept messages from ourselves
        if (data.handShake !== handShake) return
        resolve(data)
      }, false)
    })
  }

  // const note = await extractGlobal('__INITIAL_STATE__').then(data => {
  //   const noteDetailMap = { ...data?.note?.noteDetailMap }
  //   const [{ note }] = Object.values(noteDetailMap || {})
  //   return note || {}
  // })
  // return note
  const key = location.pathname
  const str = window.localStorage.getItem(key)
  return str ? JSON.parse(str) : null
}

export async function outputJSON(...args) {
  const method = 'writeFile'
  const result = await fetch(`http://localhost:8080/fsPromises/${method}`, {
    method: 'post',
    // https://nodejs.org/docs/latest/api/fs.html#fspromiseswritefilefile-data-options
    // file, data, options
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
    })

  return result
}

// Downloads Location
export const DOWNLOADSLOCATION = 'downloadsLocation'
export const DIR = `D:\\md\\xiaohongshu_data`
export async function pathExists(list = [], options = {}) {
  let { dir } = options
  if (!dir) {
    dir = DIR
  }

  list.forEach(item => {
    Reflect.set(item, DOWNLOADSLOCATION, dir)
  })

  const { result } = await fetch('http://localhost:8080/pathExists', {
    method: 'post',
    body: JSON.stringify(list),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
      if (error instanceof TypeError) {
        console.log(error.message)
      }
      // notice({ message: 'pathExists服务未启用' })
      console.log('pathExists服务未启用：', error)
      return { result: [] }
    })

  if (!Array.isArray(result)) {
    return []
  }

  // chrome.downloads.download 接收自定义字段会报错
  result.forEach(item => {
    Reflect.deleteProperty(item, DOWNLOADSLOCATION)
  })

  return result
}

export async function exists(...args) {
  // fs.constants.R_OK 4
  const method = 'access'
  const result = await fetch(`http://localhost:8080/fsPromises/${method}`, {
    method: 'post',
    // https://nodejs.org/docs/latest/api/fs.html#fspromiseswritefilefile-data-options
    // file, data, options
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
    })

  return result
}

// const contents = await readFile(filePath, { encoding: 'utf8' })
export async function readFile(...args) {
  const method = 'readFile'
  const result = await fetch(`http://localhost:8080/fsPromises/${method}`, {
    method: 'post',
    // https://nodejs.org/docs/latest/api/fs.html#fspromiseswritefilefile-data-options
    // file, data, options
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
    })

  // {
  //   msg: "success",
  //   result: "{}"
  // }
  return result?.result
}

// Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' http://localhost:* http://127.0.0.1:* chrome-extension://4eb87b5c-de04-4061-8be5-f6bec71efcc7/". Either the 'unsafe-inline' keyword, a hash ('sha256-FlBZkntNjKfY8P2Xm02uTdxePPV4+52afpXQzfNdFMo='), or a nonce ('nonce-...') is required to enable inline execution.
export function extractGlobal(variableName) {
  const array = new Uint32Array(5)
  const handShake = window.crypto.getRandomValues(array).toString()

  function propagateVariable(handShake, variableName) {
    const message = { handShake }
    message[variableName] = window[variableName]
    window.postMessage(message, '*')
  }

  (function injectPropagator() {
    const script = `( ${propagateVariable.toString()} )('${handShake}', '${variableName}');`
    const scriptTag = document.createElement('script')
    const scriptBody = document.createTextNode(script)

    scriptTag.id = 'chromeExtensionDataPropagator'
    scriptTag.appendChild(scriptBody)
    document.body.append(scriptTag)
  })()

  return new Promise(resolve => {
    window.addEventListener('message', function({ data }) {
      // We only accept messages from ourselves
      if (data.handShake !== handShake) return
      resolve(data)
    }, false)
  })
}
