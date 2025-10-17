<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">实战信息录入</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="mt-4 max-h-[60vh] overflow-y-auto">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- 演练开始时间 -->
            <div>
              <label class="label required">演练开始时间</label>
              <input
                v-model="formData.startTime"
                type="datetime-local"
                class="input"
                required
              />
            </div>

            <!-- 演练结束时间 -->
            <div>
              <label class="label required">演练结束时间</label>
              <input
                v-model="formData.endTime"
                type="datetime-local"
                class="input"
                required
              />
            </div>

            <!-- 参演部门 -->
            <div>
              <label class="label required">参演部门</label>
              <select
                v-model="formData.participatingDepartments"
                multiple
                class="input"
                style="min-height: 100px;"
                required
              >
                <option v-for="dept in departments" :key="dept.id" :value="dept.orgName">
                  {{ dept.orgName }}
                </option>
              </select>
              <span class="text-xs text-gray-500 mt-1">按住Ctrl可多选</span>
            </div>

            <!-- 参演人员 -->
            <div>
              <label class="label required">参演人员</label>
              <textarea
                v-model="formData.participants"
                class="input"
                rows="4"
                placeholder="请输入参演人员信息，例如：&#10;应急管理部：张三、李四、王五&#10;消防救援部：赵六、钱七"
                required
              ></textarea>
              <span class="text-xs text-gray-500 mt-1">请按部门分行录入参演人员姓名</span>
            </div>

            <!-- 演练过程描述 -->
            <div>
              <label class="label">演练过程描述</label>
              <textarea
                v-model="formData.executionProcess"
                class="input"
                rows="6"
                placeholder="请详细描述演练过程，包括各个阶段的执行情况、遇到的问题、解决方案等"
              ></textarea>
            </div>

            <!-- 演练过程文档上传说明 -->
            <div>
              <label class="label">演练过程文档</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>选择文件上传</span>
                      <input
                        type="file"
                        class="sr-only"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        @change="handleFileChange"
                      />
                    </label>
                    <p class="pl-1">或拖拽文件到此处</p>
                  </div>
                  <p class="text-xs text-gray-500">
                    支持 PDF, Word, 图片格式，单个文件不超过10MB
                  </p>
                </div>
              </div>
              <!-- 已选文件列表 -->
              <div v-if="selectedFiles.length > 0" class="mt-2">
                <p class="text-sm font-medium text-gray-700">已选择 {{ selectedFiles.length }} 个文件:</p>
                <ul class="mt-1 space-y-1">
                  <li v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between text-sm text-gray-600">
                    <span>{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                    <button
                      type="button"
                      @click="removeFile(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex justify-end space-x-4 mt-6 pt-4 border-t">
            <button
              type="button"
              @click="closeModal"
              class="btn btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '提交' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
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
const formData = ref({
  executionId: 0,
  startTime: '',
  endTime: '',
  participatingDepartments: [] as string[],
  participants: '',
  executionProcess: '',
  processDocuments: ''
})

// 部门数据
const departments = ref([])

// 文件相关
const selectedFiles = ref<File[]>([])

const isSubmitting = ref(false)

// 加载部门数据
const loadDepartments = async () => {
  try {
    const response = await request.get('/departments')
    departments.value = response.data || []
  } catch (error) {
    console.error('加载部门数据失败:', error)
  }
}

// 文件选择处理
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const files = Array.from(target.files)
    // 验证文件大小
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showMessage(`文件 ${file.name} 超过10MB，已跳过`, 'warning')
        return false
      }
      return true
    })
    selectedFiles.value.push(...validFiles)
  }
}

// 移除文件
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 重置表单
const resetForm = () => {
  formData.value = {
    executionId: 0,
    startTime: '',
    endTime: '',
    participatingDepartments: [],
    participants: '',
    executionProcess: '',
    processDocuments: ''
  }
  selectedFiles.value = []
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadDepartments()
    if (props.executionData) {
      formData.value.executionId = props.executionData.id
      // 如果有已保存的数据，填充到表单
      if (props.executionData.startTime) {
        formData.value.startTime = props.executionData.startTime.slice(0, 16)
      }
      if (props.executionData.endTime) {
        formData.value.endTime = props.executionData.endTime.slice(0, 16)
      }
      if (props.executionData.participatingDepartments) {
        formData.value.participatingDepartments = props.executionData.participatingDepartments
      }
    }
  } else {
    resetForm()
  }
})

// 提交表单
const handleSubmit = async () => {
  // 验证结束时间晚于开始时间
  if (formData.value.endTime <= formData.value.startTime) {
    showMessage('结束时间必须晚于开始时间', 'error')
    return
  }

  isSubmitting.value = true
  
  try {
    // 准备提交数据
    const submitData = {
      executionId: formData.value.executionId,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
      participatingDepartments: formData.value.participatingDepartments,
      participants: formData.value.participants,
      executionProcess: formData.value.executionProcess,
      processDocuments: selectedFiles.value.map(f => f.name).join(',') // 简化处理，实际应上传文件
    }

    await request.post('/drill-executions/actual-info', submitData)
    
    showMessage('提交成功!', 'success')
    
    // 延迟关闭，显示成功消息
    setTimeout(() => {
      emit('success')
      emit('close')
    }, 1500)
  } catch (error: any) {
    console.error('提交失败:', error)
    showMessage(error.response?.data?.message || '提交失败', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 初始化
onMounted(() => {
  if (props.visible) {
    loadDepartments()
  }
})
</script>

<style scoped>
.label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}
</style>



