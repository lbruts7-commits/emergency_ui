<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面头部 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">演练档案管理</h1>
          <p class="text-gray-600 mt-2">查看演练档案信息，包含演练全过程记录</p>
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
            <label class="label">关联预案</label>
            <input
              v-model="searchForm.relatedPlanName"
              type="text"
              class="input"
              placeholder="请输入关联预案名称"
            />
          </div>
          <div>
            <label class="label">参演部门</label>
            <input
              v-model="searchForm.participatingDept"
              type="text"
              class="input"
              placeholder="请输入参演部门"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="resetSearch" class="btn btn-secondary">
            重置
          </button>
          <button @click="searchArchives" class="btn btn-primary">
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
                  档案类型
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- 空状态 -->
              <tr v-if="archives.length === 0">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                  <p class="mt-2">暂无演练档案数据</p>
                  <p class="text-xs mt-1 text-gray-400">演练评估完成并上传评估报告后会自动生成档案</p>
                </td>
              </tr>
              <!-- 数据行 -->
              <tr v-for="(item, index) in archives" :key="item.id">
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
                  <span :class="getArchiveTypeClass(item.executionMode)">
                    {{ getArchiveTypeName(item.executionMode) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="showDetail(item)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    详情
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
    <DrillArchiveDetailModal
      :visible="showDetailModal"
      :archive-data="currentArchive"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'
import DrillArchiveDetailModal from '@/components/DrillArchiveDetailModal.vue'

// 响应式数据
const showDetailModal = ref(false)
const currentArchive = ref(null)

// 查询表单
const searchForm = ref({
  drillSubject: '',
  drillType: '',
  relatedPlanName: '',
  participatingDept: ''
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const archives = ref([])

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 加载演练档案列表
const loadArchives = async () => {
  try {
    const params: any = {
      drillSubject: searchForm.value.drillSubject,
      drillType: searchForm.value.drillType,
      relatedPlanName: searchForm.value.relatedPlanName,
      participatingDept: searchForm.value.participatingDept,
      page: currentPage.value - 1,
      size: pageSize.value
    }

    const response = await request.get('/drill-archives', { params })

    if (response.data) {
      archives.value = response.data.content || []
      total.value = response.data.totalElements || 0
    } else {
      archives.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    showMessage('加载数据失败', 'error')
    archives.value = []
    total.value = 0
  }
}

const searchArchives = () => {
  currentPage.value = 1
  loadArchives()
}

const resetSearch = () => {
  searchForm.value = {
    drillSubject: '',
    drillType: '',
    relatedPlanName: '',
    participatingDept: ''
  }
  searchArchives()
}

// 显示详情
const showDetail = (item: any) => {
  currentArchive.value = item
  showDetailModal.value = true
}

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadArchives()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadArchives()
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

const getArchiveTypeName = (mode: string) => {
  return mode === 'SIMULATION' ? '模拟演练档案' : '实战演练档案'
}

const getArchiveTypeClass = (mode: string) => {
  return mode === 'SIMULATION'
    ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'
    : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'
}

// 生命周期
onMounted(() => {
  loadArchives()
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




