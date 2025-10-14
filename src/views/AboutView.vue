<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">关于系统</h1>
        
        <div class="prose max-w-none">
          <p class="text-lg text-gray-600 mb-6">
            应急管理系统是一个现代化的应急响应与管理系统，旨在提供高效、可靠的应急处理解决方案。
          </p>
          
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">主要特性</h2>
          <ul class="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>实时应急响应与调度</li>
            <li>智能数据分析与预测</li>
            <li>多平台支持（Web、移动端）</li>
            <li>实时消息推送</li>
            <li>自动化报告生成</li>
            <li>人员与资源管理</li>
          </ul>
          
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">技术栈</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gray-100 rounded-lg p-4 text-center">
              <div class="text-2xl mb-2">⚡</div>
              <div class="font-semibold">Vite</div>
            </div>
            <div class="bg-gray-100 rounded-lg p-4 text-center">
              <div class="text-2xl mb-2">💚</div>
              <div class="font-semibold">Vue 3</div>
            </div>
            <div class="bg-gray-100 rounded-lg p-4 text-center">
              <div class="text-2xl mb-2">🎨</div>
              <div class="font-semibold">TailwindCSS</div>
            </div>
            <div class="bg-gray-100 rounded-lg p-4 text-center">
              <div class="text-2xl mb-2">📦</div>
              <div class="font-semibold">Pinia</div>
            </div>
          </div>
          
          <div class="text-center">
            <RouterLink
              to="/"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              返回首页
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 关于页面组件
</script>
