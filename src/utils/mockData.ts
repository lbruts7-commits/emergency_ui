// 模拟数据
export const mockDrillApplications = [
  {
    id: '1',
    subject: '火灾',
    type: '桌面演练',
    participantDept: '安全部',
    organizerDept: '安全部',
    planId: '1',
    planName: '火灾应急预案',
    planTime: '2024-01-15T09:00:00',
    description: '桌面演练测试，模拟火灾应急响应流程',
    affectOperation: false,
    status: 'submitted',
    creator: '张三',
    createTime: '2024-01-10T10:00:00',
    submitTime: '2024-01-10T14:30:00',
    updateTime: '2024-01-10T14:30:00',
    attachments: [
      {
        name: '演练计划书.pdf',
        size: 1024000,
        uploadTime: '2024-01-10T10:30:00'
      }
    ]
  },
  {
    id: '2',
    subject: '地震',
    type: '实战演练',
    participantDept: '生产部',
    organizerDept: '安全部',
    planId: '2',
    planName: '地震应急预案',
    planTime: '2024-01-20T14:00:00',
    description: '实战演练测试，检验地震应急响应能力',
    affectOperation: true,
    status: 'approved',
    creator: '李四',
    createTime: '2024-01-12T09:00:00',
    submitTime: '2024-01-12T16:00:00',
    updateTime: '2024-01-13T10:00:00',
    attachments: []
  },
  {
    id: '3',
    subject: '洪水',
    type: '综合演练',
    participantDept: '技术部',
    organizerDept: '安全部',
    planId: '3',
    planName: '洪水应急预案',
    planTime: '2024-01-25T08:00:00',
    description: '综合演练测试，多部门协同应对洪水灾害',
    affectOperation: false,
    status: 'draft',
    creator: '王五',
    createTime: '2024-01-14T11:00:00',
    submitTime: null,
    updateTime: '2024-01-14T11:00:00',
    attachments: []
  }
]

export const mockDrillPlans = [
  {
    id: '1',
    applicationId: '1',
    subject: '火灾',
    type: '桌面演练',
    participantDept: '安全部',
    organizerDept: '安全部',
    planName: '火灾应急预案',
    planTime: '2024-01-15T09:00:00',
    description: '桌面演练方案详细说明，包括演练目标、流程、人员分工等',
    status: 'pending',
    creator: '张三',
    createTime: '2024-01-11T10:00:00',
    submitTime: '2024-01-11T15:00:00',
    updateTime: '2024-01-11T15:00:00',
    document: {
      name: '火灾演练方案.docx',
      size: 2048000,
      uploadTime: '2024-01-11T10:30:00'
    },
    auditInfo: null
  },
  {
    id: '2',
    applicationId: '2',
    subject: '地震',
    type: '实战演练',
    participantDept: '生产部',
    organizerDept: '安全部',
    planName: '地震应急预案',
    planTime: '2024-01-20T14:00:00',
    description: '实战演练方案详细说明，包括演练场景、设备准备、安全措施等',
    status: 'approved',
    creator: '李四',
    createTime: '2024-01-13T09:00:00',
    submitTime: '2024-01-13T14:00:00',
    updateTime: '2024-01-13T16:00:00',
    document: {
      name: '地震演练方案.pdf',
      size: 3072000,
      uploadTime: '2024-01-13T09:30:00'
    },
    auditInfo: {
      auditor: '赵六',
      auditTime: '2024-01-13T16:00:00',
      result: 'approved',
      comment: '方案内容完整，符合实战演练要求，同意通过'
    }
  },
  {
    id: '3',
    applicationId: '3',
    subject: '洪水',
    type: '综合演练',
    participantDept: '技术部',
    organizerDept: '安全部',
    planName: '洪水应急预案',
    planTime: '2024-01-25T08:00:00',
    description: '综合演练方案详细说明，包括多部门协调、资源配置、应急预案等',
    status: 'rejected',
    creator: '王五',
    createTime: '2024-01-15T10:00:00',
    submitTime: '2024-01-15T16:00:00',
    updateTime: '2024-01-16T09:00:00',
    document: {
      name: '洪水演练方案.docx',
      size: 2560000,
      uploadTime: '2024-01-15T10:30:00'
    },
    auditInfo: {
      auditor: '赵六',
      auditTime: '2024-01-16T09:00:00',
      result: 'rejected',
      comment: '方案中缺少关键安全措施，需要补充完善后重新提交'
    }
  }
]

export const mockPlans = [
  { id: '1', name: '火灾应急预案' },
  { id: '2', name: '地震应急预案' },
  { id: '3', name: '洪水应急预案' },
  { id: '4', name: '化学品泄漏应急预案' },
  { id: '5', name: '网络安全应急预案' }
]
