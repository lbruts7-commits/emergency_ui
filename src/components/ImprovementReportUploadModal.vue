<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">上传整改报告</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 任务信息 -->
      <div v-if="taskData" class="mt-4 bg-blue-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-900 mb-2">整改任务信息</h4>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex">
            <span class="font-medium text-blue-900 w-24">任务名称：</span>
            <span class="text-blue-800">{{ taskData.taskName }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-blue-900 w-24">任务接收人：</span>
            <span class="text-blue-800">{{ taskData.receiverName }}</span>
          </div>
        </div>
      </div>

      <!-- 文件上传 -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          选择整改报告文件
          <span class="text-red-500">*</span>
        </label>
        
        <!-- 上传区域 -->
        <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
          <div class="space-y-1 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="flex text-sm text-gray-600">
              <label
                for="report-upload"
                class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
              >
                <span>选择文件</span>
                <input
                  id="report-upload"
                  name="report-upload"
                  type="file"
                  class="sr-only"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  @change="handleFileChange"
                />
              </label>
              <p class="pl-1">或拖拽文件到此处</p>
            </div>
            <p class="text-xs text-gray-500">
              支持 PDF、Word、Excel、PPT 等格式，文件大小不超过10MB
            </p>
          </div>
        </div>

        <!-- 已选择的文件 -->
        <div v-if="selectedFile" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="text-sm font-medium text-green-900">{{ selectedFile.name }}</p>
                <p class="text-xs text-green-700 mt-1">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button
              @click="clearFile"
              class="text-green-600 hover:text-green-800"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 上传人信息 -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          上传人姓名
        </label>
        <input
          v-model="uploaderName"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入上传人姓名"
        />
      </div>

      <!-- 提示信息 -->
      <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3 text-sm text-yellow-700">
            <p class="font-medium">上传说明</p>
            <ul class="mt-1 list-disc list-inside space-y-1">
              <li>请上传整改完成后的报告文件</li>
              <li>上传成功后任务状态将变为"已完成"</li>
              <li>支持上传多份报告（可重复上传）</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-end space-x-4 mt-6 pt-4 border-t">
        <button
          type="button"
          @click="closeModal"
          class="btn btn-secondary"
          :disabled="isUploading"
        >
          取消
        </button>
        <button
          type="button"
          @click="handleUpload"
          :disabled="!selectedFile || isUploading"
          class="btn btn-primary"
        >
          {{ isUploading ? '上传中...' : '提交' }}
        </button>
      </div>

      <!-- 上传进度 -->
      <div v-if="isUploading" class="mt-4">
        <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>上传中...</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'

const props = defineProps<{
  visible: boolean
  taskData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

// 表单数据
const selectedFile = ref<File | null>(null)
const uploaderName = ref('系统管理员')
const isUploading = ref(false)
const uploadProgress = ref(0)

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      showMessage('文件大小不能超过10MB', 'error')
      return
    }
    
    selectedFile.value = file
  }
}

// 清除文件
const clearFile = () => {
  selectedFile.value = null
  const fileInput = document.getElementById('report-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 上传文件
const handleUpload = async () => {
  if (!selectedFile.value) {
    showMessage('请选择要上传的文件', 'error')
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  try {
    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    // 创建 FormData
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('uploaderName', uploaderName.value)

    // 发送上传请求
    const response = await request.post(
      `/improvement-tasks/${props.taskData.id}/reports`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    clearInterval(progressInterval)
    uploadProgress.value = 100

    showMessage('提交成功！', 'success')
    
    // 延迟关闭，让用户看到成功提示
    setTimeout(() => {
      emit('success')
      resetForm()
    }, 1500)

  } catch (error: any) {
    console.error('上传失败:', error)
    showMessage(error.message || '提交失败！', 'error')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// 重置表单
const resetForm = () => {
  selectedFile.value = null
  uploaderName.value = '系统管理员'
  uploadProgress.value = 0
  const fileInput = document.getElementById('report-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

// 关闭弹窗
const closeModal = () => {
  if (!isUploading.value) {
    emit('close')
  }
}
</script>

<style scoped>
.label {
  @apply block text-sm font-medium text-gray-700;
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
}

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50;
}
</style>




