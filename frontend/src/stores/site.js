import { defineStore } from 'pinia'
import axios from 'axios'

export const useSiteStore = defineStore('site', {
  state: () => ({
    siteInfo: {
      name: 'Seyyal',
      tagline: 'Loading...',
      description: '',
      logo: '/logo.svg',
      address: '',
      phone: '',
      email: '',
      socials: {}
    },
    loading: false
  }),
  actions: {
    async fetchSiteInfo() {
      this.loading = true
      try {
        // Use relative path which proxys to backend or absolute URL if configured
        const res = await axios.get('/api/v1/public/site-info') 
        this.siteInfo = res.data
      } catch (error) {
        console.error('Failed to fetch site info:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
