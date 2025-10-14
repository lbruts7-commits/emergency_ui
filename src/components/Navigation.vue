<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <RouterLink to="/" class="flex-shrink-0 flex items-center">
            <span class="text-2xl font-bold text-blue-600">应急管理系统</span>
          </RouterLink>
        </div>
        
        <div class="flex items-center space-x-8">
          <RouterLink
            to="/"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
          >
            首页
          </RouterLink>
          <RouterLink
            to="/drill-applications"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/drill-applications' }"
          >
            演练申请
          </RouterLink>
          <RouterLink
            to="/drill-plans"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/drill-plans' }"
          >
            演练方案
          </RouterLink>
          <RouterLink
            to="/test-connection"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/test-connection' }"
          >
            连接测试
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/about' }"
          >
            关于
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 导航组件
</script>
