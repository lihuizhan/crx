<script setup>
import { ref } from 'vue'
import MainDialog from './components/mainDialog/mainDialog.vue'

// 对话框显示状态
const isShowMainDialog = ref(false)

</script>

<template>
  <div class="CRX-content">
    <div class="content-entry" @click="isShowMainDialog = true"></div>
    <MainDialog :visible="isShowMainDialog" @onClose="() => { isShowMainDialog = false }" />
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
