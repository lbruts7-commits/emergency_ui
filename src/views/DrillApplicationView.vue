<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面头部 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">演练申请管理</h1>
          <p class="text-gray-600 mt-2">管理应急演练申请，包括新增、查看、查询和批量导入</p>
        </div>
        <div class="flex space-x-4">
          <button
            @click="showImportModal = true"
            class="btn btn-secondary"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            批量导入
          </button>
          <button
            @click="handleAddClick"
            class="btn btn-primary"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            新增申请
          </button>
        </div>
      </div>

      <!-- 查询筛选区域 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label class="label">计划参演部门</label>
            <input
              v-model="searchForm.participantDept"
              type="text"
              class="input"
              placeholder="请输入参演部门"
            />
          </div>
          <div>
            <label class="label">组织部门/科室</label>
            <input
              v-model="searchForm.organizerDept"
              type="text"
              class="input"
              placeholder="请输入组织部门/科室"
            />
          </div>
          <div>
            <label class="label">计划时间</label>
            <input
              v-model="searchForm.planTime"
              type="date"
              class="input"
            />
          </div>
          <div>
            <label class="label">状态</label>
            <select v-model="searchForm.status" class="input">
              <option value="">全部</option>
              <option value="DRAFT">草稿</option>
              <option value="SUBMITTED">已提交</option>
              <option value="APPROVED">已审核</option>
              <option value="REJECTED">已驳回</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="resetSearch" class="btn btn-secondary">
            重置
          </button>
          <button @click="searchApplications" class="btn btn-primary">
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
                  演练类型
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  关联预案
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  计划演练时间
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  计划参演部门
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  组织部门/科室
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建人
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
              <tr v-for="(item, index) in applications" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ item.drillSubject }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getDrillTypeName(item.drillType) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.relatedPlanName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(item.plannedDrillTime) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div v-if="item.participatingDepartments && item.participatingDepartments.length > 0">
                    <span 
                      v-for="(dept, idx) in item.participatingDepartments.slice(0, 2)" 
                      :key="idx"
                      class="inline-block px-2 py-0.5 mr-1 mb-1 text-xs bg-blue-100 text-blue-800 rounded"
                    >
                      {{ dept }}
                    </span>
                    <span v-if="item.participatingDepartments.length > 2" class="text-xs text-gray-500">
                      +{{ item.participatingDepartments.length - 2 }}
                    </span>
                  </div>
                  <span v-else>-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.organizationDepartment }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.applicantName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(item.status)" class="inline-flex items-center">
                    <span class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(item.status)"></span>
                    {{ getStatusText(item.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewDetail(item)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    详情
                  </button>
                  <button
                    v-if="item.status === 'draft'"
                    @click="editApplication(item)"
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    编辑
                  </button>
                  <button
                    v-if="item.status === 'draft'"
                    @click="deleteApplication(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 空状态提示 -->
          <div v-if="applications.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">暂无数据</h3>
            <p class="mt-1 text-sm text-gray-500">没有找到符合条件的演练申请</p>
            <div class="mt-6">
              <button
                @click="handleAddClick"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                新增申请
              </button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
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
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
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

    <!-- 新增/编辑申请弹窗 -->
    <DrillApplicationModal
      v-if="showAddModal"
      :visible="showAddModal"
      :edit-data="editData"
      @close="closeModal"
      @success="handleSuccess"
    />

    <!-- 详情弹窗 -->
    <DrillApplicationDetailModal
      v-if="showDetailModal"
      :visible="showDetailModal"
      :data="detailData"
      @close="showDetailModal = false"
    />

    <!-- 批量导入弹窗 -->
    <DrillApplicationImportModal
      v-if="showImportModal"
      :visible="showImportModal"
      @close="showImportModal = false"
      @success="handleImportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DrillApplicationModal from '@/components/DrillApplicationModal.vue'
import DrillApplicationDetailModal from '@/components/DrillApplicationDetailModal.vue'
import DrillApplicationImportModal from '@/components/DrillApplicationImportModal.vue'
import { useDrillApplicationStore } from '@/stores/drillApplication'
import { showMessage } from '@/utils/message'

const drillApplicationStore = useDrillApplicationStore()

// 响应式数据
const showAddModal = ref(false)
const showDetailModal = ref(false)
const showImportModal = ref(false)
const editData = ref(null)
const detailData = ref(null)

// 查询表单
const searchForm = ref({
  subject: '',
  type: '',
  participantDept: '',
  organizerDept: '',
  planTime: '',
  status: ''
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const applications = ref([])

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 方法
const loadApplications = async () => {
  try {
    const params = {
      drillSubject: searchForm.value.subject,
      drillType: searchForm.value.type,
      participantDept: searchForm.value.participantDept,
      organizerDept: searchForm.value.organizerDept,
      status: searchForm.value.status,
      page: currentPage.value - 1, // 后端页码从0开始
      size: pageSize.value
    }
    
    console.log('查询参数:', params)
    
    const response = await drillApplicationStore.getApplications(params)
    console.log('查询结果:', response)
    
    // 后端返回的是PageResult对象
    if (response.data) {
      applications.value = response.data.content || []
      total.value = response.data.totalElements || 0
    } else {
      applications.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    showMessage('加载数据失败', 'error')
    applications.value = []
    total.value = 0
  }
}

const searchApplications = () => {
  currentPage.value = 1
  loadApplications()
}

const resetSearch = () => {
  searchForm.value = {
    subject: '',
    type: '',
    participantDept: '',
    organizerDept: '',
    planTime: '',
    status: ''
  }
  searchApplications()
}

const viewDetail = async (item: any) => {
  try {
    // 从后端API获取完整的详情数据
    const detail = await drillApplicationStore.getApplicationDetail(item.id)
    detailData.value = detail
    showDetailModal.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    // 如果API失败，使用列表项数据作为备选
    detailData.value = item
    showDetailModal.value = true
  }
}

const editApplication = (item: any) => {
  editData.value = item
  showAddModal.value = true
}

const deleteApplication = async (id: string) => {
  if (confirm('确定要删除这个演练申请吗？')) {
    try {
      await drillApplicationStore.deleteApplication(id)
      showMessage('删除成功', 'success')
      loadApplications()
    } catch (error) {
      showMessage('删除失败', 'error')
    }
  }
}

const handleAddClick = () => {
  showAddModal.value = true
  editData.value = null
}

const closeModal = () => {
  showAddModal.value = false
  editData.value = null
}

const handleSuccess = () => {
  showAddModal.value = false
  editData.value = null
  loadApplications()
}

const handleImportSuccess = () => {
  showImportModal.value = false
  loadApplications()
}

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadApplications()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadApplications()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadApplications()
}

// 工具方法
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const getDrillTypeName = (type: string) => {
  const typeNames = {
    'FIRE_DRILL': '消防演练',
    'EARTHQUAKE_DRILL': '地震演练',
    'FLOOD_DRILL': '防洪演练',
    'MEDICAL_DRILL': '医疗救援演练',
    'EVACUATION_DRILL': '疏散演练',
    'NUCLEAR_DRILL': '核事故演练',
    'CHEMICAL_DRILL': '化学事故演练'
  }
  return typeNames[type] || type || '-'
}

const getStatusClass = (status: string) => {
  const statusKey = status ? status.toLowerCase() : 'draft'
  const classes = {
    'draft': 'text-xs font-semibold text-gray-800',
    'submitted': 'text-xs font-semibold text-blue-800',
    'approved': 'text-xs font-semibold text-green-800',
    'rejected': 'text-xs font-semibold text-red-800'
  }
  return classes[statusKey] || classes['draft']
}

const getStatusDotClass = (status: string) => {
  const statusKey = status ? status.toLowerCase() : 'draft'
  const classes = {
    'draft': 'bg-gray-400',
    'submitted': 'bg-blue-500',
    'approved': 'bg-green-500',
    'rejected': 'bg-red-500'
  }
  return classes[statusKey] || classes['draft']
}

const getStatusText = (status: string) => {
  const statusKey = status ? status.toLowerCase() : 'draft'
  const texts = {
    'draft': '草稿',
    'submitted': '已提交',
    'approved': '已审核',
    'rejected': '已驳回'
  }
  return texts[statusKey] || '未知'
}

// 生命周期
onMounted(() => {
  loadApplications()
})
</script>
