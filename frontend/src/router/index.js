import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/admin',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      { path: '', name: 'AdminStats', component: () => import('../views/admin/Stats.vue') },
      { path: 'employees', name: 'AdminEmployees', component: () => import('../views/admin/Employees.vue') },
      { path: 'history', name: 'AdminHistory', component: () => import('../views/admin/History.vue') },
    ]
  },
  {
    path: '/inventory',
    component: () => import('../views/inventory/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'inventory', 'manager'] },
    children: [
      { path: '', name: 'InventoryHome', component: () => import('../views/inventory/Home.vue') },
      { path: 'products', name: 'InventoryProducts', component: () => import('../views/inventory/ProductList.vue') },
      { path: 'categories', name: 'InventoryCategories', component: () => import('../views/inventory/Categories.vue') }, // Added
      { path: 'stock', name: 'InventoryStock', component: () => import('../views/inventory/AddStock.vue') },
      { path: 'alerts', name: 'InventoryAlerts', component: () => import('../views/inventory/Alerts.vue') },
    ]
  },
  {
    path: '/billing',
    component: () => import('../views/biller/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'biller'] },
    children: [
      { path: '', name: 'BillerHome', component: () => import('../views/biller/Home.vue') },
      { path: 'pos', name: 'BillingPOS', component: () => import('../views/biller/Billing.vue') },
      { path: 'orders', name: 'BillerOrders', component: () => import('../views/biller/Orders.vue') },
      { path: 'stock', name: 'BillerStock', component: () => import('../views/inventory/StockView.vue') },
    ]
  },
  {
    path: '/manager',
    component: () => import('../views/manager/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager'] },
    children: [
       { path: '', name: 'ManagerHome', component: () => import('../views/manager/Home.vue') },
       { path: 'reports', name: 'ManagerReports', component: () => import('../views/manager/Reports.vue') },
       { path: 'orders', name: 'ManagerOrders', component: () => import('../views/manager/Orders.vue') },
       { path: 'stock', name: 'ManagerStockView', component: () => import('../views/inventory/StockView.vue') }, // Use shared modern view
       { path: 'entry', name: 'ManagerStockEntry', component: () => import('../views/manager/StockEntry.vue') },
       { path: 'customers', name: 'ManagerCustomers', component: () => import('../views/manager/Customers.vue') },
       { path: 'discount', name: 'ManagerDiscount', component: () => import('../views/manager/Discount.vue') },
    ]
  },
  // Public Routes (Website)
  {
    path: '/shop',
    component: () => import('../layouts/ShopLayout.vue'),
    children: [
      { path: '', name: 'ShopHome', component: () => import('../views/public/shop/Home.vue') },
      { path: 'home', redirect: '/shop' },
      { path: 'products', name: 'ShopProducts', component: () => import('../views/public/shop/Products.vue') },
      { path: 'about', name: 'ShopAbout', component: () => import('../views/public/shop/About.vue') },
      { path: 'contact', name: 'ShopContact', component: () => import('../views/public/shop/Contact.vue') },
      { path: 'gallery', name: 'ShopGallery', component: () => import('../views/public/shop/Gallery.vue') },
    ]
  },
  // Redirect old public route if any access it directly
  { path: '/public/shop', redirect: '/shop' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const allowedRoles = to.meta.roles

  if (requiresAuth && !authStore.token) {
    next('/login')
  } else if (requiresAuth && allowedRoles) {
    if (allowedRoles.includes(authStore.role)) {
      next()
    } else {
      next('/login') // Or 403 page
    }
  } else {
    next()
  }
})

export default router
