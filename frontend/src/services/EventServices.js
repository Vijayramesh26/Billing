import axios from 'axios'
import { useLoaderStore } from '@/stores/loader'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Request interceptor to add token and show loader
apiClient.interceptors.request.use(config => {
    const loaderStore = useLoaderStore()
    
    // Check if current route is NOT a shop route AND skipGlobalLoader is not set
    if (!window.location.pathname.startsWith('/shop') && !config.skipGlobalLoader) {
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
    // We can't easily access config here to check triggerGlobalLoader, 
    // but hiding it is generally safe as the store handles the counter.
    // However, to be strict, we might want to avoid it, but for error cases 
    // it's better to ensure it's hidden if it was shown.
    // Since we can't know for sure if it was shown without config, 
    // we'll rely on the store's robustness (decrementing 0 stays 0).
    loaderStore.hide()
    return Promise.reject(error)
})

// Response interceptor to hide loader
apiClient.interceptors.response.use(response => {
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

export default {
    // Auth
    login(employeeId, password) {
        return apiClient.post('/auth/login', {
            employee_id: employeeId,
            password: password
        })
    },

    // Public
    getConfig() {
        return apiClient.get('/public/config')
    },

    // Products
    getProducts() {
        return apiClient.get('/inventory/products')
    },
    addProduct(product) {
        return apiClient.post('/inventory/products', product)
    },
    addStock(stock) {
        return apiClient.post('/inventory/stock', stock)
    },
    getBrands() {
        return apiClient.get('/inventory/brands')
    },
    getLowStockAlerts() {
        return apiClient.get('/inventory/alerts')
    },
    // Categories
    getCategories() {
        return apiClient.get('/inventory/categories')
    },
    createCategory(category) {
        return apiClient.post('/inventory/categories', category)
    },

    // Manager
    getManagerStats() {
        return apiClient.get('/manager/dashboard')
    },
    
    getOrders(params) {
        return apiClient.get('/billing/orders', { params })
    },

    updateOrderStatus(orderId, status) {
        return apiClient.put(`/billing/orders/${orderId}/status`, { status })
    },

    getCustomers() {
        return apiClient.get('/manager/customers')
    },

    updateCustomerDiscount(customerId, discountData) {
        return apiClient.put(`/manager/customers/${customerId}/discount`, discountData)
    },

    getReports(type, params) {
        return apiClient.get(`/manager/reports/${type}`, { params })
    },

    // Manager Settings
    updateGlobalDiscount(data) {
        return apiClient.post('/manager/settings/discount', data)
    },
    getDiscountRules() {
        return apiClient.get('/manager/settings/discount-rules')
    },
    addDiscountRule(rule) {
        return apiClient.post('/manager/settings/discount-rules', rule)
    },
    deleteDiscountRule(id) {
        return apiClient.delete(`/manager/settings/discount-rules/${id}`)
    },

    // Public
    getPublicProducts() {
        return apiClient.get('/public/products')
    },

    submitOrder(orderData) {
        return apiClient.post('/public/orders', orderData)
    },

    // Biller
    createBill(billData) {
        return apiClient.post('/billing/bills', billData)
    },
    
    getBills(params) {
        return apiClient.get('/billing/bills', { params })
    },
    
    searchCustomers(query) {
       return apiClient.get(`/billing/customers?q=${query}`)
    },
    
    getBillerCustomers() {
        return apiClient.get('/billing/customers')
    },

    createCustomer(customerData) {
        return apiClient.post('/billing/customers', customerData)
    },

    getMySales() {
        return apiClient.get('/billing/my-sales')
    },

    getDiscountRules() {
        return apiClient.get('/billing/discount-rules')
    },

    getBillingDiscount() {
        return apiClient.get('/billing/discount')
    },

    getNextBillNo() {
        return apiClient.get('/billing/next-bill-no')
    },

    // Admin
    getAdminStats() {
        return apiClient.get('/admin/dashboard')
    },
    getEmployees() {
        return apiClient.get('/admin/employees')
    },
    addEmployee(employeeData) {
        return apiClient.post('/admin/employees', employeeData, { skipGlobalLoader: true })
    },
    resetEmployeePassword(id, password) {
        return apiClient.put(`/admin/employees/${id}/password`, { password }, { skipGlobalLoader: true })
    },
    changePassword(password) {
        return apiClient.put('/admin/me/password', { password }, { skipGlobalLoader: true })
    },
    updateEmployeeStatus(id, status) {
        return apiClient.put(`/admin/employees/${id}/status`, status, { skipGlobalLoader: true })
    },
    updateEmployeeRole(id, role) {
        return apiClient.put(`/admin/employees/${id}/role`, role, { skipGlobalLoader: true })
    },
    updateEmployee(id, employeeData) {
        return apiClient.put(`/admin/employees/${id}`, employeeData, { skipGlobalLoader: true })
    },
    getLoginHistory() {
        return apiClient.get('/admin/login-history')
    }
}
