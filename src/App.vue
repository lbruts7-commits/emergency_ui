<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navigation />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
</script>

<style scoped>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
