<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-secondary">Welcome Back, {{ user?.username || 'Inventory Manager' }}</h1>
      <p class="text-subtitle-1 text-medium-emphasis">Manage your stock and products efficiently.</p>
    </div>

    <!-- Stats Row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="4">
        <v-card class="rounded-xl pa-4 h-100 bg-surface elevation-2" border>
            <div class="d-flex align-center justify-space-between mb-2">
                <div class="text-subtitle-1 text-medium-emphasis">Total Products</div>
                <v-avatar color="secondary" variant="tonal" rounded>
                    <v-icon color="secondary">mdi-package-variant</v-icon>
                </v-avatar>
            </div>
            <div class="text-h3 font-weight-bold">{{ totalProducts }}</div>
             <div class="text-caption text-medium-emphasis mt-2">Active items in catalog</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="rounded-xl pa-4 h-100 bg-surface elevation-2" border>
             <div class="d-flex align-center justify-space-between mb-2">
                <div class="text-subtitle-1 text-medium-emphasis">Low Stock Alerts</div>
                <v-avatar color="error" variant="tonal" rounded>
                    <v-icon color="error">mdi-alert-circle-outline</v-icon>
                </v-avatar>
            </div>
            <div class="text-h3 font-weight-bold text-error">{{ lowStockCount }}</div>
            <div class="text-caption text-medium-emphasis mt-2">Items below threshold</div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="4">
        <v-card class="rounded-xl pa-4 h-100 bg-surface elevation-2" border>
             <div class="d-flex align-center justify-space-between mb-2">
                <div class="text-subtitle-1 text-medium-emphasis">Total Stock Value</div>
                <v-avatar color="success" variant="tonal" rounded>
                    <v-icon color="success">mdi-currency-inr</v-icon>
                </v-avatar>
            </div>
            <div class="text-h3 font-weight-bold">₹{{ formatCurrency(totalValue) }}</div>
            <div class="text-caption text-medium-emphasis mt-2">Estimated inventory value</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <div class="mb-4">
        <h2 class="text-h6 font-weight-bold mb-3">Quick Actions</h2>
        <v-row>
             <v-col cols="12" sm="6" md="3">
                <v-card to="/inventory/stock" link hover class="rounded-lg pa-4 elevation-1 text-center" border>
                    <v-icon size="32" color="secondary" class="mb-2">mdi-plus-box-outline</v-icon>
                    <div class="font-weight-medium">Add Stock</div>
                </v-card>
             </v-col>
             <v-col cols="12" sm="6" md="3">
                <v-card to="/inventory/products" link hover class="rounded-lg pa-4 elevation-1 text-center" border>
                    <v-icon size="32" color="secondary" class="mb-2">mdi-format-list-bulleted</v-icon>
                    <div class="font-weight-medium">View Products</div>
                </v-card>
             </v-col>
               <v-col cols="12" sm="6" md="3">
                <v-card to="/inventory/alerts" link hover class="rounded-lg pa-4 elevation-1 text-center" border>
                    <v-icon size="32" color="error" class="mb-2">mdi-bell-outline</v-icon>
                    <div class="font-weight-medium">Check Alerts</div>
                </v-card>
             </v-col>
        </v-row>
    </div>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'
import { mapState } from 'pinia'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'InventoryHome',
  data() {
    return {
      totalProducts: 0,
      lowStockCount: 0,
      totalValue: 0,
      loading: true,
      stats: [
        { title: 'Total Products', value: '0', icon: 'mdi-package-variant', color: 'primary' },
        { title: 'Low Stock Alerts', value: '0', icon: 'mdi-alert-circle', color: 'error' },
      ],
      quickActions: [
        { title: 'Add Stock', icon: 'mdi-plus-box', to: '/inventory/stock', color: 'success' },
        { title: 'View Alerts', icon: 'mdi-bell-ring', to: '/inventory/alerts', color: 'warning' },
        { title: 'Product List', icon: 'mdi-format-list-bulleted', to: '/inventory/products', color: 'info' }
      ]
    }
  },
  computed: {
    ...mapState(useAuthStore, ['user'])
  },
  methods: {
    formatCurrency(val) {
      return val ? val.toLocaleString('en-IN') : '0'
    }
  },
  async mounted() {
    try {
      // Fetch all products to calculate stats
      // Note: For large datasets, this should be a dedicated backend endpoint
      const productsRes = await EventServices.getProducts()
      const products = productsRes.data || []
      
      this.totalProducts = products.length
      this.totalValue = products.reduce((sum, p) => sum + (p.unit_price * p.current_stock), 0)

      // Fetch alerts
      const alertsRes = await EventServices.getAlerts()
      const alerts = alertsRes.data || []
      this.lowStockCount = alerts.length

      // The provided snippet also had these, keeping them for completeness if they were intended for a different part of the template
      this.stats[0].value = (productsRes.data?.length || 0).toString()
      this.stats[1].value = (alertsRes.data?.length || 0).toString()

    } catch (e) {
        console.error("Failed to fetch inventory stats", e)
    }
  }
}
</script>
