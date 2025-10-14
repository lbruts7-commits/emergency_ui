// 消息类型
export type MessageType = 'success' | 'error' | 'warning' | 'info'

// 消息配置接口
interface MessageConfig {
  type: MessageType
  message: string
  duration?: number
  showClose?: boolean
}

// 消息实例接口
interface MessageInstance {
  id: string
  config: MessageConfig
  element?: HTMLElement
  timer?: number
}

// 消息队列
let messageQueue: MessageInstance[] = []
let messageId = 0

// 创建消息元素
const createMessageElement = (config: MessageConfig): HTMLElement => {
  const messageEl = document.createElement('div')
  messageEl.className = 'fixed top-4 right-4 z-50 max-w-sm w-full'
  
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  const iconClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  
  const icons = {
    success: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>`,
    error: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
    </svg>`,
    warning: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
    </svg>`,
    info: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
    </svg>`
  }
  
  messageEl.innerHTML = `
    <div class="rounded-md border p-4 shadow-lg ${typeClasses[config.type]} animate-slide-in">
      <div class="flex">
        <div class="flex-shrink-0">
          <div class="${iconClasses[config.type]}">
            ${icons[config.type]}
          </div>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium">${config.message}</p>
        </div>
        ${config.showClose !== false ? `
          <div class="ml-auto pl-3">
            <div class="-mx-1.5 -my-1.5">
              <button class="inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                <span class="sr-only">关闭</span>
                <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `
  
  // 添加关闭按钮事件
  const closeBtn = messageEl.querySelector('button')
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      removeMessage(messageEl)
    })
  }
  
  return messageEl
}

// 显示消息
const showMessage = (message: string, type: MessageType = 'info', duration: number = 3000): void => {
  const config: MessageConfig = {
    type,
    message,
    duration,
    showClose: true
  }
  
  const instance: MessageInstance = {
    id: `message-${++messageId}`,
    config
  }
  
  // 创建消息元素
  const messageEl = createMessageElement(config)
  instance.element = messageEl
  
  // 添加到DOM
  document.body.appendChild(messageEl)
  
  // 添加到队列
  messageQueue.push(instance)
  
  // 调整位置
  updateMessagePositions()
  
  // 设置自动关闭
  if (duration > 0) {
    instance.timer = window.setTimeout(() => {
      removeMessage(messageEl)
    }, duration)
  }
}

// 移除消息
const removeMessage = (messageEl: HTMLElement): void => {
  if (!messageEl || !messageEl.parentNode) return
  
  // 添加移除动画
  messageEl.style.animation = 'slide-out 0.3s ease-in-out forwards'
  
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.parentNode.removeChild(messageEl)
    }
    
    // 从队列中移除
    const index = messageQueue.findIndex(item => item.element === messageEl)
    if (index > -1) {
      const instance = messageQueue[index]
      if (instance.timer) {
        clearTimeout(instance.timer)
      }
      messageQueue.splice(index, 1)
    }
    
    // 重新调整位置
    updateMessagePositions()
  }, 300)
}

// 更新消息位置
const updateMessagePositions = (): void => {
  messageQueue.forEach((instance, index) => {
    if (instance.element) {
      instance.element.style.top = `${16 + index * 80}px`
    }
  })
}

// 清空所有消息
const clearMessages = (): void => {
  messageQueue.forEach(instance => {
    if (instance.element && instance.element.parentNode) {
      instance.element.parentNode.removeChild(instance.element)
    }
    if (instance.timer) {
      clearTimeout(instance.timer)
    }
  })
  messageQueue = []
}

// 添加CSS动画样式
const addMessageStyles = (): void => {
  if (document.getElementById('message-styles')) return
  
  const style = document.createElement('style')
  style.id = 'message-styles'
  style.textContent = `
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slide-out {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .animate-slide-in {
      animation: slide-in 0.3s ease-in-out;
    }
  `
  document.head.appendChild(style)
}

// 初始化样式
addMessageStyles()

// 导出方法
export { showMessage, clearMessages }

// 便捷方法
export const message = {
  success: (msg: string, duration?: number) => showMessage(msg, 'success', duration),
  error: (msg: string, duration?: number) => showMessage(msg, 'error', duration),
  warning: (msg: string, duration?: number) => showMessage(msg, 'warning', duration),
  info: (msg: string, duration?: number) => showMessage(msg, 'info', duration)
}
