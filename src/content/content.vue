<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  BACKGROUND_TO_CONTENT__MESSAGE
} from '$/globalConfig'
import MainDialog from './components/mainDialog/mainDialog.vue'

// 对话框显示状态
const isShowMainDialog = ref(false)

const centerDialogVisible = ref(false)
const messageText = ref('')
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const { cmd, message, type } = request
  console.log({ ...request })
  if (cmd === BACKGROUND_TO_CONTENT__MESSAGE) {
    messageText.value = message || ''
    centerDialogVisible.value = true
    // TODO
    ElMessage({
      message: message || '',
      type: type || 'warning'
    })
  }
  sendResponse({ message: '我是content，已收到你的消息：', request })
  return true
})

</script>

<template>
  <div class="CRX-content">
    <div class="content-entry" @click="isShowMainDialog = true"></div>
    <MainDialog :visible="isShowMainDialog" @onClose="() => { isShowMainDialog = false }" />
    <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
      <span>{{ messageText }}</span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.CRX-content {
  background-color: #fff;
  .content-entry {
    position: fixed;
    z-index: 9999;
    bottom: 100px;
    right: 20px;
    width: 50px;
    height: 50px;
    // background: url('../../public/assets/images/content-icon.png');
    // background-size: 100% 100%;
    background-color: #0acde7;
    cursor: pointer;
  }
}
</style>
