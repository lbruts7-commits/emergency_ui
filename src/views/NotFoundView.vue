<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">页面未找到</h2>
        <p class="text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
      </div>
      
      <div class="space-y-4">
        <RouterLink
          to="/"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          返回首页
        </RouterLink>
        
        <div>
          <button
            @click="goBack"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
