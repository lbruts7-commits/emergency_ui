<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面头部 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">演练实施管理</h1>
          <p class="text-gray-600 mt-2">管理应急演练实施，包括场景搭建、实战信息录入和参演人员管理</p>
        </div>
      </div>

      <!-- 查询筛选区域 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="label">演练科目</label>
            <input
              v-model="searchForm.subject"
              type="text"
              class="input"
              placeholder="请输入演练科目"
            />
          </div>
          <div>
            <label class="label">演练类型</label>
            <select v-model="searchForm.type" class="input">
              <option value="">全部</option>
              <option value="FIRE_DRILL">消防演练</option>
              <option value="EARTHQUAKE_DRILL">地震演练</option>
              <option value="FLOOD_DRILL">防洪演练</option>
              <option value="MEDICAL_DRILL">医疗救援演练</option>
              <option value="EVACUATION_DRILL">疏散演练</option>
              <option value="NUCLEAR_DRILL">核事故演练</option>
              <option value="CHEMICAL_DRILL">化学事故演练</option>
            </select>
          </div>
          <div>
            <label class="label">参演部门</label>
            <select v-model="searchForm.participantDepts" multiple class="input" style="min-height: 38px;">
              <option v-for="dept in departments" :key="dept.id" :value="dept.name">
                {{ dept.name }}
              </option>
            </select>
            <span class="text-xs text-gray-500 mt-1">按住Ctrl可多选</span>
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="resetSearch" class="btn btn-secondary">
            重置
          </button>
          <button @click="searchExecutions" class="btn btn-primary">
            查询
          </button>
        </div>
      </div>

      <!-- 列表区域 -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  序号
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  科目
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  实施模式
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  预案
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  参演部门
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  演练时间
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- 空状态 -->
              <tr v-if="executions.length === 0">
                <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="mt-2">暂无演练实施数据</p>
                </td>
              </tr>
              <!-- 数据行 -->
              <tr v-for="(item, index) in executions" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.drillSubject }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getDrillTypeName(item.drillType) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getExecutionModeClass(item.executionMode)">
                    {{ getExecutionModeName(item.executionMode) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.relatedPlanName || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.participatingDepartments?.join('、') || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <template v-if="item.startTime && item.endTime">
                    {{ formatDateTime(item.startTime) }} ~ {{ formatDateTime(item.endTime) }}
                  </template>
                  <template v-else-if="item.startTime">
                    {{ formatDateTime(item.startTime) }}
                  </template>
                  <template v-else>
                    <span class="text-gray-400">待安排</span>
                  </template>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(item.status)">
                    {{ getStatusText(item.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    v-if="item.executionMode === 'SIMULATION' && item.status === 'PENDING'"
                    @click="showScenarioBuilder(item)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    场景搭建
                  </button>
                  <button
                    v-if="item.executionMode === 'ACTUAL' && item.status === 'PENDING'"
                    @click="showActualInfoInput(item)"
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    信息录入
                  </button>
                  <button
                    v-if="item.status === 'SCENARIO_COMPLETED'"
                    @click="showLogin(item)"
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    登录演练
                  </button>
                  <button
                    v-if="item.status === 'IN_PROGRESS'"
                    @click="completeExecution(item.id)"
                    class="text-yellow-600 hover:text-yellow-900 mr-3"
                  >
                    完成演练
                  </button>
                  <button
                    v-if="item.status === 'COMPLETED'"
                    @click="showParticipantsInput(item)"
                    class="text-purple-600 hover:text-purple-900 mr-3"
                  >
                    {{ item.hasParticipants ? '修改人员' : '录入人员' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                显示第 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到
                <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span> 条，
                共 <span class="font-medium">{{ total }}</span> 条记录
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  上一页
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  下一页
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 场景搭建Modal -->
    <ScenarioBuilderModal
      :visible="showScenarioModal"
      :execution-data="currentExecution"
      @close="showScenarioModal = false"
      @success="handleScenarioSuccess"
    />

    <!-- 实战信息录入Modal -->
    <ActualInfoInputModal
      :visible="showActualInfoModal"
      :execution-data="currentExecution"
      @close="showActualInfoModal = false"
      @success="handleActualInfoSuccess"
    />

    <!-- 场景登录Modal -->
    <ScenarioLoginModal
      :visible="showLoginModal"
      :execution-data="currentExecution"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />

    <!-- 参演人员录入Modal -->
    <ParticipantsInputModal
      :visible="showParticipantsModal"
      :execution-data="currentExecution"
      @close="showParticipantsModal = false"
      @success="handleParticipantsSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'
import ScenarioBuilderModal from '@/components/ScenarioBuilderModal.vue'
import ActualInfoInputModal from '@/components/ActualInfoInputModal.vue'
import ScenarioLoginModal from '@/components/ScenarioLoginModal.vue'
import ParticipantsInputModal from '@/components/ParticipantsInputModal.vue'

// 响应式数据
const departments = ref([])
const showScenarioModal = ref(false)
const showActualInfoModal = ref(false)
const showLoginModal = ref(false)
const showParticipantsModal = ref(false)
const currentExecution = ref(null)

// 查询表单
const searchForm = ref({
  subject: '',
  type: '',
  participantDepts: []
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const executions = ref([])

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 加载部门数据
const loadDepartments = async () => {
  try {
    const response = await request.get('/departments')
    departments.value = response.data || []
  } catch (error) {
    console.error('加载部门数据失败:', error)
  }
}

// 加载演练实施列表
const loadExecutions = async () => {
  try {
    const params: any = {
      drillSubject: searchForm.value.subject,
      drillType: searchForm.value.type,
      page: currentPage.value - 1,
      size: pageSize.value
    }

    if (searchForm.value.participantDepts && searchForm.value.participantDepts.length > 0) {
      params.participatingDepartments = searchForm.value.participantDepts.join(',')
    }

    const response = await request.get('/drill-executions', { params })

    if (response.data) {
      executions.value = response.data.content || []
      total.value = response.data.totalElements || 0
    } else {
      executions.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    showMessage('加载数据失败', 'error')
    executions.value = []
    total.value = 0
  }
}

const searchExecutions = () => {
  currentPage.value = 1
  loadExecutions()
}

const resetSearch = () => {
  searchForm.value = {
    subject: '',
    type: '',
    participantDepts: []
  }
  searchExecutions()
}

// 场景搭建
const showScenarioBuilder = (item: any) => {
  currentExecution.value = item
  showScenarioModal.value = true
}

// 场景搭建成功回调
const handleScenarioSuccess = () => {
  showScenarioModal.value = false
  currentExecution.value = null
  loadExecutions()
}

// 实战信息录入
const showActualInfoInput = (item: any) => {
  currentExecution.value = item
  showActualInfoModal.value = true
}

// 实战信息录入成功回调
const handleActualInfoSuccess = () => {
  showActualInfoModal.value = false
  currentExecution.value = null
  loadExecutions()
}

// 场景登录
const showLogin = (item: any) => {
  currentExecution.value = item
  showLoginModal.value = true
}

// 场景登录成功回调
const handleLoginSuccess = async () => {
  showLoginModal.value = false
  // 登录后自动开始演练
  if (currentExecution.value) {
    try {
      await request.post(`/drill-executions/${currentExecution.value.id}/start`)
      currentExecution.value = null
      loadExecutions()
    } catch (error) {
      console.error('开始演练失败:', error)
    }
  }
}

// 完成演练
const completeExecution = async (id: number) => {
  if (confirm('确定要完成此演练吗?')) {
    try {
      await request.post(`/drill-executions/${id}/complete`)
      showMessage('演练已完成', 'success')
      loadExecutions()
    } catch (error) {
      showMessage('操作失败', 'error')
    }
  }
}

// 参演人员录入
const showParticipantsInput = (item: any) => {
  currentExecution.value = item
  showParticipantsModal.value = true
}

// 参演人员录入成功回调
const handleParticipantsSuccess = async () => {
  // 刷新列表以获取最新的 hasParticipants 状态
  await loadExecutions()
  // 如果 currentExecution 存在，更新它的 hasParticipants
  if (currentExecution.value) {
    const updated = executions.value.find(e => e.id === currentExecution.value.id)
    if (updated) {
      currentExecution.value = updated
    }
  }
  // 注意：不关闭对话框，让用户可以继续查看或修改
}

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadExecutions()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadExecutions()
  }
}

// 工具方法
const formatDateTime = (date: string) => {
  if (!date) return '-'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

const getDrillTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'FIRE_DRILL': '消防演练',
    'EARTHQUAKE_DRILL': '地震演练',
    'FLOOD_DRILL': '防洪演练',
    'MEDICAL_DRILL': '医疗救援演练',
    'EVACUATION_DRILL': '疏散演练',
    'NUCLEAR_DRILL': '核事故演练',
    'CHEMICAL_DRILL': '化学事故演练'
  }
  return typeMap[type] || type
}

const getExecutionModeName = (mode: string) => {
  const modeMap: Record<string, string> = {
    'SIMULATION': '模拟仿真',
    'ACTUAL': '实战演练'
  }
  return modeMap[mode] || mode
}

const getExecutionModeClass = (mode: string) => {
  const classMap: Record<string, string> = {
    'SIMULATION': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800',
    'ACTUAL': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'
  }
  return classMap[mode] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
  const statusLower = status?.toLowerCase() || ''
  const classes: Record<string, string> = {
    'pending': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800',
    'scenario_building': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    'scenario_completed': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800',
    'in_progress': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    'completed': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    'cancelled': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[statusLower] || classes['pending']
}

const getStatusText = (status: string) => {
  const statusLower = status?.toLowerCase() || ''
  const texts: Record<string, string> = {
    'pending': '待开始',
    'scenario_building': '场景搭建中',
    'scenario_completed': '场景搭建完成',
    'in_progress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return texts[statusLower] || '未知'
}

// 生命周期
onMounted(() => {
  loadDepartments()
  loadExecutions()
})
</script>

