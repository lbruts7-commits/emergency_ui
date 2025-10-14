<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="handleBackdropClick"
  >
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editData ? '编辑演练方案' : '新增演练方案' }}
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

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 关联演练申请 -->
        <div>
          <label class="label">
            关联演练申请 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.applicationId"
            class="input"
            :class="{ 'border-red-500': errors.applicationId }"
            @blur="validateField('applicationId')"
            @change="onApplicationChange"
          >
            <option value="">请选择演练申请</option>
            <option
              v-for="app in submittedApplications"
              :key="app.id"
              :value="app.id"
            >
              {{ app.drillSubject }} - {{ getDrillTypeName(app.drillType) }} ({{ formatDate(app.plannedDrillTime) }})
            </option>
          </select>
          <p v-if="errors.applicationId" class="text-red-500 text-sm mt-1">{{ errors.applicationId }}</p>
        </div>

        <!-- 演练申请信息展示 -->
        <div v-if="selectedApplication" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-3">演练申请信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">演练科目：</span>
              <span class="text-gray-900">{{ selectedApplication.drillSubject }}</span>
            </div>
            <div>
              <span class="text-gray-500">演练类型：</span>
              <span class="text-gray-900">{{ getDrillTypeName(selectedApplication.drillType) }}</span>
            </div>
            <div>
              <span class="text-gray-500">参演部门：</span>
              <span class="text-gray-900">{{ selectedApplication.participatingDepartments?.join('、') }}</span>
            </div>
            <div>
              <span class="text-gray-500">组织部门：</span>
              <span class="text-gray-900">{{ selectedApplication.organizationDepartment }}</span>
            </div>
            <div>
              <span class="text-gray-500">关联预案：</span>
              <span class="text-gray-900">{{ selectedApplication.relatedPlanName }}</span>
            </div>
            <div>
              <span class="text-gray-500">计划时间：</span>
              <span class="text-gray-900">{{ formatDateTime(selectedApplication.plannedDrillTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 方案说明 -->
        <div>
          <label class="label">
            方案说明 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            rows="6"
            class="input"
            :class="{ 'border-red-500': errors.description }"
            placeholder="请输入演练方案说明（最多500字）"
            @blur="validateField('description')"
            @input="validateField('description')"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
            <p class="text-sm text-gray-500 ml-auto">
              {{ form.description.length }}/500
            </p>
          </div>
        </div>

        <!-- 方案文档上传 -->
        <div>
          <label class="label">方案文档</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="mt-4">
                <label for="plan-file-upload" class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900">
                    点击上传方案文档
                  </span>
                  <input
                    id="plan-file-upload"
                    ref="fileInput"
                    type="file"
                    class="sr-only"
                    @change="handleFileUpload"
                    accept=".pdf,.doc,.docx"
                  />
                </label>
                <p class="mt-1 text-xs text-gray-500">
                  支持 PDF, DOC, DOCX 格式，文件大小不超过20MB
                </p>
              </div>
            </div>
          </div>

          <!-- 已上传文件列表 -->
          <div v-if="form.document" class="mt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">已上传文档：</h4>
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-sm text-gray-900">{{ form.document.name }}</span>
                <span class="text-xs text-gray-500 ml-2">({{ formatFileSize(form.document.size) }})</span>
              </div>
              <button
                @click="removeDocument"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-secondary"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="btn btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': submitting }"
          >
            <span v-if="submitting" class="loading-spinner mr-2"></span>
            {{ submitting ? '提交中...' : '提交' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useDrillPlanStore } from '@/stores/drillPlan'
import { useDrillApplicationStore } from '@/stores/drillApplication'
import { showMessage } from '@/utils/message'
import request from '@/utils/request'

interface Props {
  visible: boolean
  editData?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const drillPlanStore = useDrillPlanStore()
const drillApplicationStore = useDrillApplicationStore()

// 响应式数据
const submitting = ref(false)
const fileInput = ref<HTMLInputElement>()
const submittedApplications = ref([])

// 表单数据
const form = reactive({
  applicationId: '',
  description: '',
  document: null as File | null
})

// 错误信息
const errors = reactive({
  applicationId: '',
  description: ''
})

// 计算属性
const selectedApplication = computed(() => {
  return submittedApplications.value.find(app => app.id === form.applicationId)
})

// 方法
const resetForm = () => {
  Object.assign(form, {
    applicationId: '',
    description: '',
    document: null
  })
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData) {
    Object.assign(form, {
      applicationId: newData.applicationId || '',
      description: newData.description || '',
      document: newData.document || null
    })
  } else {
    resetForm()
  }
}, { immediate: true })

const validateField = (field: string) => {
  switch (field) {
    case 'applicationId':
      errors.applicationId = form.applicationId ? '' : '必填，请输入字段信息'
      break
    case 'description':
      if (!form.description) {
        errors.description = '必填，请输入字段信息'
      } else if (form.description.length > 500) {
        errors.description = '方案说明不能超过500字'
      } else {
        errors.description = ''
      }
      break
  }
}

const validateForm = () => {
  validateField('applicationId')
  validateField('description')

  return !Object.values(errors).some(error => error !== '')
}

const onApplicationChange = () => {
  // 当选择演练申请时，可以预填充一些信息
  if (selectedApplication.value) {
    // 这里可以根据需要预填充一些信息
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 检查文件大小（限制20MB）
  if (file.size > 20 * 1024 * 1024) {
    showMessage('文件大小不能超过20MB', 'error')
    return
  }
  
  // 检查文件类型
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    showMessage('只支持PDF、DOC、DOCX格式的文件', 'error')
    return
  }
  
  form.document = file
  
  // 清空input
  if (target) {
    target.value = ''
  }
}

const removeDocument = () => {
  form.document = null
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
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
  return typeMap[type] || type
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showMessage('请检查表单信息', 'error')
    return
  }

  submitting.value = true
  
  try {
    // 准备JSON数据
    const planData = {
      applicationId: parseInt(form.applicationId),
      planDescription: form.description,
      plannerId: 1, // 临时使用固定值，实际应该从用户信息获取
      plannerName: '系统用户' // 临时使用固定值，实际应该从用户信息获取
    }

    if (props.editData) {
      await drillPlanStore.updatePlan(props.editData.id, planData)
      showMessage('更新成功', 'success')
    } else {
      await drillPlanStore.createPlan(planData)
      showMessage('提交成功', 'success')
    }
    
    emit('success')
  } catch (error) {
    showMessage('提交失败', 'error')
  } finally {
    submitting.value = false
  }
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const loadSubmittedApplications = async () => {
  try {
    // 使用专门的API获取已提交的申请
    const response = await request.get('/drill-applications/submitted')
    console.log('加载已提交的演练申请响应:', response)
    if (response.data && Array.isArray(response.data)) {
      submittedApplications.value = response.data
      console.log('已提交的演练申请列表:', submittedApplications.value)
    } else {
      submittedApplications.value = []
    }
  } catch (error) {
    console.error('加载已提交的演练申请失败:', error)
    submittedApplications.value = []
  }
}

// 生命周期
onMounted(() => {
  loadSubmittedApplications()
})
</script>
