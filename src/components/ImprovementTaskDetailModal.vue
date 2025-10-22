<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white mb-10">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">整改任务详情</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 详情内容 -->
      <div v-if="taskData" class="mt-4 space-y-4">
        
        <!-- 基本信息 -->
        <div class="bg-blue-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-blue-900 mb-3">基本信息</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">任务名称：</span>
              <span class="text-blue-800">{{ taskData.taskName }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">建议类型：</span>
              <span class="text-blue-800">{{ getSuggestionTypeName(taskData.suggestionType) }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">发起人：</span>
              <span class="text-blue-800">{{ taskData.initiatorName || '-' }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">发起单位：</span>
              <span class="text-blue-800">{{ taskData.initiatorDepartment || '-' }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">接收人：</span>
              <span class="text-blue-800">{{ taskData.receiverName }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">整改期限：</span>
              <span class="text-blue-800">{{ taskData.deadlineDays }}天</span>
            </div>
            <div class="flex col-span-2">
              <span class="font-medium text-blue-900 w-32">截止日期：</span>
              <span class="text-blue-800">{{ formatDateTime(taskData.deadlineDate) }}</span>
            </div>
            <div class="flex col-span-2">
              <span class="font-medium text-blue-900 w-32">状态：</span>
              <span :class="getStatusClass(taskData.status)">{{ getStatusText(taskData.status) }}</span>
            </div>
          </div>
        </div>

        <!-- 建议描述 -->
        <div v-if="taskData.suggestionDescription" class="bg-green-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-green-900 mb-2">建议描述</h4>
          <p class="text-sm text-green-800 whitespace-pre-wrap">{{ taskData.suggestionDescription }}</p>
        </div>

        <!-- 附件列表 -->
        <div v-if="taskData.attachments && taskData.attachments.length > 0" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-3">
            附件列表 ({{ taskData.attachments.length }}份)
          </h4>
          <div class="space-y-2">
            <div
              v-for="(file, index) in taskData.attachments"
              :key="index"
              class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded"
            >
              <div class="flex items-center space-x-3">
                <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ file.fileName }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(file.fileSize) }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <a
                  :href="getFileUrl(file.fileUrl, false)"
                  target="_blank"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  查看
                </a>
                <a
                  :href="getFileUrl(file.fileUrl, true)"
                  :download="file.fileName"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                >
                  下载
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 审核信息 -->
        <div v-if="taskData.reviewerName" class="bg-yellow-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-yellow-900 mb-3">审核信息</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex">
              <span class="font-medium text-yellow-900 w-24">审核人：</span>
              <span class="text-yellow-800">{{ taskData.reviewerName }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-yellow-900 w-24">审核时间：</span>
              <span class="text-yellow-800">{{ formatDateTime(taskData.reviewTime) }}</span>
            </div>
            <div class="flex col-span-2">
              <span class="font-medium text-yellow-900 w-24">审核意见：</span>
              <span class="text-yellow-800">{{ taskData.reviewComment || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- 整改报告 -->
        <div v-if="taskData.improvementReports && taskData.improvementReports.length > 0" class="bg-purple-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-purple-900 mb-3">
            整改报告 ({{ taskData.improvementReports.length }}份)
          </h4>
          <div class="space-y-2">
            <div
              v-for="(report, index) in taskData.improvementReports"
              :key="index"
              class="flex items-center justify-between p-3 bg-white border border-purple-200 rounded"
            >
              <div class="flex items-center space-x-3">
                <svg class="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div>
                  <p class="text-sm font-medium text-purple-900">{{ report.fileName }}</p>
                  <p class="text-xs text-purple-700">
                    {{ formatFileSize(report.fileSize) }} • {{ report.uploadTime }}
                    <span v-if="report.uploaderName"> • 上传人：{{ report.uploaderName }}</span>
                  </p>
                </div>
              </div>
              <div class="flex space-x-2">
                <a
                  :href="getFileUrl(report.fileUrl, false)"
                  target="_blank"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  查看
                </a>
                <a
                  :href="getFileUrl(report.fileUrl, true)"
                  :download="report.fileName"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                >
                  下载
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 完成信息 -->
        <div v-if="taskData.status === 'COMPLETED'" class="bg-green-50 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium text-green-900">
              整改已完成 • {{ formatDateTime(taskData.completionTime) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-end mt-6 pt-4 border-t">
        <button type="button" @click="closeModal" class="btn btn-secondary">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  taskData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// 格式化时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '-'
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 获取建议类型名称
const getSuggestionTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'EQUIPMENT': '设备改进',
    'PROCESS': '流程改进',
    'TRAINING': '培训改进',
    'ORGANIZATION': '组织改进',
    'SAFETY': '安全改进',
    'TECHNOLOGY': '技术改进',
    'OTHER': '其他改进'
  }
  return typeMap[type] || type
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING_REVIEW': '待审核',
    'APPROVED': '审核通过',
    'REJECTED': '已驳回',
    'COMPLETED': '已完成',
    'IMPORTED': '已导入'
  }
  return statusMap[status] || status
}

// 获取状态样式
const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'PENDING_REVIEW': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    'APPROVED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    'REJECTED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
    'COMPLETED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    'IMPORTED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'
  }
  return classMap[status] || 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 获取文件URL
const getFileUrl = (fileUrl: string, download: boolean = false) => {
  if (!fileUrl) return '#'
  const filePath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl
  return `/api/files/download?path=${encodeURIComponent(filePath)}&download=${download}`
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>




