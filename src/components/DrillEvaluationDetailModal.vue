<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">演练评估详情</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 演练基本信息 -->
      <div class="mt-4 bg-blue-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-900 mb-3">演练基本信息</h4>
        <div class="grid grid-cols-2 gap-4 text-sm text-blue-800">
          <div><span class="font-medium">演练科目：</span>{{ evaluationData?.drillSubject }}</div>
          <div><span class="font-medium">演练类型：</span>{{ getDrillTypeName(evaluationData?.drillType) }}</div>
          <div><span class="font-medium">演练时间：</span>{{ formatDateTime(evaluationData?.drillTime) }}</div>
          <div><span class="font-medium">关联预案：</span>{{ evaluationData?.relatedPlanName || '-' }}</div>
          <div class="col-span-2">
            <span class="font-medium">参演部门：</span>
            {{ evaluationData?.participatingDepartments?.join('、') || '-' }}
          </div>
        </div>
      </div>

      <!-- 评估信息 -->
      <div v-if="evaluationData?.hasReports" class="mt-4 bg-green-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-green-900 mb-3">评估信息</h4>
        <div class="grid grid-cols-2 gap-4 text-sm text-green-800">
          <div><span class="font-medium">评估人：</span>{{ evaluationData?.evaluatorName || '-' }}</div>
          <div><span class="font-medium">评估时间：</span>{{ formatDateTime(evaluationData?.evaluationTime) }}</div>
        </div>
      </div>

      <!-- 评估报告附件列表 -->
      <div class="mt-6">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-base font-medium text-gray-900">评估报告附件</h4>
          <span v-if="evaluationReports.length > 0" class="text-sm text-gray-500">
            共 {{ evaluationReports.length }} 份报告
          </span>
        </div>

        <!-- 无附件提示 -->
        <div v-if="evaluationReports.length === 0" class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="mt-2">暂无评估报告附件</p>
          <p class="text-xs mt-1">请点击"上传评估总结"按钮上传评估报告</p>
        </div>

        <!-- 附件列表 -->
        <div v-else class="space-y-3">
          <div
            v-for="(report, index) in evaluationReports"
            :key="index"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex items-center space-x-3 flex-1">
              <!-- 文件图标 -->
              <div class="flex-shrink-0">
                <svg class="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              
              <!-- 文件信息 -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ report.fileName }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  <span>{{ formatFileSize(report.fileSize) }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ report.uploadTime }}</span>
                  <span v-if="report.fileType" class="mx-2">•</span>
                  <span v-if="report.fileType" class="uppercase">{{ report.fileType }}</span>
                </p>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center space-x-2">
              <a
                :href="getFileUrl(report.fileUrl, false)"
                target="_blank"
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                查看
              </a>
              <a
                :href="getFileUrl(report.fileUrl, true)"
                :download="report.fileName"
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
              >
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                下载
              </a>
              <button
                @click="confirmDeleteReport(report)"
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
              >
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 备注信息 -->
      <div v-if="evaluationData?.remarks" class="mt-4 bg-yellow-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-yellow-900 mb-2">备注</h4>
        <p class="text-sm text-yellow-800 whitespace-pre-wrap">{{ evaluationData.remarks }}</p>
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-end space-x-4 mt-6 pt-4 border-t">
        <button
          type="button"
          @click="closeModal"
          class="btn btn-secondary"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'

const props = defineProps<{
  visible: boolean
  evaluationData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'refresh'): void
}>()

// 评估报告列表
const evaluationReports = computed(() => {
  return props.evaluationData?.evaluationReports || []
})

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

// 获取演练类型名称
const getDrillTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'FIRE_DRILL': '消防演练',
    'EARTHQUAKE_DRILL': '地震演练',
    'FLOOD_DRILL': '防洪演练',
    'MEDICAL_DRILL': '医疗救援演练',
    'EVACUATION_DRILL': '疏散演练',
    'NUCLEAR_DRILL': '核事故演练',
    'CHEMICAL_DRILL': '化学事故演练',
    'TRAFFIC_DRILL': '交通事故演练',
    'POWER_DRILL': '电力事故演练',
    'FOOD_DRILL': '食品安全演练'
  }
  return typeMap[type] || type
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 获取文件访问URL
const getFileUrl = (fileUrl: string, download: boolean = false) => {
  if (!fileUrl) return '#'
  // 使用文件下载API
  // 移除开头的 / 如果有的话
  const filePath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl
  return `/api/files/download?path=${encodeURIComponent(filePath)}&download=${download}`
}

// 确认删除报告
const confirmDeleteReport = async (report: any) => {
  if (!confirm(`确定要删除附件"${report.fileName}"吗？`)) {
    return
  }

  try {
    // 删除附件
    const response = await request.delete(`/drill-evaluations/${props.evaluationData.id}/reports/${encodeURIComponent(report.fileName)}`)
    showMessage('删除成功！', 'success')
    
    // 更新当前评估数据
    if (response.data) {
      // 更新props.evaluationData中的评估报告列表
      if (props.evaluationData) {
        props.evaluationData.evaluationReports = response.data.evaluationReports || []
        props.evaluationData.hasReports = response.data.hasReports || false
      }
    }
    
    // 通知父组件刷新列表
    emit('refresh')
  } catch (error: any) {
    console.error('删除失败:', error)
    showMessage(error.message || '删除失败！', 'error')
  }
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

