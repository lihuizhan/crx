<template>
  <div class="options-app">
    <el-form :model="form" label-width="200px">
      <el-form-item label="Activity name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="formData.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="formData.date1" value-format="x" type="date" placeholder="Pick a date" style="width: 100%" />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker v-model="formData.date2" value-format="x" placeholder="Pick a time" style="width: 100%" />
        </el-col>
      </el-form-item>
      <el-form-item label="批量打开tab页面-任务">
        <el-switch v-model="formData.openTab" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <el-form-item label="下载任务">
        <el-switch v-model="formData.download" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="formData.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="批量打开tab页面数">
        <el-radio-group v-model="formData.batchTab">
          <el-radio v-for="i in batchOpenTabList" :key="i" :label="i">{{ i }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="formData.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getOptionsConfig } from '$/utils/config'
import { OPTIONS_CONFIG_KEY } from '$/globalConfig'

const batchOpenTabList = Array.from({ length: 10 }).map((_, i) => i + 1)
const formData = ref({
  name: '',
  region: '',
  date1: '',
  date2: '',
  // 是否启用批打开tab页面
  openTab: true,
  batchTab: 5,
  download: true,
  type: [],
  desc: ''
})

onMounted(async() => {
  const config = await getOptionsConfig()
  if (config) {
    formData.value = { ...config }
  }
})

const onSubmit = async() => {
  console.log('submit!', formData.value)
  await chrome.storage.local.set({ [OPTIONS_CONFIG_KEY]: formData.value })
}
</script>
<style scoped lang="less">
.options-app {
  background-color: #fff;

  .text-center {
    text-align: center;
  }
}
</style>
