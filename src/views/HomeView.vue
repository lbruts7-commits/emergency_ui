<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 头部区域 -->
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          应急管理系统
        </h1>
        <p class="text-xl text-gray-600">
          现代化应急响应与管理系统
        </p>
      </header>

      <!-- 功能卡片区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          @click="navigateToFeature(feature.route)"
        >
          <div class="text-3xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600">
            {{ feature.description }}
          </p>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">系统统计</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="text-center"
          >
            <div class="text-3xl font-bold text-blue-600 mb-2">
              {{ stat.value }}
            </div>
            <div class="text-gray-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 功能特性数据
const features = ref([
  {
    id: 1,
    icon: '📝',
    title: '演练申请',
    description: '管理应急演练申请，包括新增、查看、查询和批量导入',
    route: '/drill-applications'
  },
  {
    id: 2,
    icon: '📋',
    title: '演练方案',
    description: '管理应急演练方案，包括新增、编辑、审核和删除',
    route: '/drill-plans'
  },
  {
    id: 3,
    icon: '🚨',
    title: '应急响应',
    description: '快速响应各类突发事件，提供实时调度和指挥功能',
    route: '/emergency-response'
  },
  {
    id: 4,
    icon: '📊',
    title: '数据分析',
    description: '智能分析应急数据，提供决策支持和趋势预测',
    route: '/data-analysis'
  },
  {
    id: 5,
    icon: '👥',
    title: '人员管理',
    description: '统一管理应急人员信息，优化资源配置',
    route: '/personnel-management'
  },
  {
    id: 6,
    icon: '🔔',
    title: '实时通知',
    description: '多渠道消息推送，确保重要信息及时传达',
    route: '/notifications'
  }
])

// 统计数据
const stats = ref([
  { label: '活跃用户', value: '1,234' },
  { label: '处理事件', value: '567' },
  { label: '响应时间', value: '2.3分钟' },
  { label: '系统运行', value: '99.9%' }
])

// 导航到功能页面
const navigateToFeature = (route: string) => {
  router.push(route)
}
</script>
