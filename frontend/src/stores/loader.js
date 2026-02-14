import { defineStore } from 'pinia'

export const useLoaderStore = defineStore('loader', {
  state: () => ({
    loadingCount: 0
  }),
  getters: {
    isLoading: (state) => state.loadingCount > 0
  },
  actions: {
    show() {
      this.loadingCount++
    },
    hide() {
      if (this.loadingCount > 0) {
        this.loadingCount--
      }
    }
  }
})
