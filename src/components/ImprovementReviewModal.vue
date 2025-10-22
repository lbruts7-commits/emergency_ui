<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">审核整改任务</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 任务信息 -->
      <div v-if="taskData" class="mt-4 bg-blue-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-900 mb-2">整改任务信息</h4>
        <div class="space-y-2 text-sm">
          <div class="flex">
            <span class="font-medium text-blue-900 w-28">任务名称：</span>
            <span class="text-blue-800">{{ taskData.taskName }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-blue-900 w-28">建议类型：</span>
            <span class="text-blue-800">{{ getSuggestionTypeName(taskData.suggestionType) }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-blue-900 w-28">发起人：</span>
            <span class="text-blue-800">{{ taskData.initiatorName || '-' }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-blue-900 w-28">发起单位：</span>
            <span class="text-blue-800">{{ taskData.initiatorDepartment || '-' }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-blue-900 w-28">任务接收人：</span>
            <span class="text-blue-800">{{ taskData.receiverName }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-blue-900 w-28">整改期限：</span>
            <span class="text-blue-800">{{ taskData.deadlineDays }}天</span>
          </div>
        </div>
      </div>

      <!-- 建议描述 -->
      <div v-if="taskData?.suggestionDescription" class="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-900 mb-2">建议描述</h4>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ taskData.suggestionDescription }}</p>
      </div>

      <!-- 审核提示 -->
      <div class="mt-6 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-3">
          <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-lg font-medium text-gray-900">整改任务是否通过？</p>
        <p class="text-sm text-gray-500 mt-1">请选择审核结果</p>
      </div>

      <!-- 审核意见 -->
      <div class="mt-4">
        <label class="label">审核意见（可选）</label>
        <textarea
          v-model="reviewComment"
          class="input"
          rows="3"
          placeholder="请输入审核意见..."
        ></textarea>
      </div>

      <!-- 审核人 -->
      <div class="mt-4">
        <label class="label">审核人</label>
        <input
          v-model="reviewerName"
          type="text"
          class="input"
          placeholder="请输入审核人姓名"
        />
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-center space-x-4 mt-6 pt-4 border-t">
        <button
          type="button"
          @click="handleReject"
          :disabled="isSubmitting"
          class="btn btn-reject"
        >
          <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          {{ isSubmitting && !approving ? '处理中...' : '驳回' }}
        </button>
        <button
          type="button"
          @click="handleApprove"
          :disabled="isSubmitting"
          class="btn btn-approve"
        >
          <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {{ isSubmitting && approving ? '处理中...' : '通过' }}
        </button>
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
const reviewComment = ref('')
const reviewerName = ref('系统管理员')
const isSubmitting = ref(false)
const approving = ref(false)

// 审核通过
const handleApprove = async () => {
  if (!confirm('确认审核通过此整改任务吗？')) {
    return
  }

  isSubmitting.value = true
  approving.value = true

  try {
    await request.post('/improvement-tasks/review', {
      taskId: props.taskData.id,
      approved: true,
      reviewComment: reviewComment.value,
      reviewerName: reviewerName.value
    })

    showMessage('审核通过！', 'success')
    
    // 延迟关闭，让用户看到成功提示
    setTimeout(() => {
      emit('success')
      resetForm()
    }, 1500)

  } catch (error: any) {
    console.error('审核失败:', error)
    showMessage(error.message || '审核失败！', 'error')
  } finally {
    isSubmitting.value = false
    approving.value = false
  }
}

// 驳回
const handleReject = async () => {
  if (!confirm('确认驳回此整改任务吗？')) {
    return
  }

  isSubmitting.value = true
  approving.value = false

  try {
    await request.post('/improvement-tasks/review', {
      taskId: props.taskData.id,
      approved: false,
      reviewComment: reviewComment.value || '不符合要求，请重新修改',
      reviewerName: reviewerName.value
    })

    showMessage('驳回成功！', 'error')
    
    // 延迟关闭，让用户看到提示
    setTimeout(() => {
      emit('success')
      resetForm()
    }, 1500)

  } catch (error: any) {
    console.error('驳回失败:', error)
    showMessage(error.message || '驳回失败！', 'error')
  } finally {
    isSubmitting.value = false
  }
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

// 重置表单
const resetForm = () => {
  reviewComment.value = ''
  reviewerName.value = '系统管理员'
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

// 关闭弹窗
const closeModal = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}
</script>

<style scoped>
.label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
}

.btn {
  @apply px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center;
}

.btn-approve {
  @apply bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.btn-reject {
  @apply bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}
</style>




