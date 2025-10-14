<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="handleBackdropClick"
  >
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">批量导入演练申请</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- 导入说明 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">导入说明</h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>请使用提供的Excel模板进行数据导入</li>
                  <li>必填字段：演练科目、演练类型、参演部门、组织部门、关联预案、计划时间、说明</li>
                  <li>演练科目可选：火灾、地震、洪水、化学品泄漏、网络安全</li>
                  <li>演练类型可选：桌面演练、实战演练、综合演练</li>
                  <li>说明字段不能超过500字</li>
                  <li>单次最多导入1000条记录</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 模板下载 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">下载模板</h4>
          <p class="text-sm text-gray-600 mb-3">请先下载Excel模板，按照模板格式填写数据后再上传</p>
          <button
            @click="downloadTemplate"
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            下载Excel模板
          </button>
        </div>

        <!-- 文件上传 -->
        <div>
          <label class="label">选择Excel文件</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="mt-4">
                <label for="excel-upload" class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900">
                    点击上传Excel文件
                  </span>
                  <input
                    id="excel-upload"
                    ref="fileInput"
                    type="file"
                    class="sr-only"
                    @change="handleFileUpload"
                    accept=".xlsx,.xls"
                  />
                </label>
                <p class="mt-1 text-xs text-gray-500">
                  支持 XLSX, XLS 格式，文件大小不超过10MB
                </p>
              </div>
            </div>
          </div>

          <!-- 已选择文件 -->
          <div v-if="selectedFile" class="mt-4">
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm text-gray-900">{{ selectedFile.name }}</span>
                <span class="text-xs text-gray-500 ml-2">({{ formatFileSize(selectedFile.size) }})</span>
              </div>
              <button
                @click="removeFile"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 导入进度 -->
        <div v-if="importing" class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="loading-spinner mr-3"></div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">正在导入数据...</p>
              <p class="text-xs text-gray-500 mt-1">请稍候，不要关闭窗口</p>
            </div>
          </div>
        </div>

        <!-- 导入结果 -->
        <div v-if="importResult" class="rounded-lg p-4" :class="importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg v-if="importResult.success" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium" :class="importResult.success ? 'text-green-800' : 'text-red-800'">
                {{ importResult.success ? '导入成功' : '导入失败' }}
              </h3>
              <div class="mt-2 text-sm" :class="importResult.success ? 'text-green-700' : 'text-red-700'">
                <p>{{ importResult.message }}</p>
                <div v-if="importResult.details" class="mt-2">
                  <p>成功导入：{{ importResult.details.successCount }} 条</p>
                  <p v-if="importResult.details.failCount > 0">失败：{{ importResult.details.failCount }} 条</p>
                  <div v-if="importResult.details.errors && importResult.details.errors.length > 0" class="mt-2">
                    <p class="font-medium">错误详情：</p>
                    <ul class="list-disc list-inside mt-1">
                      <li v-for="error in importResult.details.errors.slice(0, 5)" :key="error">
                        {{ error }}
                      </li>
                      <li v-if="importResult.details.errors.length > 5">
                        ... 还有 {{ importResult.details.errors.length - 5 }} 个错误
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 按钮区域 -->
      <div class="flex justify-end space-x-4 pt-6 border-t mt-6">
        <button
          @click="$emit('close')"
          class="btn btn-secondary"
        >
          关闭
        </button>
        <button
          @click="handleImport"
          :disabled="!selectedFile || importing"
          class="btn btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedFile || importing }"
        >
          <span v-if="importing" class="loading-spinner mr-2"></span>
          {{ importing ? '导入中...' : '开始导入' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrillApplicationStore } from '@/stores/drillApplication'
import { showMessage } from '@/utils/message'

interface Props {
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const drillApplicationStore = useDrillApplicationStore()

// 响应式数据
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const importing = ref(false)
const importResult = ref<any>(null)

// 方法
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 检查文件类型
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    showMessage('请选择Excel文件（.xlsx或.xls格式）', 'error')
    return
  }
  
  // 检查文件大小（限制10MB）
  if (file.size > 10 * 1024 * 1024) {
    showMessage('文件大小不能超过10MB', 'error')
    return
  }
  
  selectedFile.value = file
  importResult.value = null
}

const removeFile = () => {
  selectedFile.value = null
  importResult.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadTemplate = async () => {
  try {
    const response = await fetch('/api/drill-applications/template', {
      method: 'GET'
    })
    
    if (!response.ok) {
      throw new Error('下载模板失败')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '演练申请导入模板.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showMessage('模板下载成功', 'success')
  } catch (error) {
    console.error('下载模板失败:', error)
    showMessage('下载模板失败', 'error')
  }
}

const handleImport = async () => {
  if (!selectedFile.value) {
    showMessage('请先选择要导入的Excel文件', 'error')
    return
  }
  
  importing.value = true
  importResult.value = null
  
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    await drillApplicationStore.importApplications(formData)
    
    // 显示蓝色气泡提示
    showMessage('导入成功！', 'success')
    
    importResult.value = {
      success: true,
      message: '数据导入成功，列表已刷新'
    }
    
    // 3秒后关闭弹窗并刷新列表
    setTimeout(() => {
      emit('success')
    }, 3000)
  } catch (error: any) {
    console.error('导入失败:', error)
    
    // 显示红色气泡提示
    showMessage('导入失败！', 'error')
    
    importResult.value = {
      success: false,
      message: error.message || '上传文件样式错误或文件无数据'
    }
  } finally {
    importing.value = false
  }
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>
