import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: '关于'
    }
  },
  {
    path: '/drill-applications',
    name: 'DrillApplications',
    component: () => import('@/views/DrillApplicationView.vue'),
    meta: {
      title: '演练申请管理'
    }
  },
  {
    path: '/drill-plans',
    name: 'DrillPlans',
    component: () => import('@/views/DrillPlanView.vue'),
    meta: {
      title: '演练方案管理'
    }
  },
  {
    path: '/drill-executions',
    name: 'DrillExecutions',
    component: () => import('@/views/DrillExecutionView.vue'),
    meta: {
      title: '演练实施管理'
    }
  },
  {
    path: '/drill-evaluations',
    name: 'DrillEvaluations',
    component: () => import('@/views/DrillEvaluationView.vue'),
    meta: {
      title: '演练评估管理'
    }
  },
  {
    path: '/drill-archives',
    name: 'DrillArchives',
    component: () => import('@/views/DrillArchiveView.vue'),
    meta: {
      title: '演练档案管理'
    }
  },
  {
    path: '/improvement-tasks',
    name: 'ImprovementTasks',
    component: () => import('@/views/ImprovementTaskView.vue'),
    meta: {
      title: '评估改进管理'
    }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/StatisticsView.vue'),
    meta: {
      title: '统计分析'
    }
  },
  {
    path: '/test-connection',
    name: 'TestConnection',
    component: () => import('@/views/TestConnectionView.vue'),
    meta: {
      title: '前后端连接测试'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 应急管理系统`
  }
  next()
})

export default router
