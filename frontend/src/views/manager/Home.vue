<template>
  <div class="fill-height">
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center mb-8">
        <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Welcome Back, {{ user?.username || 'Manager' }}</h1>
            <p class="text-subtitle-1 text-grey-darken-1 mt-1 font-weight-medium">Here's what's happening with your store today.</p>
        </div>
        <div class="d-flex align-center bg-white rounded-pill px-4 py-2 elevation-1 mt-4 mt-md-0">
            <v-icon color="primary" class="mr-2">mdi-calendar-today</v-icon>
            <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ currentDate }}</span>
        </div>
    </div>

    <!-- Key Metrics Grid -->
    <v-row class="mb-6">
      <!-- Revenue Card -->
      <v-col cols="12" md="6" lg="3">
        <v-card class="rounded-xl elevation-0 border-thin d-flex align-center pa-5 bg-white modern-card h-100">
           <div class="d-flex flex-column justify-center flex-grow-1">
              <div class="text-caption font-weight-bold text-grey text-uppercase mb-2">Today's Revenue</div>
              <div class="text-h4 font-weight-black text-grey-darken-3">₹{{ metrics.todayRevenue.toLocaleString() }}</div>
              <div class="d-flex align-center mt-2">
                  <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold px-2">
                    <v-icon start icon="mdi-arrow-up" size="x-small"></v-icon> +12%
                  </v-chip>
                  <span class="text-caption text-grey ml-2">vs yesterday</span>
              </div>
           </div>
           <v-avatar color="blue-lighten-5" size="56" class="rounded-xl ml-2">
              <v-icon color="blue-darken-1" size="28">mdi-currency-inr</v-icon>
           </v-avatar>
        </v-card>
      </v-col>

      <!-- Inventory Card -->
      <v-col cols="12" md="6" lg="3">
        <v-card class="rounded-xl elevation-0 border-thin d-flex align-center pa-5 bg-white modern-card h-100">
           <div class="d-flex flex-column justify-center flex-grow-1">
              <div class="text-caption font-weight-bold text-grey text-uppercase mb-2">Inventory Value</div>
              <div class="text-h4 font-weight-black text-grey-darken-3">₹{{ (metrics.inventoryValue / 1000).toFixed(1) }}k</div>
              <div class="d-flex align-center mt-2">
                  <span class="text-caption text-grey">Total Assets</span>
              </div>
           </div>
           <v-avatar color="teal-lighten-5" size="56" class="rounded-xl ml-2">
              <v-icon color="teal-darken-1" size="28">mdi-package-variant-closed</v-icon>
           </v-avatar>
        </v-card>
      </v-col>
      
      <!-- Action Card: Reports -->
      <v-col cols="12" md="4">
         <v-card class="rounded-xl elevation-3 border-none d-flex align-center pa-5 bg-gradient-purple hover-card h-100 text-white" to="/manager" link shadow="lg">
           <div class="d-flex flex-column justify-center flex-grow-1">
              <div class="text-subtitle-2 font-weight-medium text-white mb-1 opacity-80">Analytics</div>
              <div class="text-h5 font-weight-bold">View Reports</div>
              <div class="mt-3">
                  <v-btn variant="tonal" size="small" class="text-none px-3 text-white bg-white-opacity" to="/manager/reports">Explore</v-btn>
              </div>
           </div>
           <v-avatar color="white" variant="tonal" size="56" class="rounded-xl ml-2 bg-white-opacity">
              <v-icon color="white" size="28">mdi-chart-timeline-variant</v-icon>
           </v-avatar>
        </v-card>
      </v-col>
      
      <!-- Action Card: Stock View -->
      <v-col cols="12" md="4">
         <v-card class="rounded-xl elevation-3 border-none d-flex align-center pa-5 bg-gradient-blue hover-card h-100 text-white" to="/manager/stock" link shadow="lg">
           <div class="d-flex flex-column justify-center flex-grow-1">
              <div class="text-subtitle-2 font-weight-medium text-white mb-1 opacity-80">Inventory</div>
              <div class="text-h5 font-weight-bold">Stock View</div>
              <div class="mt-3">
                  <v-btn variant="tonal" size="small" class="text-none px-3 text-white bg-white-opacity" to="/manager/stock">Inspect</v-btn>
              </div>
           </div>
           <v-avatar color="white" variant="tonal" size="56" class="rounded-xl ml-2 bg-white-opacity">
              <v-icon color="white" size="28">mdi-package-variant</v-icon>
           </v-avatar>
        </v-card>
      </v-col>
      
      <!-- Action Card: Stock Entry -->
      <v-col cols="12" md="4">
         <v-card class="rounded-xl elevation-3 border-none d-flex align-center pa-5 bg-gradient-orange hover-card h-100 text-white" to="/manager/entry" link shadow="lg">
           <div class="d-flex flex-column justify-center flex-grow-1">
              <div class="text-subtitle-2 font-weight-medium text-white mb-1 opacity-80">Refill</div>
              <div class="text-h5 font-weight-bold">Add Stock</div>
               <div class="mt-3">
                  <v-btn variant="tonal" size="small" class="text-none px-3 text-white bg-white-opacity" to="/manager/entry">Manage</v-btn>
              </div>
           </div>
           <v-avatar color="white" variant="tonal" size="56" class="rounded-xl ml-2 bg-white-opacity">
              <v-icon color="white" size="28">mdi-plus</v-icon>
           </v-avatar>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="rounded-xl elevation-0 border-thin pa-6 mb-6 bg-white modern-card overflow-hidden">
          <div class="d-flex align-center justify-space-between mb-6">
             <div>
                 <div class="text-h6 font-weight-bold text-grey-darken-3">Sales Performance</div>
                 <div class="text-caption text-grey">Monthly revenue overview</div>
             </div>
             <v-btn icon variant="text" color="grey"><v-icon>mdi-dots-horizontal</v-icon></v-btn>
          </div>
          <div style="height: 320px">
              <MonthlyChart v-if="monthlyData" :data="monthlyData" />
          </div>
        </v-card>
        
        <v-row>
           <v-col cols="12" md="6">
              <v-card class="rounded-xl elevation-0 border-thin pa-6 fill-height bg-white modern-card">
                <div class="d-flex align-center justify-space-between mb-4">
                   <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">Category Distribution</div>
                   <v-icon color="grey-lighten-1" size="small">mdi-chart-pie</v-icon>
                </div>
                <div style="height: 250px" class="d-flex justify-center align-center">
                    <PieChart v-if="categoryData" :data="categoryData" />
                </div>
              </v-card>
           </v-col>
           <v-col cols="12" md="6">
              <v-card class="rounded-xl elevation-0 border-thin pa-6 fill-height bg-white modern-card">
                <div class="d-flex align-center justify-space-between mb-4">
                   <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">Biller Performance</div>
                   <v-icon color="grey-lighten-1" size="small">mdi-account-cash</v-icon>
                </div>
                <div style="height: 250px">
                    <BillerChart v-if="billerData" :data="billerData" />
                </div>
              </v-card>
           </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="4">
         <v-card class="rounded-xl elevation-0 border-thin pa-0 fill-height bg-white modern-card overflow-hidden d-flex flex-column">
          <div class="pa-6 pb-2">
             <div class="text-h6 font-weight-bold text-grey-darken-3">Weekly Goals</div>
             <div class="text-caption text-grey">Performance vs Target</div>
          </div>
          
          <v-list class="pa-0 bg-transparent flex-grow-1">
              <div style="height: 250px" class="px-4">
                 <WeekChart />
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="pa-4">
                  <div class="d-flex align-center justify-space-between mb-3">
                      <div class="d-flex align-center">
                          <v-avatar color="green-lighten-5" size="36" class="mr-3">
                              <v-icon color="green-darken-2" size="18">mdi-trophy</v-icon>
                          </v-avatar>
                          <div>
                              <div class="text-subtitle-2 font-weight-bold">Best Day</div>
                              <div class="text-caption text-grey">Friday</div>
                          </div>
                      </div>
                      <div class="text-subtitle-2 font-weight-bold text-green-darken-2">₹4,200</div>
                  </div>
                  
                   <div class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                          <v-avatar color="red-lighten-5" size="36" class="mr-3">
                              <v-icon color="red-darken-2" size="18">mdi-alert-circle</v-icon>
                          </v-avatar>
                          <div>
                              <div class="text-subtitle-2 font-weight-bold">Low Traffic</div>
                              <div class="text-caption text-grey">Monday</div>
                          </div>
                      </div>
                      <div class="text-subtitle-2 font-weight-bold text-grey-darken-1">₹1,150</div>
                  </div>
              </div>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MonthlyChart from '../../components/charts/MonthlyChart.vue'
import PieChart from '../../components/charts/PieChart.vue'
import BarChart from '../../components/charts/BarChart.vue'
import WeekChart from '../../components/charts/WeekChart.vue'
import BillerChart from '../../components/charts/BillerChart.vue'
import EventServices from '../../services/EventServices'
import { mapState } from 'pinia'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'ManagerHome',
  components: {
    MonthlyChart,
    PieChart,
    BarChart,
    WeekChart,
    BillerChart
  },
  data() {
    return {
      metrics: {
          todayRevenue: 0,
          inventoryValue: 0
      },
      stats: [
          { title: 'Total Current Sales', value: '₹0', icon: 'mdi-cash-multiple', color: 'primary' },
          { title: 'Total Orders', value: '0', icon: 'mdi-cart-outline', color: 'success' },
          { title: 'Low Stock', value: '0', icon: 'mdi-alert-circle-outline', color: 'warning' },
          { title: 'New Customers', value: '0', icon: 'mdi-account-plus', color: 'info' }
      ],
      monthlyData: null,
      categoryData: null,
      billerData: null
    }
  },
  computed: {
    ...mapState(useAuthStore, ['user']),
    currentDate() {
      return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  },
  async mounted() {
    try {
        const res = await EventServices.getManagerStats()
        if (res.data) {
            this.metrics.todayRevenue = res.data.metrics.todayRevenue
            this.metrics.inventoryValue = res.data.metrics.inventoryValue
            
            // stats array mapping
            this.stats[0].value = `₹${(res.data.metrics.totalSales || 0).toLocaleString()}`
            this.stats[1].value = (res.data.metrics.totalOrders || 0).toString()
            this.stats[2].value = (res.data.metrics.lowStock || 0).toString()
            this.stats[3].value = (res.data.metrics.newCustomers || 0).toString()

            // Pass chart data to components using refs if needed, or better, bind data in template
            // Since charts component don't accept props yet in this file's template, I need to update template as well. 
            // BUT wait, I see <MonthlyChart /> with no props. I need to make sure I pass data or the chart component fetches it?
            // The plan said "Bind real data to Chart components".
            // Let's check MonthlyChart again. It accepts `data` prop.
            // So I need to add data properties for charts and bind them.
            
            this.monthlyData = {
                labels: res.data.charts.monthly.labels,
                datasets: [{
                    label: 'Daily Sales',
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    borderColor: '#1976D2',
                    pointBackgroundColor: '#1976D2',
                    fill: true,
                    tension: 0.4,
                    data: res.data.charts.monthly.data
                }]
            }

            this.categoryData = {
                 labels: res.data.charts.category.labels,
                 datasets: [{
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    data: res.data.charts.category.data
                 }]
            }

            this.billerData = {
                labels: res.data.charts.billerSales.labels,
                datasets: [{
                    label: 'Sales by Biller',
                    backgroundColor: '#4CAF50',
                    data: res.data.charts.billerSales.data
                }]
            }
        }
    } catch(e) { console.error("Failed to fetch dashboard stats", e) }
  }
}
</script>

<style scoped>
.modern-card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modern-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1) !important;
}

.border-thin {
    border: 1px solid rgba(0,0,0,0.06) !important;
}

.bg-gradient-purple {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-blue {
    background: linear-gradient(135deg, #2196F3 0%, #00BCD4 100%);
}

.bg-gradient-orange {
    background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);
}

.hover-card {
    transition: all 0.3s ease;
    cursor: pointer;
}
.hover-card:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.bg-white-opacity {
    background-color: rgba(255, 255, 255, 0.2) !important;
}

.text-white {
    color: white !important;
}
.opacity-80 {
    opacity: 0.8;
}
</style>
