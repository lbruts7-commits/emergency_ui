<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">场景登录</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 演练信息 -->
      <div v-if="executionData" class="mt-4 bg-blue-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-900 mb-2">演练场景信息</h4>
        <div class="space-y-1 text-sm text-blue-800">
          <p><span class="font-medium">演练科目：</span>{{ executionData.drillSubject }}</p>
          <p><span class="font-medium">演练类型：</span>{{ executionData.drillType }}</p>
          <p><span class="font-medium">实施模式：</span>模拟仿真</p>
        </div>
      </div>

      <!-- 角色选择 -->
      <div class="mt-4">
        <label class="label required">请选择演练角色</label>
        <select
          v-model="selectedRole"
          class="input mt-1"
          required
        >
          <option value="">请选择您的角色</option>
          <option v-for="role in roles" :key="role.dictCode" :value="role.dictCode">
            {{ role.dictName }}
          </option>
        </select>
        <p class="text-xs text-gray-500 mt-1">选择您在本次演练中担任的角色</p>
      </div>

      <!-- 用户信息(模拟) -->
      <div class="mt-4">
        <label class="label">参演人员姓名</label>
        <input
          v-model="userName"
          type="text"
          class="input mt-1"
          placeholder="请输入您的姓名"
        />
      </div>

      <!-- 登录说明 -->
      <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3 text-sm text-yellow-700">
            <p class="font-medium">登录说明</p>
            <ul class="mt-1 list-disc list-inside space-y-1">
              <li>选择角色后将进入三维演练场景</li>
              <li>请按照演练脚本执行相应操作</li>
              <li>演练过程中请认真完成各项任务</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 演练大厅链接提示 -->
      <div v-if="selectedRole" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-sm text-green-700">
            已选择角色: <span class="font-medium">{{ getRoleName(selectedRole) }}</span>
          </p>
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
          @click="handleLogin"
          :disabled="!selectedRole || isLoggingIn"
          class="btn btn-primary"
        >
          {{ isLoggingIn ? '登录中...' : '登录演练' }}
        </button>
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
const selectedRole = ref('')
const userName = ref('')
const roles = ref([])
const isLoggingIn = ref(false)

// 加载演练角色字典
const loadRoles = async () => {
  try {
    const response = await request.get('/dictionaries/type/DRILL_ROLE')
    roles.value = response.data || []
  } catch (error) {
    console.error('加载演练角色失败:', error)
    showMessage('加载演练角色失败', 'error')
  }
}

// 获取角色名称
const getRoleName = (roleCode: string) => {
  const role = roles.value.find((r: any) => r.dictCode === roleCode)
  return role?.dictName || roleCode
}

// 重置表单
const resetForm = () => {
  selectedRole.value = ''
  userName.value = ''
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadRoles()
    // 可以从用户信息中获取姓名
    userName.value = '当前用户' // 临时值
  } else {
    resetForm()
  }
})

// 登录演练
const handleLogin = async () => {
  if (!selectedRole.value) {
    showMessage('请选择演练角色', 'error')
    return
  }

  isLoggingIn.value = true
  
  try {
    // 记录用户登录信息
    const loginData = {
      executionId: props.executionData.id,
      role: selectedRole.value,
      userName: userName.value
    }

    console.log('登录演练大厅:', loginData)

    // 模拟登录过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 获取场景URL
    const scenarioUrl = props.executionData.scenarioUrl || '/scenario-hall'
    
    showMessage('登录成功，正在进入演练大厅...', 'success')
    
    // 延迟后跳转到演练大厅
    setTimeout(() => {
      // 实际应该打开3D场景页面
      // window.open(scenarioUrl, '_blank')
      
      // 当前版本显示提示
      alert(`演练大厅功能开发中\n\n角色: ${getRoleName(selectedRole.value)}\n参演人员: ${userName.value}\n\n实际使用时会跳转到3D演练场景`)
      
      emit('success')
      emit('close')
    }, 1500)
  } catch (error: any) {
    console.error('登录失败:', error)
    showMessage('登录失败', 'error')
  } finally {
    isLoggingIn.value = false
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 初始化
onMounted(() => {
  if (props.visible) {
    loadRoles()
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

