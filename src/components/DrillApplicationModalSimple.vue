<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="handleBackdropClick"
  >
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editData ? '编辑演练申请' : '新增演练申请' }}
        </h3>
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
        <div>
          <label class="label">演练科目</label>
          <input
            v-model="form.subject"
            type="text"
            class="input"
            placeholder="请输入演练科目"
          />
        </div>

        <div>
          <label class="label">演练类型</label>
          <select v-model="form.type" class="input">
            <option value="">请选择演练类型</option>
            <option value="FIRE_DRILL">消防演练</option>
            <option value="EARTHQUAKE_DRILL">地震演练</option>
            <option value="FLOOD_DRILL">防洪演练</option>
          </select>
        </div>

        <div>
          <label class="label">组织部门</label>
          <input
            v-model="form.organizerDept"
            type="text"
            class="input"
            placeholder="请输入组织部门"
          />
        </div>

        <div>
          <label class="label">计划时间</label>
          <input
            v-model="form.planTime"
            type="datetime-local"
            class="input"
          />
        </div>

        <div>
          <label class="label">演练说明</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="input"
            placeholder="请输入演练说明"
          ></textarea>
        </div>
      </div>

      <!-- 按钮区域 -->
      <div class="flex justify-end space-x-4 pt-6 border-t mt-6">
        <button
          type="button"
          @click="$emit('close')"
          class="btn btn-secondary"
        >
          取消
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="submitting"
          class="btn btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': submitting }"
        >
          {{ submitting ? '提交中...' : '提交' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Props {
  visible: boolean
  editData?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

// 响应式数据
const submitting = ref(false)

// 表单数据
const form = reactive({
  subject: '',
  type: '',
  organizerDept: '',
  planTime: '',
  description: ''
})

const handleSubmit = async () => {
  submitting.value = true
  
  try {
    // 构建符合后端API的数据格式
    const requestData = {
      drillSubject: form.subject,
      drillType: form.type,
      organizationDepartment: form.organizerDept,
      plannedDrillTime: form.planTime,
      drillDescription: form.description,
      participatingDepartments: [form.organizerDept],
      relatedPlanId: 1,
      affectsOperation: false,
      applicantId: 1,
      applicantName: '当前用户'
    }

    console.log('提交数据:', requestData)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('提交成功！')
    emit('success')
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败: ' + (error.message || '未知错误'))
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










