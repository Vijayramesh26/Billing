<template>
  <v-container fluid class="fill-height bg-background pa-6 align-start">
    <v-card class="rounded-xl elevation-10 modern-card bg-surface border-thin w-100">
      <div class="card-header-glow"></div>
      
      <!-- Toolbar -->
      <v-toolbar color="transparent" class="px-6 pt-6 mb-4">
          <v-avatar color="red-lighten-5" size="48" class="mr-4 rounded-lg">
             <v-icon color="red" size="28">mdi-alert-octagon</v-icon>
          </v-avatar>
          <div>
             <v-toolbar-title class="text-h5 font-weight-black text-grey-darken-3">Low Stock Alerts</v-toolbar-title>
             <div class="text-caption text-grey font-weight-medium">Items below threshold requiring restock</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn 
            color="red" 
            variant="tonal"
            prepend-icon="mdi-refresh" 
            rounded="lg" 
            class="fw-bold"
            @click="fetchAlerts"
            :loading="loading"
          >
            Refresh Alerts
          </v-btn>
      </v-toolbar>

      <!-- Data Table -->
      <v-data-table 
        :headers="headers" 
        :items="products" 
        :loading="loading" 
        class="bg-transparent px-6 pb-6"
        hover
      >
        <template v-slot:item.name="{ item }">
            <div class="font-weight-bold text-body-1 text-grey-darken-3">{{ item.name }}</div>
        </template>
        <template v-slot:item.current_stock="{ item }">
             <div class="d-flex align-center">
                <v-progress-linear
                    :model-value="(item.current_stock / item.low_stock_threshold) * 100" 
                    color="red"
                    height="6"
                    rounded
                    style="width: 60px"
                    class="mr-3"
                ></v-progress-linear>
                <span class="text-red font-weight-bold">{{ item.current_stock }}</span>
             </div>
        </template>
        <template v-slot:item.action="{ item }">
            <v-btn 
                size="small" 
                color="primary" 
                variant="flat" 
                rounded="lg"
                to="/inventory/add-stock"
                prepend-icon="mdi-plus"
            >
                Restock
            </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
  name: 'StockAlerts',
  data() {
    return {
      headers: [
        { title: 'Product', key: 'name', align: 'start' },
        { title: 'Brand', key: 'brand.name' },
        { title: 'Current Stock', key: 'current_stock' },
        { title: 'Threshold', key: 'low_stock_threshold' },
        { title: 'Action', key: 'action', sortable: false, align: 'end' },
      ],
      products: [],
      loading: false
    }
  },
  mounted() {
    this.fetchAlerts()
  },
  methods: {
    async fetchAlerts() {
      this.loading = true
      try {
        const res = await EventServices.getAlerts()
        this.products = res.data
      } catch (err) { console.error(err) }
      finally { this.loading = false }
    }
  }
}
</script>

<style scoped>
.modern-card {
    position: relative;
    overflow: hidden;
}
.card-header-glow {
    position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #D32F2F, #FF5252);
}
.border-thin { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
</style>
