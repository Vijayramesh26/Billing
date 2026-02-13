import axios from 'axios'

const apiClient = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Request interceptor to add token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => {
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

    // Inventory
    getProducts() {
        return apiClient.get('/inventory/products')
    },

    addProduct(product) {
        return apiClient.post('/inventory/products', product)
    },
    
    // Updated to match backend route /stock
    addStock(stockData) {
        return apiClient.post('/inventory/stock', stockData)
    },

    getAlerts() {
        return apiClient.get('/inventory/alerts')
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
        return apiClient.post('/admin/employees', employeeData)
    },
    updateEmployeeStatus(id, status) {
        return apiClient.put(`/admin/employees/${id}/status`, status)
    },
    updateEmployeeRole(id, role) {
        return apiClient.put(`/admin/employees/${id}/role`, role)
    },
    getLoginHistory() {
        return apiClient.get('/admin/login-history')
    }
}
