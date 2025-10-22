<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面头部 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">培训演练统计分析</h1>
        <p class="text-gray-600 mt-2">按部门和时间维度统计演练次数，分析演练趋势</p>
      </div>

      <!-- 筛选条件 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="label">部门选择（多选）</label>
            <select
              v-model="selectedDepartments"
              multiple
              class="input"
              style="min-height: 100px"
            >
              <option value="应急管理部">应急管理部</option>
              <option value="安全保卫部">安全保卫部</option>
              <option value="医疗救护部">医疗救护部</option>
              <option value="消防救援部">消防救援部</option>
              <option value="技术保障部">技术保障部</option>
              <option value="后勤保障部">后勤保障部</option>
              <option value="信息通信部">信息通信部</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">按住Ctrl可多选，不选则统计全部部门</p>
          </div>
          <div>
            <label class="label">开始日期</label>
            <input
              v-model="startDate"
              type="date"
              class="input"
            />
          </div>
          <div>
            <label class="label">结束日期</label>
            <input
              v-model="endDate"
              type="date"
              class="input"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-4">
          <button @click="resetFilter" class="btn btn-secondary">重置</button>
          <button @click="loadStatistics" class="btn btn-primary">查询</button>
        </div>
      </div>

      <!-- 统计概览卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">总演练数</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.totalDrills || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">已完成</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.completedDrills || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">完成率</p>
              <p class="text-3xl font-bold text-gray-900">{{ (stats.completionRate || 0).toFixed(1) }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 培训统计区域 -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg class="h-6 w-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          培训统计
        </h2>
        <div class="bg-white rounded-lg shadow-md p-8">
          <div class="text-center text-gray-500">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <p class="text-lg font-medium">培训管理模块待开发</p>
            <p class="text-sm mt-2">培训统计功能将在培训管理模块开发后自动启用</p>
          </div>
        </div>
      </div>

      <!-- 演练统计区域 -->
      <div>
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg class="h-6 w-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          演练统计
        </h2>
        
        <!-- 图表区域 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- 按部门统计图 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">按部门统计演练次数</h3>
            <div id="departmentChart" style="height: 400px"></div>
          </div>

          <!-- 按类型统计图 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">按类型统计演练次数</h3>
            <div id="typeChart" style="height: 400px"></div>
          </div>
        </div>

        <!-- 时间趋势图 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">演练时间趋势</h3>
          <div id="trendChart" style="height: 400px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'

// 筛选条件
const selectedDepartments = ref<string[]>([])
const startDate = ref('')
const endDate = ref('')

// 统计数据
const stats = ref<any>({
  totalDrills: 0,
  completedDrills: 0,
  completionRate: 0,
  byDepartment: [],
  byType: [],
  byMonth: []
})

// 图表实例
let departmentChart: any = null
let typeChart: any = null
let trendChart: any = null

// 加载统计数据
const loadStatistics = async () => {
  try {
    const params: any = {}
    
    if (selectedDepartments.value.length > 0) {
      params.departments = selectedDepartments.value.join(',')
    }
    if (startDate.value) {
      const date = new Date(startDate.value)
      params.startDate = date.toISOString()
    }
    if (endDate.value) {
      const date = new Date(endDate.value)
      date.setHours(23, 59, 59)
      params.endDate = date.toISOString()
    }

    const response = await request.get('/statistics/overview', { params })
    
    if (response.data) {
      stats.value = response.data
      
      // 更新图表
      await nextTick()
      updateCharts()
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    showMessage('加载统计数据失败', 'error')
  }
}

// 重置筛选
const resetFilter = () => {
  selectedDepartments.value = []
  startDate.value = ''
  endDate.value = ''
  loadStatistics()
}

// 初始化图表
const initCharts = () => {
  // 按部门统计图（柱状图）
  const departmentDom = document.getElementById('departmentChart')
  if (departmentDom) {
    departmentChart = echarts.init(departmentDom)
  }

  // 按类型统计图（饼图）
  const typeDom = document.getElementById('typeChart')
  if (typeDom) {
    typeChart = echarts.init(typeDom)
  }

  // 时间趋势图（折线图）
  const trendDom = document.getElementById('trendChart')
  if (trendDom) {
    trendChart = echarts.init(trendDom)
  }

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    departmentChart?.resize()
    typeChart?.resize()
    trendChart?.resize()
  })
}

// 更新图表
const updateCharts = () => {
  // 按部门统计柱状图
  if (departmentChart && stats.value.byDepartment && stats.value.byDepartment.length > 0) {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: stats.value.byDepartment.map((item: any) => item.department),
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value',
        name: '演练次数'
      },
      series: [{
        name: '演练次数',
        data: stats.value.byDepartment.map((item: any) => item.count),
        type: 'bar',
        itemStyle: {
          color: '#3b82f6'
        },
        label: {
          show: true,
          position: 'top'
        }
      }]
    }
    departmentChart.setOption(option)
  }

  // 按类型统计饼图
  if (typeChart && stats.value.byType && stats.value.byType.length > 0) {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [{
        name: '演练类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: stats.value.byType.map((item: any) => ({
          value: item.count,
          name: item.type
        }))
      }]
    }
    typeChart.setOption(option)
  }

  // 时间趋势折线图
  if (trendChart && stats.value.byMonth && stats.value.byMonth.length > 0) {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: stats.value.byMonth.map((item: any) => item.month)
      },
      yAxis: {
        type: 'value',
        name: '演练次数'
      },
      series: [{
        name: '演练次数',
        data: stats.value.byMonth.map((item: any) => item.count),
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#10b981'
        },
        areaStyle: {
          color: 'rgba(16, 185, 129, 0.1)'
        },
        label: {
          show: true,
          position: 'top'
        }
      }]
    }
    trendChart.setOption(option)
  }
}

// 生命周期
onMounted(() => {
  loadStatistics()
  nextTick(() => {
    initCharts()
  })
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

