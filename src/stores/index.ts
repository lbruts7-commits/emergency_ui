import { defineStore } from 'pinia'

// 用户状态管理
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as any,
    token: localStorage.getItem('token') || '',
    isLoggedIn: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && state.isLoggedIn
  },
  
  actions: {
    setToken(token: string) {
      this.token = token
      this.isLoggedIn = true
      localStorage.setItem('token', token)
    },
    
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
    
    logout() {
      this.token = ''
      this.userInfo = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
    }
  }
})

// 应用状态管理
export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    theme: 'light' as 'light' | 'dark',
    sidebarCollapsed: false
  }),
  
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
    
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
    
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    }
  }
})
