<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <!-- 标题 -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-900">场景搭建</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="mt-4 max-h-[60vh] overflow-y-auto">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 演练事件类型 -->
            <div>
              <label class="label required">演练事件类型</label>
              <select v-model="formData.eventType" class="input" required>
                <option value="">请选择</option>
                <option v-for="item in dictionaries.eventTypes" :key="item.dictCode" :value="item.dictCode">
                  {{ item.dictName }}
                </option>
              </select>
            </div>

            <!-- 演练事件等级 -->
            <div>
              <label class="label required">演练事件等级</label>
              <select v-model="formData.eventLevel" class="input" required>
                <option value="">请选择</option>
                <option v-for="item in dictionaries.eventLevels" :key="item.dictCode" :value="item.dictCode">
                  {{ item.dictName }}
                </option>
              </select>
            </div>

            <!-- 演练事件级别 -->
            <div>
              <label class="label required">演练事件级别</label>
              <select v-model="formData.eventGrade" class="input" required>
                <option value="">请选择</option>
                <option v-for="office in offices" :key="office.id" :value="office.orgName">
                  {{ office.orgName }}
                </option>
              </select>
            </div>

            <!-- 航空器着火部位 -->
            <div>
              <label class="label">航空器着火部位</label>
              <select v-model="formData.fireLocation" class="input">
                <option value="">请选择</option>
                <option v-for="item in dictionaries.fireLocations" :key="item.dictCode" :value="item.dictCode">
                  {{ item.dictName }}
                </option>
              </select>
            </div>

            <!-- 事件发生时间 -->
            <div>
              <label class="label required">事件发生时间</label>
              <input
                v-model="formData.eventTime"
                type="datetime-local"
                class="input"
                required
              />
            </div>

            <!-- 天气情况 -->
            <div>
              <label class="label required">天气情况</label>
              <select v-model="formData.weatherCondition" class="input" required>
                <option value="">请选择</option>
                <option v-for="item in dictionaries.weatherConditions" :key="item.dictCode" :value="item.dictCode">
                  {{ item.dictName }}
                </option>
              </select>
            </div>

            <!-- 风力风向 -->
            <div>
              <label class="label required">风力风向</label>
              <select v-model="formData.windCondition" class="input" required>
                <option value="">请选择</option>
                <option v-for="item in dictionaries.windConditions" :key="item.dictCode" :value="item.dictCode">
                  {{ item.dictName }}
                </option>
              </select>
            </div>

            <!-- 火势情况 -->
            <div>
              <label class="label required">火势情况</label>
              <select v-model="formData.fireCondition" class="input" required>
                <option value="">请选择</option>
                <option v-for="item in dictionaries.fireConditions" :key="item.dictCode" :value="item.dictCode">
                  {{ item.dictName }}
                </option>
              </select>
            </div>

            <!-- 旅客人数 -->
            <div>
              <label class="label required">旅客人数</label>
              <input
                v-model.number="formData.passengerCount"
                type="number"
                min="0"
                class="input"
                placeholder="请输入旅客人数"
                required
              />
            </div>

            <!-- 事故点地势 -->
            <div>
              <label class="label required">事故点地势</label>
              <select v-model="formData.terrainCondition" class="input" required>
                <option value="">请选择</option>
                <option v-for="item in dictionaries.terrainConditions" :key="item.dictCode" :value="item.dictCode">
                  {{ item.dictName }}
                </option>
              </select>
            </div>

            <!-- 伤亡情况 -->
            <div>
              <label class="label">伤亡情况</label>
              <input
                v-model="formData.casualtyInfo"
                type="text"
                class="input"
                placeholder="例如：轻伤3人,重伤1人"
              />
            </div>

            <!-- 油量余量 -->
            <div>
              <label class="label">油量余量(升)</label>
              <input
                v-model="formData.fuelLevel"
                type="text"
                class="input"
                placeholder="请输入油量余量"
              />
            </div>

            <!-- 是否有危险品 -->
            <div>
              <label class="label required">是否有危险品</label>
              <select v-model="formData.hasDangerousGoods" class="input" required>
                <option value="">请选择</option>
                <option v-for="item in dictionaries.hasHazmat" :key="item.dictCode" :value="item.dictCode">
                  {{ item.dictName }}
                </option>
              </select>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex justify-end space-x-4 mt-6 pt-4 border-t">
            <button
              type="button"
              @click="closeModal"
              class="btn btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '模型搭建' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import request from '@/utils/request'
import { showMessage } from '@/utils/message'

const props = defineProps<{
  visible: boolean
  executionData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

// 表单数据
const formData = ref({
  executionId: 0,
  eventType: '',
  eventLevel: '',
  eventGrade: '',
  fireLocation: '',
  eventTime: '',
  weatherCondition: '',
  windCondition: '',
  fireCondition: '',
  passengerCount: 0,
  terrainCondition: '',
  casualtyInfo: '',
  fuelLevel: '',
  hasDangerousGoods: ''
})

// 字典数据
const dictionaries = ref({
  eventTypes: [],
  eventLevels: [],
  fireLocations: [],
  weatherConditions: [],
  windConditions: [],
  fireConditions: [],
  terrainConditions: [],
  hasHazmat: []
})

// 科室数据(用于事件级别)
const offices = ref([])

const isSubmitting = ref(false)

// 加载字典数据
const loadDictionaries = async () => {
  try {
    // 加载所有需要的字典类型
    const dictTypes = [
      'DRILL_EVENT_TYPE',
      'DRILL_EVENT_LEVEL', 
      'FIRE_LOCATION',
      'WEATHER_CONDITION',
      'WIND_CONDITION',
      'FIRE_CONDITION',
      'TERRAIN_CONDITION',
      'HAS_HAZMAT'
    ]

    const promises = dictTypes.map(type => 
      request.get(`/dictionaries/type/${type}`)
    )

    const results = await Promise.all(promises)

    dictionaries.value = {
      eventTypes: results[0].data || [],
      eventLevels: results[1].data || [],
      fireLocations: results[2].data || [],
      weatherConditions: results[3].data || [],
      windConditions: results[4].data || [],
      fireConditions: results[5].data || [],
      terrainConditions: results[6].data || [],
      hasHazmat: results[7].data || []
    }
  } catch (error) {
    console.error('加载字典数据失败:', error)
    showMessage('加载字典数据失败', 'error')
  }
}

// 加载科室数据
const loadOffices = async () => {
  try {
    const response = await request.get('/offices')
    offices.value = response.data || []
  } catch (error) {
    console.error('加载科室数据失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    executionId: 0,
    eventType: '',
    eventLevel: '',
    eventGrade: '',
    fireLocation: '',
    eventTime: '',
    weatherCondition: '',
    windCondition: '',
    fireCondition: '',
    passengerCount: 0,
    terrainCondition: '',
    casualtyInfo: '',
    fuelLevel: '',
    hasDangerousGoods: ''
  }
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadDictionaries()
    loadOffices()
    if (props.executionData) {
      formData.value.executionId = props.executionData.id
      // 如果有已保存的场景数据，填充到表单
      if (props.executionData.scenarioData) {
        Object.assign(formData.value, props.executionData.scenarioData)
      }
    }
  } else {
    resetForm()
  }
})

// 提交表单
const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    await request.post('/drill-executions/scenario', formData.value)
    
    showMessage('场景配置成功!', 'success')
    
    // 延迟关闭，显示成功消息
    setTimeout(() => {
      emit('success')
      emit('close')
    }, 1500)
  } catch (error: any) {
    console.error('场景配置失败:', error)
    showMessage(error.response?.data?.message || '场景配置失败', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 初始化
onMounted(() => {
  if (props.visible) {
    loadDictionaries()
    loadOffices()
  }
})
</script>

<style scoped>
.label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}
</style>



