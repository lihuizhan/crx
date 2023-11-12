<template>
  <div id="list-home">
    <div class="btns">
      <el-button @click="clearSelection()">清除选择</el-button>
      <el-button @click="toggleSelection()">反选</el-button>
      <el-button @click="download">下载</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" width="160">
        <template #default="{ row }">
          <div class="links" @click="handleNodeslist(row)">{{ row.user.nickname }}</div>
        </template>
      </el-table-column>
      <el-table-column property="nodeCount" label="笔记总数" show-overflow-tooltip />
    </el-table>
  </div>
</template>
<script>
import { ref, toValue } from 'vue'
import { sleep, safeFileName } from './utils.js'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'ListHome',
  setup(props, { attrs, slots, emit, expose }) {
    const route = useRoute()
    const router = useRouter()
    console.log({ route, router })
    const tableData = ref([])
    const multipleTableRef = ref(null)
    const multipleSelection = ref([])
    const toggleSelection = () => {
      const selectionRows = multipleTableRef.value.getSelectionRows()
      const ids = selectionRows.map(({ id }) => id)

      const unSelectRows = tableData.value.filter(row => !ids.includes(row.id))

      unSelectRows.forEach((row) => {
        multipleTableRef.value.toggleRowSelection(row, true)
      })

      selectionRows.forEach((row) => {
        multipleTableRef.value.toggleRowSelection(row, false)
      })
    }
    const clearSelection = () => {
      multipleTableRef.value.clearSelection()
    }
    const handleSelectionChange = (val) => {
      multipleSelection.value = val
    }
    const gallery = new Map()

    async function getList() {
      const storage = await chrome.storage.local.get(null)
      const keys = Object.keys(storage)
      const userKeys = keys.filter(key => key.includes('user/profile'))
      const list = userKeys
        .map(key => {
          return storage[key]
        })
        .filter(item => Array.isArray(item) && item.length)
        .forEach(item => {
          const { noteCard } = item[0]
          tableData.value.push({ ...noteCard, nodeCount: item.length })
        })

      setData(list)
    }
    getList()

    function setData(data = []) {
      data.forEach(item => {
        const { id } = item
        if (!gallery.has(id)) {
          gallery.set(id, item)
          // tableData.value.push(item)
        }
      })
    }

    async function download() {
      const selection = multipleTableRef.value.getSelectionRows()
      console.log({ selection }, multipleSelection.value, toValue(multipleSelection.value))
      downloadJSONFile(toValue(multipleSelection.value))
      downloadImageBatch(toValue(multipleSelection.value))
    }

    function downloadJSONFile(result = []) {
      const text = JSON.stringify(result, null, 2)
      const blob = new Blob([text], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const { name } = toValue(result[0]) || {}
      const filename = `${name}/${name}_${Date.now()}.json`
      return chrome.downloads.download({ url, filename }).then(downloadId => {
        return { downloadId }
      })
    }

    async function downloadImageBatch(list = []) {
      console.log({ list }, list.length)
      if (!Array.isArray(list)) {
        console.log('fail: ', list)
        return
      }

      while (list.length) {
        const item = list.pop()
        const { name, tweetText, datetime, images } = toValue(item) || {}
        const tasks = images.map((image, i) => {
          const { id, url } = image
          // 有换行符无法下载
          const title = (tweetText || '').replace(/\n/g, '-')

          const filename = `${name}/${datetime}_${safeFileName(title || id)}-${i + 1}.jpg`
          return chrome.downloads.download({ url, filename }).then(downloadId => {
            return { downloadId }
          })
        })
        await Promise.allSettled(tasks)
        await sleep(2000)
      }
      console.log('end')
    }

    function handleNodeslist(row) {
      const { user } = row
      const { userId } = user
      router.push({ path: '/DetailPages', query: { userId }})
    }

    return {
      tableData,
      multipleTableRef,
      multipleSelection,
      toggleSelection,
      clearSelection,
      handleSelectionChange,
      download,
      handleNodeslist
    }
  }
}
</script>

<style lang="scss">
#list-home {
  padding: 10px 20px;
  .btns {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .links {
    color: aqua;
  }
}
</style>
