<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">开始演练实施</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 方案信息 -->
      <div v-if="planData" class="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-900 mb-2">演练方案信息</h4>
        <div class="space-y-1 text-sm">
          <p><span class="text-gray-500">演练科目：</span>{{ planData.drillSubject }}</p>
          <p><span class="text-gray-500">演练类型：</span>{{ planData.drillType }}</p>
          <p><span class="text-gray-500">关联预案：</span>{{ planData.relatedPlanName }}</p>
        </div>
      </div>

      <!-- 选择实施模式 -->
      <div class="mt-4">
        <label class="label required">请选择实施模式</label>
        <div class="space-y-3 mt-2">
          <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                 :class="{ 'border-purple-500 bg-purple-50': selectedMode === 'SIMULATION' }">
            <input
              type="radio"
              v-model="selectedMode"
              value="SIMULATION"
              class="mt-1 mr-3"
            />
            <div>
              <div class="font-medium text-gray-900">🎮 模拟仿真演练</div>
              <p class="text-sm text-gray-500 mt-1">
                在虚拟3D环境中进行演练<br/>
                需要先搭建场景，参演人员登录演练大厅参与
              </p>
            </div>
          </label>

          <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                 :class="{ 'border-orange-500 bg-orange-50': selectedMode === 'ACTUAL' }">
            <input
              type="radio"
              v-model="selectedMode"
              value="ACTUAL"
              class="mt-1 mr-3"
            />
            <div>
              <div class="font-medium text-gray-900">🏃 实战演练</div>
              <p class="text-sm text-gray-500 mt-1">
                在真实环境中进行演练<br/>
                直接录入实际演练的时间、人员和过程信息
              </p>
            </div>
          </label>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3 text-sm text-blue-700">
            <p>创建后将进入演练实施管理，根据所选模式进行相应操作</p>
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
          type="button"
          @click="handleCreate"
          :disabled="!selectedMode || isCreating"
          class="btn btn-primary"
        >
          {{ isCreating ? '创建中...' : '确认创建' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'
import { useRouter } from 'vue-router'

const props = defineProps<{
  visible: boolean
  planData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const router = useRouter()

const selectedMode = ref('')
const isCreating = ref(false)

// 重置选择
const resetForm = () => {
  selectedMode.value = ''
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

// 创建演练实施
const handleCreate = async () => {
  if (!selectedMode.value) {
    showMessage('请选择实施模式', 'error')
    return
  }

  isCreating.value = true
  
  try {
    await request.post('/drill-executions', null, {
      params: {
        planId: props.planData.id,
        executionMode: selectedMode.value
      }
    })
    
    showMessage('演练实施创建成功!', 'success')
    
    // 延迟后跳转到演练实施页面
    setTimeout(() => {
      emit('success')
      emit('close')
      router.push('/drill-executions')
    }, 1500)
  } catch (error: any) {
    console.error('创建失败:', error)
    showMessage(error.response?.data?.message || '创建失败', 'error')
  } finally {
    isCreating.value = false
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}
</style>


