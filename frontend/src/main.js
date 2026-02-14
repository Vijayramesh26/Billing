import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { createPinia } from 'pinia'
import axios from 'axios'
import { useLoaderStore } from './stores/loader'
import './styles.css'

// Configure Axios base URL (assuming proxy will handle /api)
// axios.defaults.baseURL = 'http://localhost:8080' 

const pinia = createPinia()
const app = createApp(App)

app.use(vuetify)
app.use(pinia)
app.use(router)

// Add Axios Interceptor to inject token
// Add Axios Interceptor to inject token and handle loader
axios.interceptors.request.use(config => {
  const loaderStore = useLoaderStore()
  
  // Check if current route is NOT a shop route
  if (!window.location.pathname.startsWith('/shop')) {
      loaderStore.show()
      config.triggerGlobalLoader = true
  }

  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  const loaderStore = useLoaderStore()
  loaderStore.hide()
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  const loaderStore = useLoaderStore()
  if (response.config.triggerGlobalLoader) {
      loaderStore.hide()
  }
  return response
}, error => {
  const loaderStore = useLoaderStore()
  loaderStore.hide()
  return Promise.reject(error)
})

app.mount('#app')
