<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <div class="flex items-center">
          <h3 class="text-xl font-bold text-gray-900">
            {{ isEditMode ? '修改参演人员' : (hasParticipants ? '参演人员详情' : '参演人员录入') }}
          </h3>
          <span 
            v-if="hasParticipants && !isEditMode" 
            class="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded"
          >
            已录入
          </span>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 演练信息 -->
      <div v-if="executionData" class="mt-4 bg-blue-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-900 mb-2">演练基本信息</h4>
        <div class="grid grid-cols-2 gap-4 text-sm text-blue-800">
          <div><span class="font-medium">演练科目：</span>{{ executionData.drillSubject }}</div>
          <div><span class="font-medium">演练类型：</span>{{ getDrillTypeName(executionData.drillType) }}</div>
          <div><span class="font-medium">实施模式：</span>{{ getExecutionModeName(executionData.executionMode) }}</div>
          <div><span class="font-medium">演练时间：</span>{{ formatDateTime(executionData.startTime) }} ~ {{ formatDateTime(executionData.endTime) }}</div>
        </div>
      </div>

      <!-- 参演部门列表 -->
      <div class="mt-6">
        <h4 class="text-base font-medium text-gray-900 mb-3">参演部门及人员</h4>
        <p class="text-sm text-gray-500 mb-4">请根据各参演部门，录入实际参加演练的人员姓名</p>

        <div class="space-y-4">
          <div
            v-for="(dept, index) in participatingDepartments"
            :key="index"
            class="border rounded-lg p-4 bg-gray-50"
          >
            <div class="flex items-center mb-3">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                {{ index + 1 }}
              </div>
              <h5 class="ml-3 text-base font-medium text-gray-900">{{ dept }}</h5>
            </div>

            <div class="ml-11">
              <label class="label">参演人员姓名</label>
              
              <!-- 查看模式 -->
              <div v-if="!isEditMode && hasParticipants" class="mt-1 p-3 bg-white border border-gray-300 rounded-md min-h-[76px]">
                <p v-if="departmentParticipants[dept]" class="text-gray-900 whitespace-pre-wrap">
                  {{ formatParticipantsForDisplay(dept) }}
                </p>
                <p v-else class="text-gray-400 italic">暂无参演人员</p>
              </div>
              
              <!-- 编辑模式 -->
              <textarea
                v-else
                v-model="departmentParticipants[dept]"
                class="input mt-1"
                rows="3"
                :placeholder="`请输入${dept}的参演人员姓名，多个人员用逗号或换行分隔\n例如：张三, 李四, 王五`"
              ></textarea>
              
              <p class="text-xs text-gray-500 mt-1">
                已录入: <span class="font-medium text-blue-600">{{ getParticipantCount(dept) }}</span> 人
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
            </svg>
            <span class="text-sm font-medium text-green-800">参演人员总计</span>
          </div>
          <span class="text-2xl font-bold text-green-600">{{ totalParticipants }}</span>
          <span class="text-sm text-green-700">人</span>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3 text-sm text-yellow-700">
            <p class="font-medium">录入说明</p>
            <ul class="mt-1 list-disc list-inside space-y-1">
              <li>请确保录入的人员姓名准确无误</li>
              <li>多个人员可用逗号、分号或换行分隔</li>
              <li>保存后将更新演练实施记录</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-end space-x-4 mt-6 pt-4 border-t">
        <!-- 查看模式 -->
        <template v-if="!isEditMode && hasParticipants">
          <button
            type="button"
            @click="closeModal"
            class="btn btn-secondary"
          >
            关闭
          </button>
          <button
            type="button"
            @click="enterEditMode"
            class="btn btn-primary"
          >
            修改
          </button>
        </template>
        
        <!-- 编辑模式 -->
        <template v-else>
          <button
            type="button"
            @click="cancelEdit"
            class="btn btn-secondary"
          >
            取消
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="isSaving || totalParticipants === 0"
            class="btn btn-primary"
          >
            {{ isSaving ? '保存中...' : '保存' }}
          </button>
        </template>
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
  executionData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

// 表单数据
const participatingDepartments = ref<string[]>([])
const departmentParticipants = ref<Record<string, string>>({})
const originalParticipants = ref<Record<string, string>>({}) // 保存原始数据用于取消
const isSaving = ref(false)
const isEditMode = ref(false) // 是否处于编辑模式
const hasParticipants = ref(false) // 是否已有参演人员数据

// 计算总参演人数
const totalParticipants = computed(() => {
  let total = 0
  Object.values(departmentParticipants.value).forEach(participants => {
    if (participants) {
      // 按逗号、分号或换行分隔
      const names = participants.split(/[,，;；\n]/).filter(name => name.trim())
      total += names.length
    }
  })
  return total
})

// 获取某部门参演人数
const getParticipantCount = (dept: string) => {
  const participants = departmentParticipants.value[dept]
  if (!participants) return 0
  const names = participants.split(/[,，;；\n]/).filter(name => name.trim())
  return names.length
}

// 格式化参演人员用于显示（查看模式）
const formatParticipantsForDisplay = (dept: string) => {
  const participants = departmentParticipants.value[dept]
  if (!participants) return ''
  const names = participants.split(/[,，;；\n]/).filter(name => name.trim())
  return names.join('、')
}

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

// 获取实施模式名称
const getExecutionModeName = (mode: string) => {
  return mode === 'SIMULATION' ? '模拟仿真' : '实战演练'
}

// 初始化表单
const initForm = () => {
  if (props.executionData) {
    // 判断是否已有参演人员
    hasParticipants.value = props.executionData.hasParticipants || false
    isEditMode.value = !hasParticipants.value // 如果没有数据，默认进入编辑模式
    
    // 解析参演部门
    try {
      const depts = typeof props.executionData.participatingDepartments === 'string'
        ? JSON.parse(props.executionData.participatingDepartments)
        : props.executionData.participatingDepartments || []
      participatingDepartments.value = depts

      // 初始化各部门参演人员输入框
      const participants: Record<string, string> = {}
      depts.forEach((dept: string) => {
        participants[dept] = ''
      })

      // 如果已有参演人员数据，回显
      if (props.executionData.participants) {
        try {
          const existingParticipants = typeof props.executionData.participants === 'string'
            ? JSON.parse(props.executionData.participants)
            : props.executionData.participants

          Object.keys(existingParticipants).forEach(dept => {
            if (Array.isArray(existingParticipants[dept])) {
              participants[dept] = existingParticipants[dept].join(', ')
            } else if (typeof existingParticipants[dept] === 'string') {
              participants[dept] = existingParticipants[dept]
            }
          })
        } catch (e) {
          console.error('解析已有参演人员数据失败:', e)
        }
      }

      departmentParticipants.value = participants
      // 保存原始数据
      originalParticipants.value = JSON.parse(JSON.stringify(participants))
    } catch (error) {
      console.error('解析参演部门失败:', error)
      participatingDepartments.value = []
      departmentParticipants.value = {}
    }
  }
}

// 进入编辑模式
const enterEditMode = () => {
  isEditMode.value = true
}

// 取消编辑
const cancelEdit = () => {
  if (hasParticipants.value) {
    // 如果已有数据，恢复原始数据并切换到查看模式
    departmentParticipants.value = JSON.parse(JSON.stringify(originalParticipants.value))
    isEditMode.value = false
  } else {
    // 如果是首次录入，直接关闭
    closeModal()
  }
}

// 重置表单
const resetForm = () => {
  participatingDepartments.value = []
  departmentParticipants.value = {}
  originalParticipants.value = {}
  isEditMode.value = false
  hasParticipants.value = false
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initForm()
  } else {
    resetForm()
  }
})

// 保存参演人员
const handleSave = async () => {
  if (totalParticipants.value === 0) {
    showMessage('请至少录入一个参演人员', 'error')
    return
  }

  isSaving.value = true

  try {
    // 整理参演人员数据
    const participantsData: Record<string, string[]> = {}
    Object.keys(departmentParticipants.value).forEach(dept => {
      const participants = departmentParticipants.value[dept]
      if (participants) {
        // 按逗号、分号或换行分隔，并去除空白
        const names = participants
          .split(/[,，;；\n]/)
          .map(name => name.trim())
          .filter(name => name)
        if (names.length > 0) {
          participantsData[dept] = names
        }
      }
    })

    // 提交到后端
    await request.post(`/drill-executions/${props.executionData.id}/participants`, participantsData)

    showMessage('保存成功！', 'success')
    
    // 更新状态：保存成功后切换到查看模式
    hasParticipants.value = true
    isEditMode.value = false
    // 更新原始数据
    originalParticipants.value = JSON.parse(JSON.stringify(departmentParticipants.value))
    
    // 更新 executionData 的属性，这样点击修改时能正确回显
    if (props.executionData) {
      props.executionData.hasParticipants = true
      // 重要：将保存的数据也更新到 executionData.participants
      // 这样点击【修改】时能正确回显数据
      props.executionData.participants = participantsData
    }

    // 延迟通知父组件刷新列表（但不关闭对话框）
    setTimeout(() => {
      emit('success')
    }, 1500)
  } catch (error: any) {
    console.error('保存参演人员失败:', error)
    showMessage(error.message || '保存失败！', 'error')
  } finally {
    isSaving.value = false
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.label {
  @apply block text-sm font-medium text-gray-700;
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
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>

