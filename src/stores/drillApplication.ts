import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

// 演练申请状态管理
export const useDrillApplicationStore = defineStore('drillApplication', () => {
  // 状态
  const applications = ref([])
  const loading = ref(false)
  const currentApplication = ref(null)

  // 获取演练申请列表
  const getApplications = async (params: any = {}) => {
    loading.value = true
    try {
      const response = await request.get('/drill-applications', { params })
      applications.value = response.data
      return response
    } catch (error) {
      console.error('获取演练申请列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取演练申请详情
  const getApplicationDetail = async (id: string) => {
    try {
      const response = await request.get(`/drill-applications/${id}`)
      currentApplication.value = response.data
      return response.data
    } catch (error) {
      console.error('获取演练申请详情失败:', error)
      throw error
    }
  }

  // 创建演练申请
  const createApplication = async (data: any) => {
    loading.value = true
    try {
      const response = await request.post('/drill-applications', data)
      return response.data
    } catch (error) {
      console.error('创建演练申请失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新演练申请
  const updateApplication = async (id: string, data: any) => {
    loading.value = true
    try {
      const response = await request.put(`/drill-applications/${id}`, data)
      return response.data
    } catch (error) {
      console.error('更新演练申请失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除演练申请
  const deleteApplication = async (id: string) => {
    loading.value = true
    try {
      const response = await request.delete(`/drill-applications/${id}`)
      return response.data
    } catch (error) {
      console.error('删除演练申请失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 提交演练申请
  const submitApplication = async (id: string) => {
    loading.value = true
    try {
      const response = await request.post(`/drill-applications/${id}/submit`)
      return response.data
    } catch (error) {
      console.error('提交演练申请失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 批量导入演练申请
  const importApplications = async (formData: FormData) => {
    loading.value = true
    try {
      const response = await request.post('/drill-applications/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('批量导入演练申请失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 下载导入模板
  const downloadTemplate = async () => {
    try {
      const response = await request.get('/drill-applications/template', {
        responseType: 'blob'
      })
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', '演练申请导入模板.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return response.data
    } catch (error) {
      console.error('下载模板失败:', error)
      throw error
    }
  }

  // 获取已提交的演练申请（用于演练方案关联）
  const getSubmittedApplications = async () => {
    try {
      const response = await request.get('/drill-applications', {
        params: { status: 'submitted' }
      })
      return response.data
    } catch (error) {
      console.error('获取已提交的演练申请失败:', error)
      throw error
    }
  }

  return {
    // 状态
    applications,
    loading,
    currentApplication,
    
    // 方法
    getApplications,
    getApplicationDetail,
    createApplication,
    updateApplication,
    deleteApplication,
    submitApplication,
    importApplications,
    downloadTemplate,
    getSubmittedApplications
  }
})
