<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面头部 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">评估改进管理</h1>
          <p class="text-gray-600 mt-2">管理演练评估改进和整改任务</p>
        </div>
        <div class="flex space-x-4">
          <button @click="showImportModal = true" class="btn btn-secondary">
            <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            导入
          </button>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            新增
          </button>
        </div>
      </div>

      <!-- 查询筛选区域 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="label">整改任务名称</label>
            <input v-model="searchForm.taskName" type="text" class="input" placeholder="请输入整改任务名称" />
          </div>
          <div>
            <label class="label">建议类型</label>
            <select v-model="searchForm.suggestionType" class="input">
              <option value="">全部</option>
              <option value="EQUIPMENT">设备改进</option>
              <option value="PROCESS">流程改进</option>
              <option value="TRAINING">培训改进</option>
              <option value="ORGANIZATION">组织改进</option>
              <option value="OTHER">其他改进</option>
            </select>
          </div>
          <div>
            <label class="label">建议发起人</label>
            <input v-model="searchForm.initiatorName" type="text" class="input" placeholder="请输入建议发起人" />
          </div>
          <div>
            <label class="label">建议发起单位</label>
            <input v-model="searchForm.initiatorDepartment" type="text" class="input" placeholder="请输入建议发起单位" />
          </div>
          <div>
            <label class="label">任务接收人</label>
            <input v-model="searchForm.receiverName" type="text" class="input" placeholder="请输入任务接收人" />
          </div>
          <div>
            <label class="label">状态</label>
            <select v-model="searchForm.status" class="input">
              <option value="">全部</option>
              <option value="PENDING_REVIEW">待审核</option>
              <option value="APPROVED">审核通过</option>
              <option value="REJECTED">已驳回</option>
              <option value="COMPLETED">已完成</option>
              <option value="IMPORTED">已导入</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="resetSearch" class="btn btn-secondary">重置</button>
          <button @click="searchTasks" class="btn btn-primary">查询</button>
        </div>
      </div>

      <!-- 列表区域 -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">序号</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">整改任务名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">建议类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">建议发起人</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">建议发起单位</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">附件信息</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务接收人</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">整改期限(天)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="tasks.length === 0">
                <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <p class="mt-2">暂无整改任务数据</p>
                </td>
              </tr>
              <tr v-for="(item, index) in tasks" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ item.taskName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getSuggestionTypeName(item.suggestionType) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.initiatorName || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ item.initiatorDepartment || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span v-if="item.attachments && item.attachments.length > 0" class="text-blue-600">
                    {{ item.attachments.length }}份附件
                  </span>
                  <span v-else class="text-gray-400">无</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.receiverName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.deadlineDays }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button @click="showDetailModal(item)" class="text-blue-600 hover:text-blue-900">详情</button>
                  <button v-if="canEdit(item)" @click="editTask(item)" class="text-green-600 hover:text-green-900">编辑</button>
                  <button v-if="canReview(item)" @click="reviewTask(item)" class="text-purple-600 hover:text-purple-900">审核</button>
                  <button v-if="canUploadReport(item)" @click="uploadReport(item)" class="text-yellow-600 hover:text-yellow-900">上传报告</button>
                  <button v-if="canDelete(item)" @click="deleteTask(item)" class="text-red-600 hover:text-red-900">删除</button>
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
                <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  上一页
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  下一页
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑Modal -->
    <ImprovementTaskModal
      :visible="showTaskModal"
      :task-data="currentTask"
      :is-edit="isEditMode"
      @close="showTaskModal = false"
      @success="handleTaskSuccess"
    />

    <!-- 详情Modal -->
    <ImprovementTaskDetailModal
      :visible="showDetailModalVisible"
      :task-data="currentTask"
      @close="showDetailModalVisible = false"
    />

    <!-- 审核Modal -->
    <ImprovementReviewModal
      :visible="showReviewModal"
      :task-data="currentTask"
      @close="showReviewModal = false"
      @success="handleReviewSuccess"
    />

    <!-- 上传报告Modal -->
    <ImprovementReportUploadModal
      :visible="showUploadReportModal"
      :task-data="currentTask"
      @close="showUploadReportModal = false"
      @success="handleUploadSuccess"
    />

    <!-- 导入Modal -->
    <ImprovementImportModal
      :visible="showImportModal"
      @close="showImportModal = false"
      @success="handleImportSuccess"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'
import ImprovementTaskModal from '@/components/ImprovementTaskModal.vue'
import ImprovementTaskDetailModal from '@/components/ImprovementTaskDetailModal.vue'
import ImprovementImportModal from '@/components/ImprovementImportModal.vue'
import ImprovementReviewModal from '@/components/ImprovementReviewModal.vue'
import ImprovementReportUploadModal from '@/components/ImprovementReportUploadModal.vue'

// 响应式数据
const showTaskModal = ref(false)
const showDetailModalVisible = ref(false)
const showReviewModal = ref(false)
const showUploadReportModal = ref(false)
const showImportModal = ref(false)
const showCreateModal = ref(false)
const currentTask = ref(null)
const isEditMode = ref(false)

// 查询表单
const searchForm = ref({
  taskName: '',
  suggestionType: '',
  initiatorName: '',
  initiatorDepartment: '',
  receiverName: '',
  status: ''
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tasks = ref([])

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 加载任务列表
const loadTasks = async () => {
  try {
    const params: any = {
      ...searchForm.value,
      page: currentPage.value - 1,
      size: pageSize.value
    }

    const response = await request.get('/improvement-tasks', { params })
    if (response.data) {
      tasks.value = response.data.content || []
      total.value = response.data.totalElements || 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    showMessage('加载数据失败', 'error')
  }
}

const searchTasks = () => {
  currentPage.value = 1
  loadTasks()
}

const resetSearch = () => {
  searchForm.value = {
    taskName: '',
    suggestionType: '',
    initiatorName: '',
    initiatorDepartment: '',
    receiverName: '',
    status: ''
  }
  searchTasks()
}

// 关闭所有模态框
const closeAllModals = () => {
  showTaskModal.value = false
  showDetailModalVisible.value = false
  showReviewModal.value = false
  showUploadReportModal.value = false
  showImportModal.value = false
}

// 新增任务
watch(() => showCreateModal.value, (newVal) => {
  if (newVal) {
    currentTask.value = null
    isEditMode.value = false
    showTaskModal.value = true
    showCreateModal.value = false
  }
})

// 编辑任务
const editTask = (item: any) => {
  currentTask.value = item
  isEditMode.value = true
  showTaskModal.value = true
}

// 显示详情
const showDetailModal = (item: any) => {
  currentTask.value = item
  showDetailModalVisible.value = true
}

// 审核任务
const reviewTask = (item: any) => {
  currentTask.value = item
  showReviewModal.value = true
}

// 上传报告
const uploadReport = (item: any) => {
  currentTask.value = item
  showUploadReportModal.value = true
}

// 删除任务
const deleteTask = async (item: any) => {
  if (!confirm(`确定要删除整改任务"${item.taskName}"吗？`)) {
    return
  }

  try {
    await request.delete(`/improvement-tasks/${item.id}`)
    showMessage('删除成功！', 'success')
    loadTasks()
  } catch (error: any) {
    showMessage(error.message || '删除失败！', 'error')
  }
}

// 权限判断
const canEdit = (item: any) => {
  return item.status === 'PENDING_REVIEW' || item.status === 'REJECTED'
}

const canReview = (item: any) => {
  return item.status === 'PENDING_REVIEW'
}

const canUploadReport = (item: any) => {
  return item.status === 'APPROVED'
}

const canDelete = (item: any) => {
  return item.status === 'REJECTED'
}

// 回调处理
const handleTaskSuccess = () => {
  showTaskModal.value = false
  currentTask.value = null
  loadTasks()
}

const handleReviewSuccess = () => {
  showReviewModal.value = false
  currentTask.value = null
  loadTasks()
}

const handleUploadSuccess = () => {
  showUploadReportModal.value = false
  currentTask.value = null
  loadTasks()
}

const handleImportSuccess = () => {
  showImportModal.value = false
  loadTasks()
}

// 分页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadTasks()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadTasks()
  }
}

// 工具方法
const getSuggestionTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'EQUIPMENT': '设备改进',
    'PROCESS': '流程改进',
    'TRAINING': '培训改进',
    'ORGANIZATION': '组织改进',
    'OTHER': '其他改进'
  }
  return typeMap[type] || type
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING_REVIEW': '待审核',
    'APPROVED': '审核通过',
    'REJECTED': '已驳回',
    'COMPLETED': '已完成',
    'IMPORTED': '已导入'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'PENDING_REVIEW': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    'APPROVED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    'REJECTED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
    'COMPLETED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    'IMPORTED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'
  }
  return classMap[status] || 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
}

onMounted(() => {
  loadTasks()
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

