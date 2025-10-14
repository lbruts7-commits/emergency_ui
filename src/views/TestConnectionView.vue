<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">前后端连接测试</h1>
        
        <!-- 后端健康检查 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">后端健康检查</h2>
          <div class="flex items-center space-x-4">
            <button 
              @click="testHealthCheck"
              :disabled="loading.health"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {{ loading.health ? '检查中...' : '检查后端状态' }}
            </button>
            <div v-if="result.health" class="flex items-center space-x-2">
              <span :class="result.health.success ? 'text-green-600' : 'text-red-600'">
                {{ result.health.success ? '✓' : '✗' }}
              </span>
              <span :class="result.health.success ? 'text-green-600' : 'text-red-600'">
                {{ result.health.message }}
              </span>
            </div>
          </div>
          <div v-if="result.health && result.health.data" class="mt-2 text-sm text-gray-600">
            <pre>{{ JSON.stringify(result.health.data, null, 2) }}</pre>
          </div>
        </div>

        <!-- 用户API测试 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">用户API测试</h2>
          <div class="flex items-center space-x-4">
            <button 
              @click="testUserApi"
              :disabled="loading.users"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {{ loading.users ? '获取中...' : '获取用户列表' }}
            </button>
            <div v-if="result.users" class="flex items-center space-x-2">
              <span :class="result.users.success ? 'text-green-600' : 'text-red-600'">
                {{ result.users.success ? '✓' : '✗' }}
              </span>
              <span :class="result.users.success ? 'text-green-600' : 'text-red-600'">
                {{ result.users.message }}
              </span>
            </div>
          </div>
          <div v-if="result.users && result.users.data" class="mt-2 text-sm text-gray-600">
            <pre>{{ JSON.stringify(result.users.data, null, 2) }}</pre>
          </div>
        </div>

        <!-- 字典API测试 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">字典API测试</h2>
          <div class="flex items-center space-x-4">
            <button 
              @click="testDictionaryApi"
              :disabled="loading.dictionaries"
              class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {{ loading.dictionaries ? '获取中...' : '获取演练类型字典' }}
            </button>
            <div v-if="result.dictionaries" class="flex items-center space-x-2">
              <span :class="result.dictionaries.success ? 'text-green-600' : 'text-red-600'">
                {{ result.dictionaries.success ? '✓' : '✗' }}
              </span>
              <span :class="result.dictionaries.success ? 'text-green-600' : 'text-red-600'">
                {{ result.dictionaries.message }}
              </span>
            </div>
          </div>
          <div v-if="result.dictionaries && result.dictionaries.data" class="mt-2 text-sm text-gray-600">
            <pre>{{ JSON.stringify(result.dictionaries.data, null, 2) }}</pre>
          </div>
        </div>

        <!-- 组织架构API测试 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">组织架构API测试</h2>
          <div class="flex items-center space-x-4">
            <button 
              @click="testOrganizationApi"
              :disabled="loading.organizations"
              class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {{ loading.organizations ? '获取中...' : '获取部门列表' }}
            </button>
            <div v-if="result.organizations" class="flex items-center space-x-2">
              <span :class="result.organizations.success ? 'text-green-600' : 'text-red-600'">
                {{ result.organizations.success ? '✓' : '✗' }}
              </span>
              <span :class="result.organizations.success ? 'text-green-600' : 'text-red-600'">
                {{ result.organizations.message }}
              </span>
            </div>
          </div>
          <div v-if="result.organizations && result.organizations.data" class="mt-2 text-sm text-gray-600">
            <pre>{{ JSON.stringify(result.organizations.data, null, 2) }}</pre>
          </div>
        </div>

        <!-- 预案API测试 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">预案API测试</h2>
          <div class="flex items-center space-x-4">
            <button 
              @click="testEmergencyPlanApi"
              :disabled="loading.emergencyPlans"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {{ loading.emergencyPlans ? '获取中...' : '获取预案列表' }}
            </button>
            <div v-if="result.emergencyPlans" class="flex items-center space-x-2">
              <span :class="result.emergencyPlans.success ? 'text-green-600' : 'text-red-600'">
                {{ result.emergencyPlans.success ? '✓' : '✗' }}
              </span>
              <span :class="result.emergencyPlans.success ? 'text-green-600' : 'text-red-600'">
                {{ result.emergencyPlans.message }}
              </span>
            </div>
          </div>
          <div v-if="result.emergencyPlans && result.emergencyPlans.data" class="mt-2 text-sm text-gray-600">
            <pre>{{ JSON.stringify(result.emergencyPlans.data, null, 2) }}</pre>
          </div>
        </div>

        <!-- 错误信息显示 -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 class="text-sm font-medium text-red-800">错误信息：</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { userApi, dictionaryApi, organizationApi, emergencyPlanApi } from '@/api/index'

// 响应式数据
const loading = reactive({
  health: false,
  users: false,
  dictionaries: false,
  organizations: false,
  emergencyPlans: false
})

const result = reactive({
  health: null as any,
  users: null as any,
  dictionaries: null as any,
  organizations: null as any,
  emergencyPlans: null as any
})

const error = ref('')

// 测试后端健康检查
const testHealthCheck = async () => {
  loading.health = true
  error.value = ''
  try {
    const response = await fetch('/api/health')
    const data = await response.json()
    result.health = {
      success: response.ok,
      message: response.ok ? '后端服务正常' : '后端服务异常',
      data: data
    }
  } catch (err) {
    result.health = {
      success: false,
      message: '无法连接到后端服务',
      data: null
    }
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.health = false
  }
}

// 测试用户API
const testUserApi = async () => {
  loading.users = true
  error.value = ''
  try {
    const response = await userApi.getUsers()
    result.users = {
      success: true,
      message: `获取到 ${response.data?.length || 0} 个用户`,
      data: response.data
    }
  } catch (err) {
    result.users = {
      success: false,
      message: '获取用户列表失败',
      data: null
    }
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.users = false
  }
}

// 测试字典API
const testDictionaryApi = async () => {
  loading.dictionaries = true
  error.value = ''
  try {
    const response = await dictionaryApi.getDrillTypes()
    result.dictionaries = {
      success: true,
      message: `获取到 ${response.data?.length || 0} 个演练类型`,
      data: response.data
    }
  } catch (err) {
    result.dictionaries = {
      success: false,
      message: '获取演练类型字典失败',
      data: null
    }
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.dictionaries = false
  }
}

// 测试组织架构API
const testOrganizationApi = async () => {
  loading.organizations = true
  error.value = ''
  try {
    const response = await organizationApi.getAllDepartments()
    result.organizations = {
      success: true,
      message: `获取到 ${response.data?.length || 0} 个部门`,
      data: response.data
    }
  } catch (err) {
    result.organizations = {
      success: false,
      message: '获取部门列表失败',
      data: null
    }
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.organizations = false
  }
}

// 测试预案API
const testEmergencyPlanApi = async () => {
  loading.emergencyPlans = true
  error.value = ''
  try {
    const response = await emergencyPlanApi.getAllActiveEmergencyPlans()
    result.emergencyPlans = {
      success: true,
      message: `获取到 ${response.data?.length || 0} 个预案`,
      data: response.data
    }
  } catch (err) {
    result.emergencyPlans = {
      success: false,
      message: '获取预案列表失败',
      data: null
    }
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.emergencyPlans = false
  }
}
</script>
