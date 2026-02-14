<template>
  <v-container fluid class="bg-background fill-height">
    <h2 class="mb-4 text-h5 font-weight-black text-secondary">Stock View</h2>
    <v-card class="rounded-xl border-thin elevation-2 bg-surface">
      <v-data-table :headers="headers" :items="products" :loading="loading" search hover>
        <template v-slot:item.unit_price="{ item }">
          <span class="font-weight-bold">₹{{ item.unit_price }}</span>
        </template>
        <template v-slot:item.current_stock="{ item }">
          <v-chip 
            :color="item.current_stock < item.low_stock_threshold ? 'error' : 'success'" 
            variant="flat" 
            size="small"
            class="font-weight-bold"
          >
            {{ item.current_stock }} Units
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
    name: 'BillerStockView',
    data() {
        return {
            headers: [
              { title: 'Name', key: 'name' },
              { title: 'Brand', key: 'brand.name' },
              { title: 'Price', key: 'unit_price' },
              { title: 'Stock', key: 'current_stock' },
            ],
            products: [],
            loading: false
        }
    },
    mounted() {
        this.fetchProducts()
    },
    methods: {
        async fetchProducts() {
            this.loading = true
            try {
                const res = await EventServices.getProducts()
                this.products = res.data
            } catch (err) { console.error(err) }
            finally { this.loading = false }
        }
    }
}
</script>
