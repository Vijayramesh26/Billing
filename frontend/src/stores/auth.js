import { defineStore } from 'pinia'
import EventServices from '../services/EventServices'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: localStorage.getItem('role') || null,
  }),
  actions: {
    async login(employeeId, password) {
      try {
        const response = await EventServices.login(employeeId, password)
        
        this.token = response.data.token
        this.user = response.data.username
        this.role = response.data.role

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('role', this.role)
        
        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    }
  }
})
