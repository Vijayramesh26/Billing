import { defineStore } from 'pinia'
import EventServices from '@/services/EventServices'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false
  }),
  getters: {
    categoryNames: (state) => state.categories.map(c => c.name)
  },
  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const res = await EventServices.getCategories()
        this.categories = res.data
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        this.loading = false
      }
    },
    async createCategory(payload) {
      try {
        const res = await EventServices.createCategory(payload)
        this.categories.push(res.data)
        return res.data
      } catch (error) {
        throw error
      }
    }
  }
})
