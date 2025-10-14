<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="handleBackdropClick"
  >
    <div class="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">演练方案详情</h3>
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
        <!-- 基本信息 -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">演练科目</label>
              <p class="mt-1 text-sm text-gray-900">{{ data.drillSubject || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">演练类型</label>
              <p class="mt-1 text-sm text-gray-900">{{ getDrillTypeName(data.drillType) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">计划参演部门</label>
              <p class="mt-1 text-sm text-gray-900">
                <span v-if="Array.isArray(data.participatingDepartments)">
                  {{ data.participatingDepartments.join('、') }}
                </span>
                <span v-else>{{ data.participatingDepartments || '-' }}</span>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">组织部门/科室</label>
              <p class="mt-1 text-sm text-gray-900">{{ data.organizationDepartment || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">关联预案</label>
              <p class="mt-1 text-sm text-gray-900">{{ data.relatedPlanName || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">计划演练时间</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(data.plannedDrillTime) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">状态</label>
              <p class="mt-1">
                <span :class="getStatusClass(data.status)">
                  {{ getStatusText(data.status) }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">方案制定人</label>
              <p class="mt-1 text-sm text-gray-900">{{ data.plannerName || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- 方案说明 -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">方案说明</h4>
          <div class="bg-white rounded-lg p-4 border">
            <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ data.planDescription || '无' }}</p>
          </div>
        </div>

        <!-- 方案文档 -->
        <div v-if="data.documents && data.documents.length > 0" class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">方案文档</h4>
          <div class="space-y-3">
            <div
              v-for="(document, index) in data.documents"
              :key="index"
              class="flex items-center justify-between bg-white p-4 rounded-lg border"
            >
              <div class="flex items-center">
                <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ document.fileName }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(document.fileSize) }} • 上传于 {{ formatDateTime(document.uploadTime) }}</p>
                  <p class="text-xs text-gray-500">上传人：{{ document.uploaderName }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="downloadDocument(document)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  下载
                </button>
                <button
                  @click="previewDocument(document)"
                  class="text-green-600 hover:text-green-800 text-sm"
                >
                  预览
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 审核信息 -->
        <div v-if="data.reviewerName || data.reviewTime" class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">审核信息</h4>
          <div class="bg-white rounded-lg p-4 border">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">审核人</label>
                <p class="mt-1 text-sm text-gray-900">{{ data.reviewerName || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">审核时间</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(data.reviewTime) }}</p>
              </div>
              <div class="md:col-span-2" v-if="data.reviewComment">
                <label class="text-sm font-medium text-gray-500">审核意见</label>
                <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ data.reviewComment }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作记录 -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">操作记录</h4>
          <div class="space-y-3">
            <div
              v-for="(record, index) in operationRecords"
              :key="index"
              class="flex items-start space-x-3 bg-white p-4 rounded-lg border"
            >
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ record.action }}</p>
                <p class="text-sm text-gray-500">{{ record.description }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ record.operator }} • {{ formatDateTime(record.operateTime) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 创建和更新信息 -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">创建信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">创建人</label>
              <p class="mt-1 text-sm text-gray-900">{{ data.plannerName || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">创建时间</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(data.createdAt) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">最后更新时间</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(data.updatedAt) }}</p>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
  data: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// 操作记录
const operationRecords = computed(() => {
  const records = []
  
  if (props.data.createdAt) {
    records.push({
      action: '创建方案',
      description: '演练方案已创建',
      operator: props.data.plannerName || '系统',
      operateTime: props.data.createdAt
    })
  }
  
  if (props.data.status === 'SUBMITTED' && props.data.createdAt) {
    records.push({
      action: '提交方案',
      description: '演练方案已提交审核',
      operator: props.data.plannerName || '系统',
      operateTime: props.data.createdAt
    })
  }
  
  if (props.data.reviewTime) {
    const isApproved = props.data.status === 'APPROVED'
    records.push({
      action: '审核方案',
      description: `方案审核${isApproved ? '通过' : '驳回'}`,
      operator: props.data.reviewerName || '系统',
      operateTime: props.data.reviewTime
    })
  }
  
  if (props.data.updatedAt && props.data.updatedAt !== props.data.createdAt) {
    records.push({
      action: '更新方案',
      description: '演练方案信息已更新',
      operator: props.data.plannerName || '系统',
      operateTime: props.data.updatedAt
    })
  }
  
  return records.sort((a, b) => new Date(b.operateTime).getTime() - new Date(a.operateTime).getTime())
})

// 方法
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatFileSize = (bytes: number) => {
  if (!bytes) return '-'
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

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
  return typeMap[type] || type || '-'
}

const getStatusClass = (status: string) => {
  const classes = {
    'DRAFT': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800',
    'SUBMITTED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    'APPROVED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    'REJECTED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || classes['DRAFT']
}

const getStatusText = (status: string) => {
  const texts = {
    'DRAFT': '草稿',
    'SUBMITTED': '已提交',
    'APPROVED': '已审核',
    'REJECTED': '已驳回'
  }
  return texts[status] || '未知'
}

const getAuditResultClass = (result: string) => {
  const classes = {
    approved: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    rejected: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[result] || classes.approved
}

const getAuditResultText = (result: string) => {
  const texts = {
    approved: '通过',
    rejected: '驳回'
  }
  return texts[result] || '未知'
}

const downloadDocument = (document: any) => {
  // 实现文档下载逻辑
  console.log('下载文档:', document)
}

const previewDocument = (document: any) => {
  // 实现文档预览逻辑
  console.log('预览文档:', document)
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>
