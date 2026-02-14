<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6 d-flex flex-column align-start">
    <div class="d-flex flex-column flex-md-row justify-space-between w-100 align-start align-md-center mb-6">
      <div class="mb-4 mb-md-0">
        <h1 class="text-h4 font-weight-black gradient-text">Customer Orders</h1>
        <p class="text-subtitle-1 text-grey-darken-1 mt-1">Manage and fulfill online orders</p>
      </div>
      <v-btn
        class="bg-gradient-gold text-white align-self-start align-self-sm-auto"
        size="large"
        prepend-icon="mdi-refresh"
        rounded="xl"
        elevation="2"
        @click="fetchOrders"
        :loading="loading"
      >
        Refresh List
      </v-btn>
    </div>

    <!-- Summary Cards -->
    <v-row class="mb-6 w-100">
      <v-col cols="12" sm="4">
        <v-card class="rounded-xl" elevation="0" border>
          <v-card-text class="d-flex align-center pa-4">
            <v-avatar color="orange-lighten-5" size="48" class="mr-4">
              <v-icon color="orange-darken-2" size="24">mdi-clock-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-caption text-grey font-weight-bold text-uppercase">Pending</div>
              <div class="text-h5 font-weight-black text-grey-darken-3">{{ pendingCount }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
       <v-col cols="12" sm="4">
        <v-card class="rounded-xl" elevation="0" border>
          <v-card-text class="d-flex align-center pa-4">
            <v-avatar color="green-lighten-5" size="48" class="mr-4">
              <v-icon color="green-darken-2" size="24">mdi-check-circle-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-caption text-grey font-weight-bold text-uppercase">Completed</div>
              <div class="text-h5 font-weight-black text-grey-darken-3">{{ completedCount }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
       <v-col cols="12" sm="4">
        <v-card class="rounded-xl" elevation="0" border>
          <v-card-text class="d-flex align-center pa-4">
            <v-avatar color="blue-lighten-5" size="48" class="mr-4">
              <v-icon color="blue-darken-2" size="24">mdi-receipt-text-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-caption text-grey font-weight-bold text-uppercase">Total Today</div>
              <div class="text-h5 font-weight-black text-grey-darken-3">{{ orders.length }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="rounded-xl overflow-hidden border w-100" elevation="0" style="overflow-x: auto;">
      <v-data-table
        :headers="headers"
        :items="orders"
        :loading="loading"
        :search="search"
        class="pa-2"
        hover
        mobile-breakpoint="0"
      >
            <!-- Toolbar -->
            <template v-slot:top>
              <div class="px-4 py-3 border-b">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Search orders, customers, mobile..."
                  variant="plain"
                  hide-details
                  density="compact"
                  class="text-body-1 w-100"
                ></v-text-field>
              </div>
              <div class="d-flex align-center pa-2 bg-grey-lighten-5">
                <v-tabs v-model="statusFilter" density="compact" color="secondary" bg-color="transparent">
                    <v-tab value="ALL" class="text-caption font-weight-bold">All</v-tab>
                    <v-tab value="PENDING" class="text-caption font-weight-bold">Pending</v-tab>
                    <v-tab value="COMPLETED" class="text-caption font-weight-bold">Completed</v-tab>
                </v-tabs>
                <v-spacer></v-spacer>
                <v-chip size="x-small" color="secondary" variant="tonal" class="font-weight-bold mr-2">
                    {{ orders.length }} Items
                </v-chip>
              </div>
            </template>

            <!-- Custom Headers -->
            <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                <tr>
                    <template v-for="column in columns" :key="column.key">
                        <th class="text-overline text-grey-darken-1 font-weight-bold py-3 px-4" :class="{'text-end': column.align==='end'}" @click="() => toggleSort(column)" style="cursor: pointer">
                            {{ column.title }}
                            <v-icon v-if="isSorted(column)" color="secondary" size="small">{{ getSortIcon(column) }}</v-icon>
                        </th>
                    </template>
                </tr>
            </template>

            <!-- Rows -->
            <template v-slot:item.order_no="{ item }">
                <div class="font-weight-bold text-body-2">{{ item.order_no }}</div>
            </template>

            <template v-slot:item.customer="{ item }">
                <div class="d-flex align-center">
                    <v-avatar color="secondary" variant="tonal" size="32" class="mr-3">
                        <span class="text-subtitle-2 font-weight-bold">{{ item.customer ? item.customer.name.charAt(0) : '?' }}</span>
                    </v-avatar>
                    <div>
                        <div class="font-weight-bold text-body-2">{{ item.customer ? item.customer.name : 'Unknown' }}</div>
                        <div class="text-caption text-grey">{{ item.customer ? item.customer.mobile : '--' }}</div>
                    </div>
                </div>
            </template>

            <template v-slot:item.order_date="{ item }">
               <div class="text-body-2 text-grey-darken-2">
                   {{ new Date(item.order_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }}
                   <span class="text-grey text-caption ml-1">{{ new Date(item.order_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) }}</span>
               </div>
            </template>

            <template v-slot:item.total_estimated="{ item }">
                <span class="font-weight-bold text-body-2">₹{{ parseFloat(item.total_estimated).toFixed(2) }}</span>
            </template>

            <template v-slot:item.status="{ item }">
               <v-chip
                :color="getStatusColor(item.status)"
                :class="`text-${getStatusColor(item.status)} bg-${getStatusColor(item.status)}-lighten-5`"
                size="small"
                label
                class="font-weight-bold text-caption"
               >
                   {{ item.status }}
               </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
                <div class="d-flex justify-end">
                    <v-btn 
                        v-if="item.status === 'PENDING'"
                        size="small" 
                        class="bg-gradient-gold text-white px-4" 
                        variant="flat" 
                        rounded="pill"
                        @click="loadToPOS(item)"
                    >
                        <v-icon start size="small">mdi-cash-register</v-icon>
                        Process
                    </v-btn>
                    <v-btn 
                        v-else
                        size="small" 
                        variant="text" 
                        color="grey" 
                        rounded="pill"
                        disabled
                    >
                        {{ item.status === 'COMPLETED' ? 'Paid' : 'Closed' }}
                    </v-btn>
                </div>
            </template>
            
            <template v-slot:no-data>
                <div class="pa-8 text-center">
                    <v-img src="https://cdn-icons-png.flaticon.com/512/7486/7486776.png" width="120" class="mx-auto mb-4 opacity-50"></v-img>
                    <div class="text-h6 text-grey">No orders found</div>
                    <div class="text-body-2 text-grey-lighten-1">New online orders will appear here</div>
                </div>
            </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
    name: 'BillerOrders',
    data() {
        return {
            search: '',
            statusFilter: 'ALL',
            headers: [
              { title: 'Order #', key: 'order_no', align: 'start' },
              { title: 'Customer', key: 'customer', align: 'start' },
              { title: 'Date & Time', key: 'order_date', align: 'start' },
              { title: 'Amount', key: 'total_estimated', align: 'end' },
              { title: 'Status', key: 'status', align: 'center' },
              { title: 'Action', key: 'actions', align: 'end', sortable: false },
            ],
            allOrders: [],
            loading: false
        }
    },
    computed: {
        orders() {
            if (this.statusFilter === 'ALL') return this.allOrders
            return this.allOrders.filter(o => o.status === this.statusFilter)
        },
        pendingCount() {
            return this.allOrders.filter(o => o.status === 'PENDING').length
        },
        completedCount() {
            return this.allOrders.filter(o => o.status === 'COMPLETED').length
        }
    },
    mounted() {
        this.fetchOrders()
    },
    methods: {
        async fetchOrders() {
            this.loading = true
            try {
                // Fetch ALL orders (remove status param or pass empty object to get all)
                // Assuming getOrders() logic in backend might still be filtering if status param was hardcoded in service
                // Just in case, let's call without status to hopefully get all, 
                // BUT wait, we updated backend to filter by status IF present.
                // If we want dashboard stats, we need ALL orders.
                // Previously Billing.vue needed ONLY pending. Here in Orders view, we typically show history too.
                // Let's call with no params.
                const res = await EventServices.getOrders({}) 
                this.allOrders = res.data
            } catch(e) { console.error(e) }
            finally { this.loading = false }
        },
        getStatusColor(status) {
          if (status === 'COMPLETED') return 'success'
          if (status === 'CANCELLED') return 'error'
          return 'warning'
        },
        loadToPOS(order) {
            this.$router.push({ path: '/billing/pos', query: { orderId: order.id } })
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
</style>
