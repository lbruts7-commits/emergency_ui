import request from '@/utils/request'

// 用户相关API
export const userApi = {
  // 获取所有用户
  getUsers: () => {
    return request.get('/users')
  },
  
  // 根据ID获取用户
  getUserById: (id: string) => {
    return request.get(`/users/${id}`)
  },
  
  // 根据用户名获取用户
  getUserByUsername: (username: string) => {
    return request.get(`/users/username/${username}`)
  },
  
  // 创建用户
  createUser: (data: any) => {
    return request.post('/users', data)
  },
  
  // 更新用户
  updateUser: (id: string, data: any) => {
    return request.put(`/users/${id}`, data)
  },
  
  // 删除用户
  deleteUser: (id: string) => {
    return request.delete(`/users/${id}`)
  }
}

// 应急事件相关API
export const emergencyApi = {
  // 获取事件列表
  getEventList: (params?: any) => {
    return request.get('/emergency/events', { params })
  },
  
  // 创建事件
  createEvent: (data: any) => {
    return request.post('/emergency/events', data)
  },
  
  // 更新事件
  updateEvent: (id: string, data: any) => {
    return request.put(`/emergency/events/${id}`, data)
  },
  
  // 删除事件
  deleteEvent: (id: string) => {
    return request.delete(`/emergency/events/${id}`)
  }
}

// 演练申请相关API
export const drillApplicationApi = {
  // 获取演练申请列表
  getApplications: (params?: any) => {
    return request.get('/drill-applications', { params })
  },
  
  // 获取演练申请详情
  getApplicationDetail: (id: string) => {
    return request.get(`/drill-applications/${id}`)
  },
  
  // 创建演练申请
  createApplication: (data: any) => {
    return request.post('/drill-applications', data)
  },
  
  // 更新演练申请
  updateApplication: (id: string, data: any) => {
    return request.put(`/drill-applications/${id}`, data)
  },
  
  // 删除演练申请
  deleteApplication: (id: string) => {
    return request.delete(`/drill-applications/${id}`)
  },
  
  // 提交演练申请
  submitApplication: (id: string) => {
    return request.post(`/drill-applications/${id}/submit`)
  },
  
  // 获取已提交的演练申请列表
  getSubmittedApplications: () => {
    return request.get('/drill-applications/submitted')
  },
  
  // 批量导入演练申请
  importApplications: (data: FormData) => {
    return request.post('/drill-applications/import', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // 下载导入模板
  downloadTemplate: () => {
    return request.get('/drill-applications/template', {
      responseType: 'blob'
    })
  },
  
  // 上传附件
  uploadAttachment: (id: string, data: FormData) => {
    return request.post(`/drill-applications/${id}/attachments`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // 删除附件
  deleteAttachment: (attachmentId: string) => {
    return request.delete(`/drill-applications/attachments/${attachmentId}`)
  }
}

// 演练方案相关API
export const drillPlanApi = {
  // 获取演练方案列表
  getPlans: (params?: any) => {
    return request.get('/drill-plans', { params })
  },
  
  // 获取演练方案详情
  getPlanDetail: (id: string) => {
    return request.get(`/drill-plans/${id}`)
  },
  
  // 创建演练方案
  createPlan: (data: any) => {
    return request.post('/drill-plans', data)
  },
  
  // 更新演练方案
  updatePlan: (id: string, data: any) => {
    return request.put(`/drill-plans/${id}`, data)
  },
  
  // 删除演练方案
  deletePlan: (id: string) => {
    return request.delete(`/drill-plans/${id}`)
  },
  
  // 提交演练方案
  submitPlan: (id: string) => {
    return request.post(`/drill-plans/${id}/submit`)
  },
  
  // 审核演练方案
  reviewPlan: (data: { planId: number; approved: boolean; reviewComment?: string; reviewerId?: number; reviewerName?: string }) => {
    return request.post('/drill-plans/review', data)
  },
  
  // 获取待审核的演练方案列表
  getPendingReviewPlans: () => {
    return request.get('/drill-plans/pending-review')
  },
  
  // 根据演练申请ID获取演练方案
  getPlanByApplicationId: (applicationId: string) => {
    return request.get(`/drill-plans/by-application/${applicationId}`)
  },
  
  // 上传方案文档
  uploadDocument: (id: string, data: FormData) => {
    return request.post(`/drill-plans/${id}/documents`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // 删除方案文档
  deleteDocument: (documentId: string) => {
    return request.delete(`/drill-plans/documents/${documentId}`)
  }
}

// 字典配置相关API
export const dictionaryApi = {
  // 根据字典类型获取字典项
  getDictionariesByType: (dictType: string) => {
    return request.get(`/dictionaries/type/${dictType}`)
  },
  
  // 获取演练类型字典
  getDrillTypes: () => {
    return request.get('/dictionaries/drill-types')
  },
  
  // 获取申请状态字典
  getApplicationStatuses: () => {
    return request.get('/dictionaries/application-statuses')
  },
  
  // 获取预案类型字典
  getPlanTypes: () => {
    return request.get('/dictionaries/plan-types')
  }
}

// 组织架构相关API
export const organizationApi = {
  // 根据父级ID获取子组织
  getOrganizationsByParentId: (parentId: string) => {
    return request.get(`/organizations/parent/${parentId}`)
  },
  
  // 根据组织类型获取组织
  getOrganizationsByType: (orgType: string) => {
    return request.get(`/organizations/type/${orgType}`)
  },
  
  // 根据组织名称模糊查询
  searchOrganizationsByName: (orgName: string) => {
    return request.get('/organizations/search', { params: { orgName } })
  },
  
  // 获取所有启用的组织
  getAllEnabledOrganizations: () => {
    return request.get('/organizations/all')
  },
  
  // 获取所有部门
  getAllDepartments: () => {
    return request.get('/organizations/departments')
  },
  
  // 获取所有科室
  getAllOffices: () => {
    return request.get('/organizations/offices')
  }
}

// 预案管理相关API
export const emergencyPlanApi = {
  // 根据预案编码获取预案
  getEmergencyPlanByCode: (planCode: string) => {
    return request.get(`/emergency-plans/code/${planCode}`)
  },
  
  // 根据预案名称模糊查询
  searchEmergencyPlansByName: (planName: string) => {
    return request.get('/emergency-plans/search', { params: { planName } })
  },
  
  // 根据预案类型获取预案
  getEmergencyPlansByType: (planType: string) => {
    return request.get(`/emergency-plans/type/${planType}`)
  },
  
  // 获取所有有效的预案
  getAllActiveEmergencyPlans: () => {
    return request.get('/emergency-plans/all')
  },
  
  // 根据预案级别获取预案
  getEmergencyPlansByLevel: (planLevel: string) => {
    return request.get(`/emergency-plans/level/${planLevel}`)
  }
}

// 统计相关API
export const statisticsApi = {
  // 获取统计数据
  getStatistics: () => {
    return request.get('/statistics/overview')
  },
  
  // 获取图表数据
  getChartData: (type: string, params?: any) => {
    return request.get(`/statistics/charts/${type}`, { params })
  }
}
