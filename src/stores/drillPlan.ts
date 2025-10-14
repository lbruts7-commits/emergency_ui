import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

// 演练方案状态管理
export const useDrillPlanStore = defineStore('drillPlan', () => {
  // 状态
  const plans = ref([])
  const loading = ref(false)
  const currentPlan = ref(null)

  // 获取演练方案列表
  const getPlans = async (params: any = {}) => {
    loading.value = true
    try {
      const response = await request.get('/drill-plans', { params })
      plans.value = response.data
      return response
    } catch (error) {
      console.error('获取演练方案列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取演练方案详情
  const getPlanDetail = async (id: string) => {
    try {
      const response = await request.get(`/drill-plans/${id}`)
      currentPlan.value = response.data
      return response.data
    } catch (error) {
      console.error('获取演练方案详情失败:', error)
      throw error
    }
  }

  // 创建演练方案
  const createPlan = async (data: any) => {
    loading.value = true
    try {
      const response = await request.post('/drill-plans', data)
      return response.data
    } catch (error) {
      console.error('创建演练方案失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新演练方案
  const updatePlan = async (id: string, data: any) => {
    loading.value = true
    try {
      const response = await request.put(`/drill-plans/${id}`, data)
      return response.data
    } catch (error) {
      console.error('更新演练方案失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除演练方案
  const deletePlan = async (id: string) => {
    loading.value = true
    try {
      const response = await request.delete(`/drill-plans/${id}`)
      return response.data
    } catch (error) {
      console.error('删除演练方案失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 审核演练方案（旧方法，保留兼容性）
  const auditPlan = async (id: string, auditData: { result: string; comment: string }) => {
    loading.value = true
    try {
      const response = await request.post(`/drill-plans/${id}/audit`, auditData)
      return response.data
    } catch (error) {
      console.error('审核演练方案失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 审核演练方案（新方法，使用正确的API）
  const reviewPlan = async (reviewData: any) => {
    loading.value = true
    try {
      const response = await request.post('/drill-plans/review', reviewData)
      return response.data
    } catch (error) {
      console.error('审核演练方案失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 提交演练方案
  const submitPlan = async (id: string) => {
    loading.value = true
    try {
      const response = await request.post(`/drill-plans/${id}/submit`)
      return response.data
    } catch (error) {
      console.error('提交演练方案失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 下载方案文档
  const downloadPlanDocument = async (id: string) => {
    try {
      const response = await request.get(`/drill-plans/${id}/document`, {
        responseType: 'blob'
      })
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `演练方案文档_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return response.data
    } catch (error) {
      console.error('下载方案文档失败:', error)
      throw error
    }
  }

  // 预览方案文档
  const previewPlanDocument = async (id: string) => {
    try {
      const response = await request.get(`/drill-plans/${id}/document`, {
        responseType: 'blob'
      })
      
      // 创建预览窗口
      const url = window.URL.createObjectURL(new Blob([response.data]))
      window.open(url, '_blank')
      
      return response.data
    } catch (error) {
      console.error('预览方案文档失败:', error)
      throw error
    }
  }

  // 获取方案统计信息
  const getPlanStatistics = async () => {
    try {
      const response = await request.get('/drill-plans/statistics')
      return response.data
    } catch (error) {
      console.error('获取方案统计信息失败:', error)
      throw error
    }
  }

  return {
    // 状态
    plans,
    loading,
    currentPlan,
    
    // 方法
    getPlans,
    getPlanDetail,
    createPlan,
    updatePlan,
    deletePlan,
    auditPlan,
    reviewPlan,
    submitPlan,
    downloadPlanDocument,
    previewPlanDocument,
    getPlanStatistics
  }
})
