<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-black gradient-text">Welcome Back, {{ user?.username || 'Biller' }}</h1>
      <p class="text-subtitle-1 text-medium-emphasis">Here is your daily summary.</p>
    </div>

    <!-- Stats & Actions Row -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
         <v-card class="rounded-xl pa-4 h-100 bg-gradient-gold text-white" elevation="4">
            <div class="d-flex align-center justify-space-between mb-4">
               <div>
                  <div class="text-subtitle-1 opacity-80">Today's Sales</div>
                  <div class="text-h3 font-weight-bold mt-2">₹{{ formatCurrency(sales) }}</div>
               </div>
               <v-avatar color="white" size="64" variant="tonal" class="rounded-lg">
                  <v-icon color="secondary" size="36">mdi-currency-inr</v-icon>
               </v-avatar>
            </div>
         </v-card>
      </v-col>

       <v-col cols="12" sm="6" md="4">
        <v-card class="rounded-xl h-100" elevation="2" to="/billing/pos" link hover border>
             <v-card-text class="d-flex flex-column align-center justify-center fill-height pa-6">
                 <v-avatar color="secondary-lighten-5" size="64" class="mb-3">
                    <v-icon color="secondary" size="32">mdi-cash-register</v-icon>
                 </v-avatar>
                 <div class="text-h6 font-weight-bold">New Bill</div>
                 <div class="text-caption text-medium-emphasis">Create a new invoice</div>
             </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="rounded-xl h-100" elevation="2" to="/billing/orders" link hover border>
             <v-card-text class="d-flex flex-column align-center justify-center fill-height pa-6">
                 <v-avatar color="secondary-lighten-5" size="64" class="mb-3">
                    <v-icon color="secondary" size="32">mdi-clipboard-list-outline</v-icon>
                 </v-avatar>
                 <div class="text-h6 font-weight-bold">Pending Orders</div>
                 <div class="text-caption text-medium-emphasis">View customer orders</div>
             </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Chart & Recent List -->
    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="rounded-xl elevation-2 pa-6 h-100">
           <div class="d-flex align-center justify-space-between mb-4">
              <v-card-title class="font-weight-bold px-0">Sales Activity (Hourly)</v-card-title>
           </div>
           <div class="chart-container" style="height: 400px; position: relative;">
               <Bar v-if="loaded" :data="chartData" :options="chartOptions" />
               <div v-else class="d-flex align-center justify-center fill-height">
                   <v-progress-circular indeterminate color="secondary"></v-progress-circular>
               </div>
           </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="rounded-xl elevation-2 h-100">
          <v-card-title class="font-weight-bold px-6 pt-6 mb-2">Recent Transactions</v-card-title>
          <v-divider></v-divider>
          <v-list lines="two" class="pa-2 bg-transparent">
             <template v-for="(bill, index) in recentBills" :key="bill.ID">
                 <v-list-item :title="bill.BillNo" :subtitle="formatDate(bill.CreatedAt)" rounded="lg" class="mb-1">
                    <template v-slot:append>
                        <div class="text-end">
                        <div class="font-weight-bold text-secondary">₹{{ formatCurrency(bill.NetPayable) }}</div>
                        <v-chip size="x-small" color="secondary" variant="flat" class="font-weight-bold mt-1">PAID</v-chip>
                        </div>
                    </template>
                    <template v-slot:prepend>
                        <v-avatar color="grey-lighten-4" rounded class="me-3">
                            <v-icon color="grey-darken-2">mdi-receipt-text-outline</v-icon>
                        </v-avatar>
                    </template>
                </v-list-item>
                <v-divider v-if="index < recentBills.length - 1" inset></v-divider>
             </template>
             <div v-if="!recentBills.length" class="text-center text-medium-emphasis pa-8">
                 <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-receipt-text-off-outline</v-icon>
                 <div class="text-body-2">No transactions today</div>
             </div>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'
import { mapState } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  name: 'BillerHome',
  components: {
    Bar
  },
  data() {
    return {
      sales: 0,
      recentBills: [],
      hourlySales: new Array(24).fill(0),
      loaded: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f0f0f0' }
            },
            x: {
                grid: { display: false }
            }
        }
      }
    }
  },
  computed: {
    ...mapState(useAuthStore, ['user']),
    chartData() {
        return {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [
                {
                    label: 'Sales (₹)',
                    backgroundColor: '#C5A065',
                    borderRadius: 4,
                    data: this.hourlySales
                }
            ]
        }
    }
  },
  mounted() {
    this.fetchSales()
  },
  methods: {
    async fetchSales() {
        try {
            const res = await EventServices.getMySales()
            this.sales = res.data.sales || 0
            if (res.data.hourly_sales) {
                this.hourlySales = res.data.hourly_sales
            }
            if (res.data.recent_bills) {
                this.recentBills = res.data.recent_bills
            }
            this.loaded = true
        } catch (e) {
            console.error("Failed to fetch sales", e)
            this.loaded = true
        }
    },
    formatCurrency(val) {
        return val ? val.toLocaleString('en-IN') : '0'
    },
    formatDate(dateStr) {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    }
  }
}
</script>

<style scoped>
.bg-gradient-gold {
    background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%) !important;
}
.gradient-text {
    background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.chart-container {
    width: 100%;
}
</style>
