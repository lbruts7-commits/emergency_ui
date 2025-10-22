<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">导入评估改进</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 导入说明 -->
      <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3 text-sm text-blue-700">
            <p class="font-medium">导入说明</p>
            <ul class="mt-2 list-disc list-inside space-y-1">
              <li>请先下载导入模板，按照模板格式填写数据</li>
              <li>导入的数据状态为"已导入"，无需审核</li>
              <li>支持Excel（.xlsx, .xls）和CSV格式</li>
              <li>导入前会进行数据校验（必填项、数据类型、唯一性）</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 下载模板 -->
      <div class="mt-6">
        <button
          @click="downloadTemplate"
          class="w-full inline-flex justify-center items-center px-4 py-3 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          下载导入模板
        </button>
        <p class="text-xs text-gray-500 mt-2 text-center">模板包含示例数据，请参照填写</p>
      </div>

      <!-- 文件上传 -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          选择文件
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
                for="import-file"
                class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
              >
                <span>选择文件</span>
                <input
                  id="import-file"
                  name="import-file"
                  type="file"
                  class="sr-only"
                  accept=".xlsx,.xls,.csv"
                  @change="handleFileChange"
                />
              </label>
              <p class="pl-1">或拖拽文件到此处</p>
            </div>
            <p class="text-xs text-gray-500">
              支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式
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

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 导入结果 -->
      <div v-if="importResult" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3 text-sm text-green-700">
            <p class="font-medium">{{ importResult.message }}</p>
            <p class="mt-1">成功导入：{{ importResult.successCount }} 条</p>
            <p v-if="importResult.failCount > 0" class="mt-1">失败：{{ importResult.failCount }} 条</p>
          </div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-end space-x-4 mt-6 pt-4 border-t">
        <button
          type="button"
          @click="closeModal"
          class="btn btn-secondary"
          :disabled="isImporting"
        >
          {{ importResult ? '关闭' : '取消' }}
        </button>
        <button
          v-if="!importResult"
          type="button"
          @click="handleImport"
          :disabled="!selectedFile || isImporting"
          class="btn btn-primary"
        >
          {{ isImporting ? '导入中...' : '确定' }}
        </button>
      </div>

      <!-- 导入进度 -->
      <div v-if="isImporting" class="mt-4">
        <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>正在导入数据...</span>
          <span>{{ importProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: importProgress + '%' }"
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
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

// 表单数据
const selectedFile = ref<File | null>(null)
const isImporting = ref(false)
const importProgress = ref(0)
const errorMessage = ref('')
const importResult = ref<any>(null)

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 验证文件格式
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileName = file.name.toLowerCase()
    const isValid = validExtensions.some(ext => fileName.endsWith(ext))
    
    if (!isValid) {
      errorMessage.value = '上传文件样式错误，请上传Excel或CSV文件'
      return
    }
    
    // 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      errorMessage.value = '文件大小不能超过5MB'
      return
    }
    
    selectedFile.value = file
    errorMessage.value = ''
  }
}

// 清除文件
const clearFile = () => {
  selectedFile.value = null
  errorMessage.value = ''
  importResult.value = null
  const fileInput = document.getElementById('import-file') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// 下载模板
const downloadTemplate = () => {
  // 创建CSV模板内容
  const templateContent = `整改任务名称,建议类型,建议发起人,建议发起单位,任务接收人,整改期限(天),建议描述
消防设备升级,EQUIPMENT,张三,应急管理部,李四,30,消防设备老化需要更新
应急流程优化,PROCESS,王五,安全保卫部,赵六,15,疏散流程需要优化
人员培训加强,TRAINING,李经理,应急管理部,孙七,10,加强应急培训`

  // 创建Blob对象
  const blob = new Blob(["\ufeff" + templateContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = url
  link.download = '整改任务导入模板.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  showMessage('模板下载成功！', 'success')
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 导入文件
const handleImport = async () => {
  if (!selectedFile.value) {
    errorMessage.value = '请选择要导入的文件'
    return
  }

  isImporting.value = true
  importProgress.value = 0
  errorMessage.value = ''
  importResult.value = null

  try {
    // 模拟进度
    const progressInterval = setInterval(() => {
      if (importProgress.value < 90) {
        importProgress.value += 10
      }
    }, 200)

    // 创建 FormData
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // 发送导入请求
    const response = await request.post('/improvement-tasks/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    clearInterval(progressInterval)
    importProgress.value = 100

    // 处理导入结果
    if (response.data) {
      importResult.value = response.data
      showMessage('导入成功！', 'success')
      
      // 延迟关闭，让用户看到结果
      setTimeout(() => {
        emit('success')
        resetForm()
      }, 3000)
    }

  } catch (error: any) {
    console.error('导入失败:', error)
    
    // 根据错误类型设置错误信息
    let message = '导入失败！'
    if (error.message) {
      if (error.message.includes('文件无数据')) {
        message = '文件无数据'
      } else if (error.message.includes('样式错误') || error.message.includes('格式')) {
        message = '上传文件样式错误'
      } else {
        message = error.message
      }
    }
    
    errorMessage.value = message
    showMessage(message, 'error')
  } finally {
    isImporting.value = false
    importProgress.value = 0
  }
}

// 重置表单
const resetForm = () => {
  selectedFile.value = null
  errorMessage.value = ''
  importResult.value = null
  importProgress.value = 0
  const fileInput = document.getElementById('import-file') as HTMLInputElement
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
  if (!isImporting.value) {
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




