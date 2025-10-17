<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面头部 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">演练方案管理</h1>
          <p class="text-gray-600 mt-2">管理应急演练方案，包括新增、编辑、审核和删除</p>
        </div>
        <button
          @click="showAddModal = true"
          class="btn btn-primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          新增方案
        </button>
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
            <label class="label">应急演练类型</label>
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
            <select v-model="searchForm.participantDepts" multiple class="input" style="min-height: 38px;">
              <option v-for="dept in departments" :key="dept.id" :value="dept.name">
                {{ dept.name }}
              </option>
            </select>
            <span class="text-xs text-gray-500 mt-1">按住Ctrl可多选</span>
          </div>
          <div>
            <label class="label">组织部门/科室</label>
            <select v-model="searchForm.organizerDept" class="input">
              <option value="">全部</option>
              <option v-for="office in offices" :key="office.id" :value="office.name">
                {{ office.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="label">计划演练时间</label>
            <input
              v-model="searchForm.planTime"
              type="date"
              class="input"
            />
          </div>
          <div>
            <label class="label">方案制定人</label>
            <input
              v-model="searchForm.creator"
              type="text"
              class="input"
              placeholder="请输入制定人姓名"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="resetSearch" class="btn btn-secondary">
            重置
          </button>
          <button @click="searchPlans" class="btn btn-primary">
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
                  预案
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  参演部门
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  组织部门
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  制定人
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最后更新时间
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
              <tr v-if="plans.length === 0">
                <td colspan="11" class="px-6 py-8 text-center text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="mt-2">暂无演练方案数据</p>
                </td>
              </tr>
              <!-- 数据行 -->
              <tr v-for="(item, index) in plans" :key="item.id">
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
                  {{ item.relatedPlanName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.participatingDepartments?.join('、') || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.organizationDepartment }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDateTime(item.plannedDrillTime) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.plannerName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDateTime(item.updatedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(item.status)">
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
                    v-if="item.status === 'DRAFT'"
                    @click="editPlan(item)"
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    编辑
                  </button>
                  <button
                    v-if="item.status === 'SUBMITTED'"
                    @click="showAuditModalHandler(item)"
                    class="text-yellow-600 hover:text-yellow-900 mr-3"
                  >
                    审核
                  </button>
                  <button
                    v-if="item.status === 'APPROVED'"
                    @click="startExecution(item)"
                    class="text-purple-600 hover:text-purple-900 mr-3"
                  >
                    开始实施
                  </button>
                  <button
                    v-if="item.status === 'REJECTED'"
                    @click="deletePlan(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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

    <!-- 新增/编辑方案弹窗 -->
    <DrillPlanModal
      v-if="showAddModal"
      :visible="showAddModal"
      :edit-data="editData"
      @close="closeModal"
      @success="handleSuccess"
    />

    <!-- 详情弹窗 -->
    <DrillPlanDetailModal
      v-if="showDetailModal"
      :visible="showDetailModal"
      :data="detailData"
      @close="showDetailModal = false"
    />

    <!-- 审核弹窗 -->
    <DrillPlanAuditModal
      v-if="showAuditModal"
      :visible="showAuditModal"
      :data="auditData"
      @close="showAuditModal = false"
      @success="handleAuditSuccess"
    />

    <!-- 开始实施弹窗 -->
    <StartExecutionModal
      v-if="showStartExecutionModal"
      :visible="showStartExecutionModal"
      :plan-data="selectedPlan"
      @close="showStartExecutionModal = false"
      @success="handleExecutionSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DrillPlanModal from '@/components/DrillPlanModal.vue'
import DrillPlanDetailModal from '@/components/DrillPlanDetailModal.vue'
import DrillPlanAuditModal from '@/components/DrillPlanAuditModal.vue'
import StartExecutionModal from '@/components/StartExecutionModal.vue'
import { useDrillPlanStore } from '@/stores/drillPlan'
import { showMessage } from '@/utils/message'
import request from '@/utils/request'

const drillPlanStore = useDrillPlanStore()

// 响应式数据
const showAddModal = ref(false)
const showDetailModal = ref(false)
const showAuditModal = ref(false)
const showStartExecutionModal = ref(false)
const editData = ref(null)
const detailData = ref(null)
const auditData = ref(null)
const selectedPlan = ref(null)

// 下拉选项数据
const departments = ref([])
const offices = ref([])

// 查询表单
const searchForm = ref({
  subject: '',
  type: '',
  participantDepts: [], // 多选
  organizerDept: '',
  planTime: '',
  creator: ''
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const plans = ref([])

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

// 加载部门和科室数据
const loadDepartments = async () => {
  try {
    const response = await request.get('/departments')
    departments.value = response.data || []
  } catch (error) {
    console.error('加载部门数据失败:', error)
  }
}

const loadOffices = async () => {
  try {
    const response = await request.get('/offices')
    offices.value = response.data || []
  } catch (error) {
    console.error('加载科室数据失败:', error)
  }
}

// 方法
const loadPlans = async () => {
  try {
    const params: any = {
      drillSubject: searchForm.value.subject,
      drillType: searchForm.value.type,
      organizationDepartment: searchForm.value.organizerDept,
      plannerName: searchForm.value.creator,
      page: currentPage.value - 1, // 后端页码从0开始
      size: pageSize.value
    }
    
    // 如果选择了参演部门，添加到查询参数
    if (searchForm.value.participantDepts && searchForm.value.participantDepts.length > 0) {
      params.participatingDepartments = searchForm.value.participantDepts.join(',')
    }
    
    console.log('查询参数:', params)
    
    const response = await drillPlanStore.getPlans(params)
    console.log('查询结果:', response)
    
    // 后端返回的是PageResult对象
    if (response.data) {
      plans.value = response.data.content || []
      total.value = response.data.totalElements || 0
    } else {
      plans.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    showMessage('加载数据失败', 'error')
    plans.value = []
    total.value = 0
  }
}

const searchPlans = () => {
  currentPage.value = 1
  loadPlans()
}

const resetSearch = () => {
  searchForm.value = {
    subject: '',
    type: '',
    participantDepts: [],
    organizerDept: '',
    planTime: '',
    creator: ''
  }
  searchPlans()
}

const viewDetail = async (item: any) => {
  try {
    // 从后端API获取完整的详情数据
    const detail = await drillPlanStore.getPlanDetail(item.id)
    detailData.value = detail
    showDetailModal.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    showMessage('获取详情失败', 'error')
    // 如果API失败，使用列表项数据作为备选
    detailData.value = item
    showDetailModal.value = true
  }
}

const editPlan = (item: any) => {
  editData.value = item
  showAddModal.value = true
}

const showAuditModalHandler = (item: any) => {
  auditData.value = item
  showAuditModal.value = true
}

const startExecution = (item: any) => {
  selectedPlan.value = item
  showStartExecutionModal.value = true
}

const handleExecutionSuccess = () => {
  showStartExecutionModal.value = false
  selectedPlan.value = null
  // 成功后会自动跳转到演练实施页面
}

const deletePlan = async (id: string) => {
  if (confirm('确定要删除这个演练方案吗？')) {
    try {
      await drillPlanStore.deletePlan(id)
      showMessage('删除成功', 'success')
      loadPlans()
    } catch (error) {
      showMessage('删除失败', 'error')
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  editData.value = null
}

const handleSuccess = () => {
  showAddModal.value = false
  editData.value = null
  loadPlans()
}

const handleAuditSuccess = () => {
  showAuditModal.value = false
  auditData.value = null
  loadPlans()
}

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadPlans()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadPlans()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadPlans()
}

// 工具方法
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDateTime = (date: string) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
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

const getStatusClass = (status: string) => {
  const statusLower = status?.toLowerCase() || ''
  const classes: Record<string, string> = {
    'draft': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800',
    'submitted': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    'approved': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    'rejected': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[statusLower] || classes['draft']
}

const getStatusText = (status: string) => {
  const statusLower = status?.toLowerCase() || ''
  const texts: Record<string, string> = {
    'draft': '草稿',
    'submitted': '待审核',
    'approved': '已通过',
    'rejected': '已驳回'
  }
  return texts[statusLower] || '未知'
}

const getStatusDotClass = (status: string) => {
  const statusLower = status?.toLowerCase() || ''
  const classes: Record<string, string> = {
    'draft': 'h-2 w-2 bg-gray-400 rounded-full',
    'submitted': 'h-2 w-2 bg-yellow-400 rounded-full',
    'approved': 'h-2 w-2 bg-green-400 rounded-full',
    'rejected': 'h-2 w-2 bg-red-400 rounded-full'
  }
  return classes[statusLower] || classes['draft']
}

// 生命周期
onMounted(() => {
  loadDepartments()
  loadOffices()
  loadPlans()
})
</script>
