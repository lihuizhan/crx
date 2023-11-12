<template>
  <div id="DetailPages">
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="标题" width="300" show-overflow-tooltip>
        <template #default="{ row }">{{ row.title }}</template>
      </el-table-column>
      <el-table-column property="desc" label="描述" show-overflow-tooltip />
      <!-- <el-table-column property="nodeCount" label="笔记总数" show-overflow-tooltip /> -->
      <el-table-column property="imageList" label="Image" width="100">
        <template #default="{ row }">{{ row.imageList && row.imageList.length }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tableData = ref([])
const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

onMounted(() => {
  init()
})

async function init() {
  const { userId } = route.query
  const key = `https://www.xiaohongshu.com/user/profile/${userId}`
  const storage = await chrome.storage.local.get(key)
  const noteList = storage[key]
  console.log(noteList, route, storage)
  if (!Array.isArray(noteList)) {
    return
  }
  for (let index = 0; index < noteList.length; index++) {
    const note = noteList[index]
    const { noteCard } = note
    const key = `https://www.xiaohongshu.com/explore/${noteCard.noteId}`
    const card = await chrome.storage.local.get(key)
    if (card[key]) {
      tableData.value.push(card[key])
    }
  }
}
</script>
