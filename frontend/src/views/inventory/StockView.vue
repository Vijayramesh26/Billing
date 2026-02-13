<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6">
    <v-row class="fill-height">

      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
            <div>
                <h1 class="text-h4 font-weight-black text-grey-darken-3">Product Inventory</h1>
                <div class="text-subtitle-1 text-grey-darken-1">Manage stock levels and product details</div>
            </div>
            <v-btn 
                v-if="canAddProduct"
                color="primary" 
                prepend-icon="mdi-plus" 
                size="large" 
                class="text-capitalize rounded-lg elevation-4"
                @click="dialog = true"
            >
                Add New Product
            </v-btn>
        </div>

        <v-card class="border-0 elevation-0 rounded-xl bg-transparent">
          <v-data-table 
            :headers="headers" 
            :items="products" 
            :loading="loading" 
            search
            class="rounded-xl elevation-1 bg-white"
            hover
          >
            <template v-slot:top>
                <div class="px-4 py-3 d-flex align-center bg-white border-b">
                    <v-icon color="grey-lighten-1" class="mr-3">mdi-magnify</v-icon>
                    <input 
                        v-model="search"
                        placeholder="Search products..."
                        class="flex-grow-1 text-body-1"
                        style="outline: none;"
                    />
                </div>
            </template>

            <template v-slot:header="{ props }">
                <tr>
                    <th v-for="head in props.headers" :key="head.key" class="text-caption font-weight-bold text-uppercase text-grey-darken-1 bg-grey-lighten-5 py-3 border-b">
                        {{ head.title }}
                    </th>
                </tr>
            </template>
            
            <template v-slot:item="{ item }">
                <tr class="hover-bg-grey-lighten-5 transition-swing">
                    <td class="py-3">
                        <div class="font-weight-bold text-body-2 text-grey-darken-3">{{ item.name }}</div>
                        <div class="text-caption text-grey">{{ item.brand ? item.brand.name : '' }}</div>
                    </td>
                    <td class="py-3">
                        <div class="text-caption text-grey">{{ item.brand ? item.brand.name : '-' }}</div>
                    </td>
                    <td class="py-3">
                         <span class="font-weight-bold text-body-2 text-grey-darken-3">₹{{ item.unit_price }}</span>
                    </td>
                    <td class="py-3">
                        <v-chip
                            :color="item.current_stock <= item.low_stock_threshold ? 'error' : 'success'"
                            variant="tonal"
                            size="small"
                            class="font-weight-bold px-3"
                            rounded="pill"
                        >
                            <v-icon start size="x-small" class="mr-1">
                                {{ item.current_stock <= item.low_stock_threshold ? 'mdi-alert-circle' : 'mdi-check-circle' }}
                            </v-icon>
                            {{ item.current_stock }}
                        </v-chip>
                    </td>
                    <td class="py-3">
                        <div class="d-flex align-center text-caption text-grey-darken-1 font-family-monospace bg-grey-lighten-4 px-2 py-1 rounded d-inline-block">
                             <v-icon start size="x-small" class="mr-1">mdi-barcode</v-icon>
                             {{ item.barcode }}
                        </div>
                    </td>
                </tr>
            </template>


          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="700px" transition="dialog-bottom-transition">
      <v-card class="rounded-xl">
        <v-toolbar color="primary" class="px-4">
            <v-toolbar-title class="font-weight-bold">Add New Product</v-toolbar-title>
            <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-6">
          <v-container>
            <v-row>
              <v-col cols="12">
                  <v-text-field 
                    v-model="newItem.name" 
                    label="Product Name" 
                    variant="outlined" 
                    density="comfortable"
                    prepend-inner-icon="mdi-package-variant"
                  ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="newItem.brand_name" 
                    label="Brand Name" 
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-tag-text"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="newItem.barcode" 
                    label="Barcode / SKU" 
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-barcode"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                  <v-text-field 
                    v-model.number="newItem.unit_price" 
                    label="Unit Price" 
                    type="number" 
                    prefix="₹" 
                    variant="outlined"
                    density="comfortable"
                    class="font-weight-bold"
                 ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                  <v-text-field 
                    v-model.number="newItem.low_stock_threshold" 
                    label="Low Stock Alert Threshold" 
                    type="number" 
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-alert-circle-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                  <v-textarea 
                    v-model="newItem.description" 
                    label="Product Description" 
                    rows="3" 
                    variant="outlined"
                    density="comfortable"
                 ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" size="large" @click="dialog = false" class="mr-2">Cancel</v-btn>
          <v-btn color="primary" variant="flat" size="large" rounded="lg" class="px-6" @click="save" elevation="2">Save Product</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import EventServices from '../../services/EventServices'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'StockView',
  data() {
    return {
      headers: [
        { title: 'Name', key: 'name' },
        { title: 'Brand', key: 'brand.name' },
        { title: 'Price', key: 'unit_price' },
        { title: 'Stock', key: 'current_stock' },
        { title: 'Barcode', key: 'barcode' },
      ],
      products: [],
      loading: false,
      dialog: false,
      search: '',
      newItem: {
        name: '',
        brand_name: '',
        unit_price: 0,
        low_stock_threshold: 10,
        barcode: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapState(useAuthStore, ['role']),
    canAddProduct() {
      return this.role === 'admin' || this.role === 'manager' || this.role === 'inventory'
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
    },
    async save() {
      try {
        await EventServices.addProduct(this.newItem)
        this.fetchProducts()
        this.dialog = false
        this.newItem = { name: '', brand_name: '', unit_price: 0, low_stock_threshold: 10, barcode: '', description: '' }
      } catch(e) { console.error(e) }
    }
  }
}
</script>
