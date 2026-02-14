import { defineStore } from 'pinia'
import EventServices from '../services/EventServices'

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null;
    try {
      const storedUser = localStorage.getItem('user');
      user = storedUser ? JSON.parse(storedUser) : null;
      // If it's just a string, it might not be a valid JSON object.
      // Pinia's legacy might have stored "username" instead of {"id":..., "username":...}
      if (typeof user === 'string') {
        user = { username: user, id: null };
      }
    } catch (e) {
      user = { username: localStorage.getItem('user'), id: null };
    }

    return {
      token: localStorage.getItem('token') || null,
      user: user,
      role: localStorage.getItem('role') || null,
    }
  },
  actions: {
    async login(employeeId, password) {
      try {
        const response = await EventServices.login(employeeId, password)
        
        this.token = response.data.token
        this.user = {
          id: response.data.id,
          username: response.data.username
        }
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
