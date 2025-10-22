<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面头部 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">演练评估管理</h1>
          <p class="text-gray-600 mt-2">查看演练评估信息，上传评估报告</p>
        </div>
      </div>

      <!-- 查询筛选区域 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="label">演练科目</label>
            <input
              v-model="searchForm.drillSubject"
              type="text"
              class="input"
              placeholder="请输入演练科目"
            />
          </div>
          <div>
            <label class="label">应急演练类型</label>
            <select v-model="searchForm.drillType" class="input">
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
            <label class="label">演练时间-开始</label>
            <input
              v-model="searchForm.startTime"
              type="datetime-local"
              class="input"
            />
          </div>
          <div>
            <label class="label">演练时间-结束</label>
            <input
              v-model="searchForm.endTime"
              type="datetime-local"
              class="input"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="resetSearch" class="btn btn-secondary">
            重置
          </button>
          <button @click="searchEvaluations" class="btn btn-primary">
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
                  演练科目
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  应急演练类型
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  演练时间
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  参演部门
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  关联预案
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  评估状态
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- 空状态 -->
              <tr v-if="evaluations.length === 0">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="mt-2">暂无演练评估数据</p>
                </td>
              </tr>
              <!-- 数据行 -->
              <tr v-for="(item, index) in evaluations" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.drillSubject }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getDrillTypeName(item.drillType) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDateTime(item.drillTime) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div class="max-w-xs truncate" :title="item.participatingDepartments?.join('、')">
                    {{ item.participatingDepartments?.join('、') || '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div class="max-w-xs truncate" :title="item.relatedPlanName">
                    {{ item.relatedPlanName || '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getEvaluationStatusClass(item.hasReports)">
                    {{ getEvaluationStatusText(item.hasReports) }}
                  </span>
                  <span v-if="item.hasReports && item.evaluationReports" class="ml-2 text-xs text-gray-500">
                    ({{ item.evaluationReports.length }}份)
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="showDetail(item)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    详情
                  </button>
                  <button
                    @click="showUploadModal(item)"
                    class="text-green-600 hover:text-green-900"
                  >
                    上传评估总结
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

    <!-- 详情Modal -->
    <DrillEvaluationDetailModal
      :visible="showDetailModal"
      :evaluation-data="currentEvaluation"
      @close="showDetailModal = false"
      @refresh="handleDetailRefresh"
    />

    <!-- 上传评估报告Modal -->
    <DrillEvaluationUploadModal
      :visible="showUploadModalVisible"
      :evaluation-data="currentEvaluation"
      @close="showUploadModalVisible = false"
      @success="handleUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'
import DrillEvaluationDetailModal from '@/components/DrillEvaluationDetailModal.vue'
import DrillEvaluationUploadModal from '@/components/DrillEvaluationUploadModal.vue'

// 响应式数据
const showDetailModal = ref(false)
const showUploadModalVisible = ref(false)
const currentEvaluation = ref(null)

// 查询表单
const searchForm = ref({
  drillSubject: '',
  drillType: '',
  startTime: '',
  endTime: ''
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const evaluations = ref([])

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 加载演练评估列表
const loadEvaluations = async () => {
  try {
    const params: any = {
      drillSubject: searchForm.value.drillSubject,
      drillType: searchForm.value.drillType,
      page: currentPage.value - 1,
      size: pageSize.value
    }

    // 时间格式转换
    if (searchForm.value.startTime) {
      params.startTime = new Date(searchForm.value.startTime).toISOString()
    }
    if (searchForm.value.endTime) {
      params.endTime = new Date(searchForm.value.endTime).toISOString()
    }

    const response = await request.get('/drill-evaluations', { params })

    if (response.data) {
      evaluations.value = response.data.content || []
      total.value = response.data.totalElements || 0
    } else {
      evaluations.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    showMessage('加载数据失败', 'error')
    evaluations.value = []
    total.value = 0
  }
}

const searchEvaluations = () => {
  currentPage.value = 1
  loadEvaluations()
}

const resetSearch = () => {
  searchForm.value = {
    drillSubject: '',
    drillType: '',
    startTime: '',
    endTime: ''
  }
  searchEvaluations()
}

// 显示详情
const showDetail = (item: any) => {
  currentEvaluation.value = item
  showDetailModal.value = true
}

// 显示上传弹窗
const showUploadModal = (item: any) => {
  currentEvaluation.value = item
  showUploadModalVisible.value = true
}

// 上传成功回调
const handleUploadSuccess = () => {
  showUploadModalVisible.value = false
  currentEvaluation.value = null
  loadEvaluations()
}

// 详情刷新回调（删除附件后）
const handleDetailRefresh = async () => {
  try {
    // 刷新列表数据
    await loadEvaluations()
    
    // 如果详情对话框还在打开状态，重新获取最新的评估详情
    if (currentEvaluation.value && showDetailModal.value) {
      const evaluationId = currentEvaluation.value.id
      const response = await request.get(`/drill-evaluations/${evaluationId}`)
      if (response.data) {
        // 更新当前评估数据为最新数据
        currentEvaluation.value = response.data
      }
    }
  } catch (error) {
    console.error('刷新评估详情失败:', error)
  }
}

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadEvaluations()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadEvaluations()
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

const getEvaluationStatusClass = (hasReports: boolean) => {
  return hasReports
    ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
    : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
}

const getEvaluationStatusText = (hasReports: boolean) => {
  return hasReports ? '已上传' : '待上传'
}

// 生命周期
onMounted(() => {
  loadEvaluations()
})
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
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>

