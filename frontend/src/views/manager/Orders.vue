<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6 d-flex flex-column align-start">
    <div class="d-flex justify-space-between w-100 align-center mb-6">
        <div>
            <h1 class="text-h4 font-weight-black gradient-text">Customer Orders</h1>
            <div class="text-subtitle-1 text-grey-darken-1">Track and manage incoming orders</div>
        </div>
        <v-card class="d-flex align-center px-4 py-2 rounded-pill bg-white border-thin elevation-0">
             <v-icon color="secondary" class="mr-2">mdi-clipboard-list-outline</v-icon>
             <span class="font-weight-bold text-secondary">{{ orders.length }} Orders</span>
        </v-card>
    </div>

    <v-card class="w-100 rounded-xl elevation-0 border-thin bg-transparent" style="overflow-x: auto;">
      <v-data-table
        :headers="headers"
        :items="orders"
        :loading="loading"
        :search="search"
        class="rounded-xl elevation-1 bg-white"
        hover
        mobile-breakpoint="0"
      >
        <template v-slot:top>
            <div class="px-4 py-3 d-flex align-center bg-white border-b">
                <v-icon color="grey-lighten-1" class="mr-3">mdi-magnify</v-icon>
                <v-text-field
                    v-model="search"
                    placeholder="Search orders, customers..."
                    variant="plain"
                    hide-details
                    density="compact"
                    class="text-body-1 w-100"
                ></v-text-field>
            </div>
        </template>

        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
                <template v-for="column in columns" :key="column.key">
                    <th class="text-caption font-weight-bold text-uppercase text-grey-darken-1 bg-grey-lighten-5 py-3 border-b">
                        <span class="cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)" size="x-small" class="ml-1"></v-icon>
                    </th>
                </template>
            </tr>
        </template>

        <template v-slot:item="{ item }">
            <tr class="hover-bg-grey-lighten-5 transition-swing">
                <td class="py-4">
                    <div class="font-weight-bold text-body-2 text-grey-darken-3">{{ item.order_no }}</div>
                    <div class="text-caption text-grey">{{ new Date(item.order_date).toLocaleDateString() }}</div>
                </td>
                <td class="py-4">
                    <div class="d-flex align-center">
                        <v-avatar color="primary-lighten-5" class="mr-3 text-primary font-weight-bold" rounded="lg" size="small">
                            {{ item.customer ? item.customer.name.charAt(0) : '?' }}
                        </v-avatar>
                        <div>
                            <div class="font-weight-bold text-body-2 text-grey-darken-3">{{ item.customer ? item.customer.name : 'Unknown' }}</div>
                            <div class="text-caption text-grey">{{ item.customer ? item.customer.mobile : '' }}</div>
                        </div>
                    </div>
                </td>
                <td class="py-4">
                    <div class="text-body-2 font-weight-bold">₹{{ parseFloat(item.total_estimated || 0).toFixed(2) }}</div>
                    <div class="text-caption text-grey">{{ item.items ? item.items.length : 0 }} items</div>
                </td>
                <td class="py-4">
                    <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small" class="font-weight-bold px-3" rounded="pill">
                        <v-icon start size="x-small" class="mr-1">
                            {{ getStatusIcon(item.status) }}
                        </v-icon>
                        {{ item.status }}
                    </v-chip>
                </td>
                <td class="py-4 text-right">
                    <v-menu location="bottom end">
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" variant="text" size="small" color="grey" v-bind="props"></v-btn>
                        </template>
                        <v-list density="compact" elevation="2" class="rounded-lg">
                            <v-list-item @click="updateStatus(item, 'COMPLETED')" v-if="item.status !== 'COMPLETED'">
                                <template v-slot:prepend><v-icon color="success" size="small">mdi-check-circle-outline</v-icon></template>
                                <v-list-item-title>Mark Completed</v-list-item-title>
                            </v-list-item>
                             <v-list-item @click="updateStatus(item, 'CANCELLED')" v-if="item.status !== 'CANCELLED'">
                                <template v-slot:prepend><v-icon color="error" size="small">mdi-close-circle-outline</v-icon></template>
                                <v-list-item-title>Cancel Order</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </td>
            </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
  name: 'ManagerOrders',
  data() {
    return {
      search: '',
      headers: [
        { title: 'Order No', key: 'order_no' },
        { title: 'Customer', key: 'customer.name' },
        { title: 'Total', key: 'total_estimated' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions', align: 'end' },
      ],
      orders: [],
      loading: false
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      this.loading = true
      try {
        const res = await EventServices.getOrders()
        this.orders = res.data
      } catch (e) { console.error(e) }
      finally { this.loading = false }
    },
    async updateStatus(item, status) {
      try {
        await EventServices.updateOrderStatus(item.id, status)
        item.status = status
      } catch(e) { console.error(e) }
    },
    getStatusColor(status) {
        if (status === 'PENDING') return 'amber-darken-2'
        if (status === 'COMPLETED') return 'success'
        if (status === 'CANCELLED') return 'error'
        return 'grey'
    },
    getStatusIcon(status) {
        if (status === 'PENDING') return 'mdi-clock-outline'
        if (status === 'COMPLETED') return 'mdi-check-circle'
        if (status === 'CANCELLED') return 'mdi-close-circle'
        return 'mdi-help-circle'
    }
  }
}
</script>

<style scoped>
.border-thin { border: 1px solid rgba(0,0,0,0.08); }
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
