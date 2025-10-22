<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white mb-10">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <div class="flex items-center">
          <h3 class="text-xl font-bold text-gray-900">演练档案详情</h3>
          <span :class="getArchiveTypeClass(archiveData?.executionMode)" class="ml-3">
            {{ getArchiveTypeName(archiveData?.executionMode) }}
          </span>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 档案内容 -->
      <div class="mt-4 space-y-6">
        
        <!-- 一、演练信息 -->
        <div class="bg-blue-50 rounded-lg p-5">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              一
            </div>
            <h4 class="ml-3 text-lg font-bold text-blue-900">演练信息</h4>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">演练科目：</span>
              <span class="text-blue-800">{{ archiveData?.drillSubject }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">演练类型：</span>
              <span class="text-blue-800">{{ getDrillTypeName(archiveData?.drillType) }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">实施模式：</span>
              <span class="text-blue-800">{{ getExecutionModeName(archiveData?.executionMode) }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-blue-900 w-32">关联预案：</span>
              <span class="text-blue-800">{{ archiveData?.relatedPlanName || '-' }}</span>
            </div>
            <div class="flex col-span-2">
              <span class="font-medium text-blue-900 w-32">演练时间：</span>
              <span class="text-blue-800">
                {{ formatDateTime(drillInfo?.startTime) }} ~ {{ formatDateTime(drillInfo?.endTime) }}
              </span>
            </div>
            <div class="flex col-span-2">
              <span class="font-medium text-blue-900 w-32">参演部门：</span>
              <span class="text-blue-800">{{ archiveData?.participatingDepartments?.join('、') || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- 二、演练过程 -->
        <div class="bg-green-50 rounded-lg p-5">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
              二
            </div>
            <h4 class="ml-3 text-lg font-bold text-green-900">演练过程</h4>
          </div>
          
          <!-- 参演人员 -->
          <div v-if="archiveData?.participants" class="mb-4">
            <h5 class="text-sm font-medium text-green-900 mb-2">参演人员</h5>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="(persons, dept) in archiveData.participants"
                :key="dept"
                class="bg-white rounded p-3 border border-green-200"
              >
                <div class="font-medium text-green-900 text-sm mb-1">{{ dept }}</div>
                <div class="text-green-800 text-xs">
                  {{ Array.isArray(persons) ? persons.join('、') : persons }}
                  <span class="ml-2 text-gray-500">({{ Array.isArray(persons) ? persons.length : 0 }}人)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 演练过程描述 -->
          <div v-if="archiveData?.executionProcess">
            <h5 class="text-sm font-medium text-green-900 mb-2">过程记录</h5>
            <div class="bg-white rounded p-4 border border-green-200">
              <p class="text-sm text-green-800 whitespace-pre-wrap">{{ archiveData.executionProcess }}</p>
            </div>
          </div>

          <!-- 场景信息（仅模拟演练） -->
          <div v-if="archiveData?.executionMode === 'SIMULATION' && archiveData?.scenarioData" class="mt-4">
            <h5 class="text-sm font-medium text-green-900 mb-2">场景配置</h5>
            <div class="bg-white rounded p-4 border border-green-200">
              <pre class="text-xs text-green-800 overflow-auto">{{ JSON.stringify(archiveData.scenarioData, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- 三、演练评估总结 -->
        <div class="bg-yellow-50 rounded-lg p-5">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
              三
            </div>
            <h4 class="ml-3 text-lg font-bold text-yellow-900">演练评估总结</h4>
          </div>

          <div v-if="evaluationSummary" class="space-y-3">
            <!-- 评估人和时间 -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex">
                <span class="font-medium text-yellow-900 w-24">评估人：</span>
                <span class="text-yellow-800">{{ evaluationSummary.evaluatorName || '-' }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-yellow-900 w-24">评估时间：</span>
                <span class="text-yellow-800">{{ formatDateTime(evaluationSummary.evaluationTime) }}</span>
              </div>
            </div>

            <!-- 评估意见 -->
            <div v-if="evaluationSummary.remarks">
              <h5 class="text-sm font-medium text-yellow-900 mb-2">评估意见</h5>
              <div class="bg-white rounded p-4 border border-yellow-200">
                <p class="text-sm text-yellow-800 whitespace-pre-wrap">{{ evaluationSummary.remarks }}</p>
              </div>
            </div>

            <!-- 评估报告附件 -->
            <div v-if="evaluationSummary.evaluationReports && evaluationSummary.evaluationReports.length > 0">
              <h5 class="text-sm font-medium text-yellow-900 mb-2">
                评估报告附件 ({{ evaluationSummary.evaluationReports.length }}份)
              </h5>
              <div class="space-y-2">
                <div
                  v-for="(report, index) in evaluationSummary.evaluationReports"
                  :key="index"
                  class="bg-white rounded p-3 border border-yellow-200 flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-yellow-900">{{ report.fileName }}</p>
                      <p class="text-xs text-yellow-700">
                        {{ formatFileSize(report.fileSize) }} • {{ report.uploadTime }}
                      </p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <a
                      :href="getFileUrl(report.fileUrl, false)"
                      target="_blank"
                      class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      查看
                    </a>
                    <a
                      :href="getFileUrl(report.fileUrl, true)"
                      :download="report.fileName"
                      class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      下载
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 四、对比分析（仅模拟演练） -->
        <div v-if="archiveData?.executionMode === 'SIMULATION'" class="bg-purple-50 rounded-lg p-5">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              四
            </div>
            <h4 class="ml-3 text-lg font-bold text-purple-900">对比分析</h4>
          </div>

          <div v-if="comparisonAnalysis" class="space-y-3">
            <!-- 说明提示 -->
            <div class="bg-white rounded p-4 border border-purple-200">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-purple-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <div class="ml-3 text-sm text-purple-800">
                  <p class="font-medium">对比分析说明</p>
                  <p class="mt-1">{{ comparisonAnalysis.note || '对比演练中的实际操作与标准答案，评估演练效果' }}</p>
                </div>
              </div>
            </div>

            <!-- 对比数据展示 -->
            <div class="bg-white rounded p-4 border border-purple-200">
              <pre class="text-xs text-purple-800 overflow-auto max-h-96">{{ JSON.stringify(comparisonAnalysis, null, 2) }}</pre>
            </div>
          </div>

          <!-- 无对比分析提示 -->
          <div v-else class="text-center py-8 text-purple-600">
            <svg class="mx-auto h-12 w-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="mt-2">暂无对比分析数据</p>
            <p class="text-xs mt-1">对比分析功能需要接入题库系统</p>
          </div>
        </div>

        <!-- 档案生成信息 -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span class="font-medium">档案生成时间：</span>
              <span>{{ formatDateTime(archiveData?.archiveTime) }}</span>
            </div>
            <div v-if="archiveData?.archiverName">
              <span class="font-medium">生成人：</span>
              <span>{{ archiveData.archiverName }}</span>
            </div>
          </div>
        </div>

        <!-- 备注 -->
        <div v-if="archiveData?.remarks" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h5 class="text-sm font-medium text-gray-900 mb-2">备注</h5>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ archiveData.remarks }}</p>
        </div>
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
        <button
          type="button"
          @click="printArchive"
          class="btn btn-primary"
        >
          <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          打印档案
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  archiveData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// 计算属性
const drillInfo = computed(() => props.archiveData?.drillInfo || {})
const evaluationSummary = computed(() => props.archiveData?.evaluationSummary || {})
const comparisonAnalysis = computed(() => props.archiveData?.comparisonAnalysis || null)

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
    'CHEMICAL_DRILL': '化学事故演练'
  }
  return typeMap[type] || type
}

// 获取实施模式名称
const getExecutionModeName = (mode: string) => {
  return mode === 'SIMULATION' ? '模拟仿真' : '实战演练'
}

// 获取档案类型名称
const getArchiveTypeName = (mode: string) => {
  return mode === 'SIMULATION' ? '模拟演练档案' : '实战演练档案'
}

// 获取档案类型样式
const getArchiveTypeClass = (mode: string) => {
  return mode === 'SIMULATION'
    ? 'px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'
    : 'px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'
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
  const filePath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl
  return `/api/files/download?path=${encodeURIComponent(filePath)}&download=${download}`
}

// 打印档案
const printArchive = () => {
  window.print()
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

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}

/* 打印样式 */
@media print {
  .btn {
    display: none;
  }
}
</style>




