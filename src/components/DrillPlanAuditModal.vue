<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="handleBackdropClick"
  >
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">演练方案审核</h3>
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
        <!-- 方案基本信息 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-3">方案信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500">演练科目：</span>
              <span class="text-gray-900">{{ data.drillSubject }}</span>
            </div>
            <div>
              <span class="text-gray-500">演练类型：</span>
              <span class="text-gray-900">{{ getDrillTypeName(data.drillType) }}</span>
            </div>
            <div>
              <span class="text-gray-500">计划参演部门：</span>
              <span class="text-gray-900">
                <span v-if="Array.isArray(data.participatingDepartments)">
                  {{ data.participatingDepartments.join('、') }}
                </span>
                <span v-else>{{ data.participatingDepartments || '-' }}</span>
              </span>
            </div>
            <div>
              <span class="text-gray-500">组织部门：</span>
              <span class="text-gray-900">{{ data.organizationDepartment }}</span>
            </div>
            <div>
              <span class="text-gray-500">计划时间：</span>
              <span class="text-gray-900">{{ formatDateTime(data.plannedDrillTime) }}</span>
            </div>
            <div>
              <span class="text-gray-500">制定人：</span>
              <span class="text-gray-900">{{ data.plannerName }}</span>
            </div>
          </div>
        </div>

        <!-- 方案说明 -->
        <div>
          <label class="label">方案说明</label>
          <div class="bg-gray-50 rounded-lg p-4 border">
            <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ data.planDescription || '无' }}</p>
          </div>
        </div>

        <!-- 方案文档 -->
        <div v-if="data.documents && data.documents.length > 0">
          <label class="label">方案文档</label>
          <div class="space-y-2">
            <div
              v-for="(document, index) in data.documents"
              :key="index"
              class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-sm text-gray-900">{{ document.fileName }}</span>
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

        <!-- 审核结果 -->
        <div>
          <label class="label">
            审核结果 <span class="text-red-500">*</span>
          </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="auditForm.result"
                type="radio"
                value="approved"
                class="mr-2"
              />
              <span class="text-green-600 font-medium">通过</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="auditForm.result"
                type="radio"
                value="rejected"
                class="mr-2"
              />
              <span class="text-red-600 font-medium">驳回</span>
            </label>
          </div>
          <p v-if="errors.result" class="text-red-500 text-sm mt-1">{{ errors.result }}</p>
        </div>

        <!-- 审核意见 -->
        <div>
          <label class="label">
            审核意见 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="auditForm.comment"
            rows="4"
            class="input"
            :class="{ 'border-red-500': errors.comment }"
            placeholder="请输入审核意见"
            @blur="validateField('comment')"
          ></textarea>
          <p v-if="errors.comment" class="text-red-500 text-sm mt-1">{{ errors.comment }}</p>
        </div>

        <!-- 审核说明 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">审核说明</h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>审核通过后，方案将进入执行阶段</li>
                  <li>审核驳回后，制定人可重新修改方案</li>
                  <li>审核通过后，若演练未开始，可再次驳回以修改方案</li>
                  <li>请仔细审核方案内容的完整性和可行性</li>
                </ul>
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
          取消
        </button>
        <button
          @click="handleAudit"
          :disabled="submitting"
          class="btn btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': submitting }"
        >
          <span v-if="submitting" class="loading-spinner mr-2"></span>
          {{ submitting ? '审核中...' : '确认审核' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDrillPlanStore } from '@/stores/drillPlan'
import { showMessage } from '@/utils/message'

interface Props {
  visible: boolean
  data: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const drillPlanStore = useDrillPlanStore()

// 响应式数据
const submitting = ref(false)

// 审核表单
const auditForm = reactive({
  result: '',
  comment: ''
})

// 错误信息
const errors = reactive({
  result: '',
  comment: ''
})

// 方法
const validateField = (field: string) => {
  switch (field) {
    case 'result':
      errors.result = auditForm.result ? '' : '请选择审核结果'
      break
    case 'comment':
      errors.comment = auditForm.comment ? '' : '请输入审核意见'
      break
  }
}

const validateForm = () => {
  validateField('result')
  validateField('comment')

  return !Object.values(errors).some(error => error !== '')
}

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
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

const downloadDocument = (document: any) => {
  // 实现文档下载逻辑
  console.log('下载文档:', document)
}

const previewDocument = (document: any) => {
  // 实现文档预览逻辑
  console.log('预览文档:', document)
}

const handleAudit = async () => {
  if (!validateForm()) {
    showMessage('请检查审核信息', 'error')
    return
  }

  submitting.value = true
  
  try {
    // 构建审核数据，符合后端API要求
    const reviewData = {
      planId: props.data.id,
      approved: auditForm.result === 'approved',
      reviewerId: 1, // 临时值，实际应该从当前登录用户获取
      reviewerName: '审核员', // 临时值，实际应该从当前登录用户获取
      reviewComment: auditForm.comment
    }

    await drillPlanStore.reviewPlan(reviewData)
    
    const message = auditForm.result === 'approved' ? '审核通过！' : '驳回成功！'
    const type = auditForm.result === 'approved' ? 'success' : 'error'
    showMessage(message, type)
    
    // 延迟关闭弹窗，让用户看到提示消息
    setTimeout(() => {
      emit('success')
    }, 1000)
  } catch (error: any) {
    console.error('审核失败:', error)
    showMessage(error.message || '审核失败', 'error')
  } finally {
    submitting.value = false
  }
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>
