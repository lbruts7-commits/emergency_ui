<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">
          {{ isEdit ? '编辑整改任务' : '新增整改任务' }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="mt-4 space-y-4">
        <!-- 整改任务名称 -->
        <div>
          <label class="label">
            整改任务名称
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.taskName"
            type="text"
            class="input"
            :class="{ 'border-red-500': errors.taskName }"
            placeholder="请输入整改任务名称"
            @blur="validateField('taskName')"
          />
          <p v-if="errors.taskName" class="text-red-500 text-xs mt-1">{{ errors.taskName }}</p>
        </div>

        <!-- 建议类型 -->
        <div>
          <label class="label">
            建议类型
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.suggestionType"
            class="input"
            :class="{ 'border-red-500': errors.suggestionType }"
            @blur="validateField('suggestionType')"
          >
            <option value="">请选择建议类型</option>
            <option value="EQUIPMENT">设备改进</option>
            <option value="PROCESS">流程改进</option>
            <option value="TRAINING">培训改进</option>
            <option value="ORGANIZATION">组织改进</option>
            <option value="SAFETY">安全改进</option>
            <option value="TECHNOLOGY">技术改进</option>
            <option value="OTHER">其他改进</option>
          </select>
          <p v-if="errors.suggestionType" class="text-red-500 text-xs mt-1">{{ errors.suggestionType }}</p>
        </div>

        <!-- 建议发起单位 -->
        <div>
          <label class="label">
            建议发起单位
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.initiatorDepartment"
            class="input"
            :class="{ 'border-red-500': errors.initiatorDepartment }"
            @blur="validateField('initiatorDepartment')"
          >
            <option value="">请选择建议发起单位</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.name">
              {{ dept.name }}
            </option>
          </select>
          <p v-if="errors.initiatorDepartment" class="text-red-500 text-xs mt-1">{{ errors.initiatorDepartment }}</p>
        </div>

        <!-- 建议发起人 -->
        <div>
          <label class="label">建议发起人</label>
          <input
            v-model="formData.initiatorName"
            type="text"
            class="input"
            placeholder="请输入建议发起人"
          />
        </div>

        <!-- 任务接收人 -->
        <div>
          <label class="label">
            任务接收人
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.receiverName"
            type="text"
            class="input"
            :class="{ 'border-red-500': errors.receiverName }"
            placeholder="请输入任务接收人"
            @blur="validateField('receiverName')"
          />
          <p v-if="errors.receiverName" class="text-red-500 text-xs mt-1">{{ errors.receiverName }}</p>
        </div>

        <!-- 整改期限 -->
        <div>
          <label class="label">
            整改期限(天)
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="formData.deadlineDays"
            type="number"
            class="input"
            :class="{ 'border-red-500': errors.deadlineDays }"
            placeholder="请输入整改期限天数"
            min="1"
            @blur="validateField('deadlineDays')"
          />
          <p v-if="errors.deadlineDays" class="text-red-500 text-xs mt-1">{{ errors.deadlineDays }}</p>
          <p v-if="formData.deadlineDays" class="text-xs text-gray-500 mt-1">
            截止日期：{{ getDeadlineDate() }}
          </p>
        </div>

        <!-- 建议描述 -->
        <div>
          <label class="label">建议描述</label>
          <textarea
            v-model="formData.suggestionDescription"
            class="input"
            rows="4"
            placeholder="请输入详细的改进建议和理由"
          ></textarea>
        </div>

        <!-- 附件上传 -->
        <div>
          <label class="label">附件上传（支持Word、PDF格式）</label>
          <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="attachment-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>选择文件</span>
                  <input
                    id="attachment-upload"
                    name="attachment-upload"
                    type="file"
                    class="sr-only"
                    accept=".doc,.docx,.pdf"
                    @change="handleFileChange"
                  />
                </label>
                <p class="pl-1">或拖拽文件到此处</p>
              </div>
              <p class="text-xs text-gray-500">支持Word、PDF格式</p>
            </div>
          </div>

          <!-- 已选择的文件 -->
          <div v-if="selectedFile" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm text-green-900">{{ selectedFile.name }}</span>
              </div>
              <button @click="clearFile" class="text-green-600 hover:text-green-800">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-end space-x-4 mt-6 pt-4 border-t">
        <button type="button" @click="closeModal" class="btn btn-secondary" :disabled="isSubmitting">
          取消
        </button>
        <button type="button" @click="handleSubmit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交' }}
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
  isEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

// 部门列表
const departments = ref([
  { id: 1, name: '应急管理部' },
  { id: 2, name: '安全保卫部' },
  { id: 3, name: '医疗救护部' },
  { id: 4, name: '消防救援部' },
  { id: 5, name: '技术保障部' },
  { id: 6, name: '后勤保障部' },
  { id: 7, name: '信息通信部' }
])

// 表单数据
const formData = ref({
  taskName: '',
  suggestionType: '',
  suggestionDescription: '',
  initiatorName: '系统管理员',
  initiatorDepartment: '',
  receiverName: '',
  deadlineDays: null as number | null
})

// 错误信息
const errors = ref({
  taskName: '',
  suggestionType: '',
  initiatorDepartment: '',
  receiverName: '',
  deadlineDays: ''
})

// 文件
const selectedFile = ref<File | null>(null)
const isSubmitting = ref(false)

// 初始化表单
const initForm = () => {
  if (props.isEdit && props.taskData) {
    formData.value = {
      taskName: props.taskData.taskName || '',
      suggestionType: props.taskData.suggestionType || '',
      suggestionDescription: props.taskData.suggestionDescription || '',
      initiatorName: props.taskData.initiatorName || '系统管理员',
      initiatorDepartment: props.taskData.initiatorDepartment || '',
      receiverName: props.taskData.receiverName || '',
      deadlineDays: props.taskData.deadlineDays || null
    }
  } else {
    resetForm()
  }
  clearErrors()
  selectedFile.value = null
}

// 重置表单
const resetForm = () => {
  formData.value = {
    taskName: '',
    suggestionType: '',
    suggestionDescription: '',
    initiatorName: '系统管理员',
    initiatorDepartment: '',
    receiverName: '',
    deadlineDays: null
  }
}

// 清空错误
const clearErrors = () => {
  errors.value = {
    taskName: '',
    suggestionType: '',
    initiatorDepartment: '',
    receiverName: '',
    deadlineDays: ''
  }
}

// 验证单个字段
const validateField = (field: string) => {
  switch (field) {
    case 'taskName':
      if (!formData.value.taskName || !formData.value.taskName.trim()) {
        errors.value.taskName = '必填，请输入整改任务名称信息！'
      } else {
        errors.value.taskName = ''
      }
      break
    case 'suggestionType':
      if (!formData.value.suggestionType) {
        errors.value.suggestionType = '必选，请选择建议类型！'
      } else {
        errors.value.suggestionType = ''
      }
      break
    case 'initiatorDepartment':
      if (!formData.value.initiatorDepartment) {
        errors.value.initiatorDepartment = '必选，请选择建议发起单位！'
      } else {
        errors.value.initiatorDepartment = ''
      }
      break
    case 'receiverName':
      if (!formData.value.receiverName || !formData.value.receiverName.trim()) {
        errors.value.receiverName = '必填，请输入任务接收人信息！'
      } else {
        errors.value.receiverName = ''
      }
      break
    case 'deadlineDays':
      if (!formData.value.deadlineDays || formData.value.deadlineDays <= 0) {
        errors.value.deadlineDays = '必填，请输入整改期限(天)信息！'
      } else {
        errors.value.deadlineDays = ''
      }
      break
  }
}

// 验证所有字段
const validateForm = () => {
  validateField('taskName')
  validateField('suggestionType')
  validateField('initiatorDepartment')
  validateField('receiverName')
  validateField('deadlineDays')

  return !Object.values(errors.value).some(error => error !== '')
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 验证文件格式
    const validExtensions = ['.doc', '.docx', '.pdf']
    const fileName = file.name.toLowerCase()
    const isValid = validExtensions.some(ext => fileName.endsWith(ext))
    
    if (!isValid) {
      showMessage('只支持Word和PDF格式的文件！', 'error')
      return
    }
    
    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      showMessage('文件大小不能超过10MB！', 'error')
      return
    }
    
    selectedFile.value = file
  }
}

// 清除文件
const clearFile = () => {
  selectedFile.value = null
  const fileInput = document.getElementById('attachment-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// 计算截止日期
const getDeadlineDate = () => {
  if (!formData.value.deadlineDays) return ''
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + formData.value.deadlineDays)
  return deadline.toLocaleDateString('zh-CN')
}

// 提交表单
const handleSubmit = async () => {
  // 验证表单
  if (!validateForm()) {
    showMessage('请填写所有必填项！', 'error')
    return
  }

  isSubmitting.value = true

  try {
    // 提交基本信息
    let response
    if (props.isEdit) {
      response = await request.put(`/improvement-tasks/${props.taskData.id}`, formData.value)
    } else {
      response = await request.post('/improvement-tasks', formData.value)
    }

    // 如果有附件，上传附件
    if (selectedFile.value && response.data?.id) {
      const formDataFile = new FormData()
      formDataFile.append('file', selectedFile.value)
      
      await request.post(`/improvement-tasks/${response.data.id}/attachments`, formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    showMessage('提交成功！', 'success')
    
    // 延迟关闭，让用户看到成功提示
    setTimeout(() => {
      emit('success')
      resetForm()
    }, 1500)

  } catch (error: any) {
    console.error('提交失败:', error)
    showMessage(error.message || '提交失败！', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initForm()
  } else {
    resetForm()
    clearErrors()
    selectedFile.value = null
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
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50;
}
</style>




