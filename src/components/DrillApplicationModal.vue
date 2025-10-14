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

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 演练科目 -->
          <div>
            <label class="label">
              演练科目 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.subject"
              type="text"
              class="input"
              :class="{ 'border-red-500': errors.subject }"
              placeholder="请输入演练科目"
              @blur="validateField('subject')"
            />
            <p v-if="errors.subject" class="text-red-500 text-sm mt-1">{{ errors.subject }}</p>
          </div>

          <!-- 演练类型 -->
          <div>
            <label class="label">
              演练类型 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              class="input"
              :class="{ 'border-red-500': errors.type }"
              @blur="validateField('type')"
            >
              <option value="">请选择演练类型</option>
              <option v-for="drillType in drillTypes" :key="drillType.dictCode" :value="drillType.dictCode">
                {{ drillType.dictName }}
              </option>
            </select>
            <p v-if="errors.type" class="text-red-500 text-sm mt-1">{{ errors.type }}</p>
          </div>

          <!-- 计划参演部门 -->
          <div>
            <label class="label">
              计划参演部门 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.participantDepts"
              multiple
              class="input h-32"
              :class="{ 'border-red-500': errors.participantDepts }"
              @blur="validateField('participantDepts')"
            >
              <option v-for="dept in departments" :key="dept.id" :value="dept.orgName">
                {{ dept.orgName }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">按住 Ctrl 键可多选</p>
            <p v-if="errors.participantDepts" class="text-red-500 text-sm mt-1">{{ errors.participantDepts }}</p>
          </div>

          <!-- 组织部门/科室 -->
          <div>
            <label class="label">
              组织部门/科室 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.organizerDept"
              class="input"
              :class="{ 'border-red-500': errors.organizerDept }"
              @blur="validateField('organizerDept')"
            >
              <option value="">请选择组织部门/科室</option>
              <option v-for="office in offices" :key="office.id" :value="office.orgName">
                {{ office.orgName }}
              </option>
            </select>
            <p v-if="errors.organizerDept" class="text-red-500 text-sm mt-1">{{ errors.organizerDept }}</p>
          </div>

          <!-- 关联预案 -->
          <div>
            <label class="label">
              关联预案 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.planId"
              class="input"
              :class="{ 'border-red-500': errors.planId }"
              @blur="validateField('planId')"
            >
              <option value="">请选择关联预案</option>
              <option v-for="plan in plans" :key="plan.id" :value="plan.id">
                {{ plan.name }}
              </option>
            </select>
            <p v-if="errors.planId" class="text-red-500 text-sm mt-1">{{ errors.planId }}</p>
          </div>

          <!-- 计划时间 -->
          <div>
            <label class="label">
              计划时间 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.planTime"
              type="datetime-local"
              class="input"
              :class="{ 'border-red-500': errors.planTime }"
              @blur="validateField('planTime')"
            />
            <p v-if="errors.planTime" class="text-red-500 text-sm mt-1">{{ errors.planTime }}</p>
          </div>
        </div>

        <!-- 是否影响运行 -->
        <div>
          <label class="label">是否影响运行</label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="form.affectOperation"
                type="radio"
                :value="true"
                class="mr-2"
              />
              是
            </label>
            <label class="flex items-center">
              <input
                v-model="form.affectOperation"
                type="radio"
                :value="false"
                class="mr-2"
              />
              否
            </label>
          </div>
        </div>

        <!-- 说明 -->
        <div>
          <label class="label">
            说明 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="input"
            :class="{ 'border-red-500': errors.description }"
            placeholder="请输入演练说明（最多500字）"
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

        <!-- 附件上传 -->
        <div>
          <label class="label">附件</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="mt-4">
                <label for="file-upload" class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900">
                    点击上传文件
                  </span>
                  <input
                    id="file-upload"
                    ref="fileInput"
                    type="file"
                    multiple
                    class="sr-only"
                    @change="handleFileUpload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                </label>
                <p class="mt-1 text-xs text-gray-500">
                  支持 PDF, DOC, DOCX, XLS, XLSX, JPG, PNG 格式
                </p>
              </div>
            </div>
          </div>

          <!-- 已上传文件列表 -->
          <div v-if="form.attachments.length > 0" class="mt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">已上传文件：</h4>
            <div class="space-y-2">
              <div
                v-for="(file, index) in form.attachments"
                :key="index"
                class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="text-sm text-gray-900">{{ file.name }}</span>
                  <span class="text-xs text-gray-500 ml-2">({{ formatFileSize(file.size) }})</span>
                </div>
                <button
                  @click="removeFile(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
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
import { ref, reactive, onMounted, watch } from 'vue'
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

const drillApplicationStore = useDrillApplicationStore()

// 响应式数据
const submitting = ref(false)
const fileInput = ref<HTMLInputElement>()
const plans = ref([])
const drillTypes = ref([]) // 演练类型字典
const departments = ref([]) // 部门列表
const offices = ref([]) // 科室列表

// 表单数据
const form = reactive({
  subject: '',
  type: '',
  participantDepts: [] as string[], // 改为数组支持多选
  organizerDept: '',
  planId: '',
  planTime: '',
  description: '',
  affectOperation: false,
  attachments: [] as File[]
})

// 错误信息
const errors = reactive({
  subject: '',
  type: '',
  participantDepts: '',
  organizerDept: '',
  planId: '',
  planTime: '',
  description: ''
})

// 方法
const resetForm = () => {
  Object.assign(form, {
    subject: '',
    type: '',
    participantDepts: [],
    organizerDept: '',
    planId: '',
    planTime: '',
    description: '',
    affectOperation: false,
    attachments: []
  })
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData) {
    Object.assign(form, {
      subject: newData.subject || '',
      type: newData.type || '',
      participantDepts: newData.participantDepts || [],
      organizerDept: newData.organizerDept || '',
      planId: newData.planId || '',
      planTime: newData.planTime || '',
      description: newData.description || '',
      affectOperation: newData.affectOperation || false,
      attachments: newData.attachments || []
    })
  } else {
    resetForm()
  }
}, { immediate: true })

const validateField = (field: string) => {
  switch (field) {
    case 'subject':
      errors.subject = form.subject ? '' : '必填，请输入演练科目信息！'
      break
    case 'type':
      errors.type = form.type ? '' : '必填，请输入演练类型信息！'
      break
    case 'participantDepts':
      errors.participantDepts = form.participantDepts.length > 0 ? '' : '必填，请输入计划参演部门信息！'
      break
    case 'organizerDept':
      errors.organizerDept = form.organizerDept ? '' : '必填，请输入组织部门/科室信息！'
      break
    case 'planId':
      errors.planId = form.planId ? '' : '必填，请输入关联预案信息！'
      break
    case 'planTime':
      errors.planTime = form.planTime ? '' : '必填，请输入计划演练时间信息！'
      break
    case 'description':
      if (!form.description) {
        errors.description = '必填，请输入应急演练说明信息！'
      } else if (form.description.length > 500) {
        errors.description = '应急演练说明不能超过500字！'
      } else {
        errors.description = ''
      }
      break
  }
}

const validateForm = () => {
  validateField('subject')
  validateField('type')
  validateField('participantDepts')
  validateField('organizerDept')
  validateField('planId')
  validateField('planTime')
  validateField('description')

  return !Object.values(errors).some(error => error !== '')
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  files.forEach(file => {
    // 检查文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
      showMessage('文件大小不能超过10MB', 'error')
      return
    }
    
    // 检查文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      showMessage('不支持的文件格式', 'error')
      return
    }
    
    form.attachments.push(file)
  })
  
  // 清空input
  if (target) {
    target.value = ''
  }
}

const removeFile = (index: number) => {
  form.attachments.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showMessage('请检查表单信息', 'error')
    return
  }

  submitting.value = true
  
  try {
    // 构建符合后端API的数据格式
    const requestData = {
      drillSubject: form.subject,
      drillType: form.type,
      participatingDepartments: form.participantDepts, // 使用多选数组
      organizationDepartment: form.organizerDept,
      relatedPlanId: parseInt(form.planId),
      plannedDrillTime: form.planTime,
      drillDescription: form.description,
      affectsOperation: form.affectOperation,
      status: 'SUBMITTED', // 设置为已提交状态
      applicantId: 1, // 临时设置，实际应该从用户信息获取
      applicantName: '当前用户' // 临时设置，实际应该从用户信息获取
    }

    if (props.editData) {
      await drillApplicationStore.updateApplication(props.editData.id, requestData)
      showMessage('提交成功!', 'success')
    } else {
      await drillApplicationStore.createApplication(requestData)
      showMessage('提交成功!', 'success')
    }
    
    // 3秒后关闭弹窗并刷新列表
    setTimeout(() => {
      emit('success')
    }, 3000)
  } catch (error) {
    console.error('提交失败:', error)
    showMessage('提交失败！', 'error')
    submitting.value = false
  }
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const loadPlans = async () => {
  try {
    // 调用获取预案列表的API
    const response = await request.get('/emergency-plans/all')
    if (response.data && response.data.length > 0) {
      plans.value = response.data.map((plan: any) => ({
        id: plan.id,
        name: plan.planName
      }))
    } else {
      // 如果API失败，使用默认数据
      plans.value = [
        { id: 1, name: '火灾应急预案' },
        { id: 2, name: '地震应急预案' },
        { id: 3, name: '洪水应急预案' },
        { id: 4, name: '医疗应急预案' },
        { id: 5, name: '核事故应急预案' },
        { id: 6, name: '化学事故应急预案' }
      ]
    }
  } catch (error) {
    console.error('加载预案列表失败:', error)
    // 使用默认数据作为备选
    plans.value = [
      { id: 1, name: '火灾应急预案' },
      { id: 2, name: '地震应急预案' },
      { id: 3, name: '洪水应急预案' },
      { id: 4, name: '医疗应急预案' },
      { id: 5, name: '核事故应急预案' },
      { id: 6, name: '化学事故应急预案' }
    ]
  }
}

// 加载演练类型字典
const loadDrillTypes = async () => {
  try {
    const response = await request.get('/dictionaries/drill-types')
    if (response.data && response.data.length > 0) {
      drillTypes.value = response.data
    }
  } catch (error) {
    console.error('加载演练类型字典失败:', error)
  }
}

// 加载部门列表
const loadDepartments = async () => {
  try {
    const response = await request.get('/organizations/departments')
    if (response.data && response.data.length > 0) {
      departments.value = response.data
    }
  } catch (error) {
    console.error('加载部门列表失败:', error)
  }
}

// 加载科室列表
const loadOffices = async () => {
  try {
    const response = await request.get('/organizations/offices')
    if (response.data && response.data.length > 0) {
      offices.value = response.data
    }
  } catch (error) {
    console.error('加载科室列表失败:', error)
  }
}

// 生命周期
onMounted(() => {
  loadPlans()
  loadDrillTypes()
  loadDepartments()
  loadOffices()
})
</script>
