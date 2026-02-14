<template>
  <v-container fluid class="fill-height bg-background pa-6 align-start">
    <v-card class="rounded-xl elevation-10 modern-card bg-surface border-thin w-100">
      <div class="card-header-glow"></div>
      
      <!-- Page Header -->
      <div class="px-6 pt-6 pb-4 d-flex flex-wrap align-center justify-space-between gap-3">
        <div class="d-flex align-center">
          <v-avatar color="primary" variant="tonal" size="48" class="mr-4 rounded-lg">
             <v-icon color="primary" size="28">mdi-package-variant</v-icon>
          </v-avatar>
          <div>
             <h1 class="text-h5 font-weight-black text-secondary">Product Management</h1>
             <div class="text-caption text-secondary opacity-70 font-weight-medium">Manage catalog and stock levels</div>
          </div>
        </div>
        <v-btn 
          color="primary" 
          prepend-icon="mdi-plus" 
          rounded="lg" 
          elevation="2" 
          class="text-capitalize font-weight-bold ml-auto mt-2 mt-sm-0"
          @click="dialog = true"
        >
          New Product
        </v-btn>
      </div>

      <!-- Data Table -->
      <v-data-table 
        :headers="headers" 
        :items="products" 
        :loading="loading" 
        :search="search"
        class="bg-transparent px-6 pb-6"
        hover
      >
        <template v-slot:top>
          <div class="px-4 py-3 d-flex align-center bg-surface border-b rounded-t-xl w-100">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search products..."
              variant="outlined"
              hide-details
              density="compact"
              bg-color="background"
              rounded="lg"
              class="w-100"
            ></v-text-field>
          </div>
        </template>
        <template v-slot:item.name="{ item }">
            <div class="font-weight-bold text-body-1 text-grey-darken-3">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.description }}</div>
        </template>
        <template v-slot:item.category="{ item }">
             <v-chip size="small" variant="outlined" color="primary" v-if="item.category">{{ item.category.name }}</v-chip>
             <span v-else class="text-caption text-grey">Uncategorized</span>
        </template>
        <template v-slot:item.unit_price="{ item }">
          <v-chip color="success" variant="tonal" size="small" class="font-weight-bold">₹{{ item.unit_price }}</v-chip>
        </template>
        <template v-slot:item.current_stock="{ item }">
             <div class="d-flex align-center">
                <v-progress-linear
                    :model-value="Math.min(item.current_stock, 100)" 
                    :color="getStockColor(item)"
                    height="6"
                    rounded
                    style="width: 60px"
                    class="mr-3"
                ></v-progress-linear>
                <span :class="`text-${getStockColor(item)} font-weight-bold`">{{ item.current_stock }}</span>
             </div>
        </template>
         <template v-slot:item.barcode="{ item }">
            <span class="text-caption font-family-monospace text-grey-darken-1 bg-grey-lighten-4 px-2 py-1 rounded">{{ item.barcode }}</span>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="600px" transition="dialog-bottom-transition">
      <v-card class="rounded-xl">
        <v-toolbar color="primary" class="px-4">
             <v-toolbar-title class="text-h6 font-weight-bold">Add New Product</v-toolbar-title>
             <v-btn icon dark @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-container class="pa-0">
            <v-row>
              <v-col cols="12">
                   <v-text-field v-model="newItem.name" label="Product Name" variant="outlined" density="comfortable" color="primary"></v-text-field>
              </v-col>
              <v-col cols="6">
                   <v-combobox
                      v-model="newItem.brand_name"
                      :items="brands"
                      item-title="name"
                      item-value="name"
                      label="Brand Name"
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      return-object="false"
                   ></v-combobox>
              </v-col>
              <v-col cols="6">
                   <v-combobox
                      v-model="selectedCategory"
                      :items="categoryNames"
                      label="Category"
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      hint="Select or type new category"
                      persistent-hint
                   ></v-combobox>
              </v-col>
              <v-col cols="6">
                   <v-text-field v-model="newItem.barcode" label="Barcode" variant="outlined" density="comfortable" color="primary" append-inner-icon="mdi-barcode"></v-text-field>
              </v-col>
              <v-col cols="6">
                   <v-text-field v-model.number="newItem.unit_price" label="Unit Price" type="number" prefix="₹" variant="outlined" density="comfortable" color="primary"></v-text-field>
              </v-col>
              <v-col cols="6">
                   <v-text-field v-model.number="newItem.low_stock_threshold" label="Low Stock Alert At" type="number" variant="outlined" density="comfortable" color="primary"></v-text-field>
              </v-col>
              <v-col cols="12">
                  <v-textarea v-model="newItem.description" label="Description" rows="3" variant="outlined" density="comfortable" color="primary"></v-textarea>
              </v-col>
              <v-col cols="6">
                   <v-text-field v-model.number="newItem.opening_stock" label="Opening Stock" type="number" variant="outlined" density="comfortable" color="primary"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" size="large" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" size="large" rounded="lg" @click="save" class="px-6 bg-gradient-gold">Save Product</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'
import { mapState, mapActions } from 'pinia'
import { useCategoryStore } from '@/stores/category'

export default {
  name: 'ProductList',
  data() {
    return {
      headers: [
        { title: 'Name', key: 'name', align: 'start' },
        { title: 'Category', key: 'category' },
        { title: 'Brand', key: 'brand.name' },
        { title: 'Price', key: 'unit_price' },
        { title: 'Stock', key: 'current_stock' },
        { title: 'Barcode', key: 'barcode' },
      ],
      products: [],
      brands: [],
      loading: false,
      dialog: false,
      search: '',
      selectedCategory: null,
      newItem: {
        name: '',
        brand_name: '',
        unit_price: 0,
        low_stock_threshold: 10,
        barcode: '',
        description: '',
        opening_stock: 0
      }
    }
  },
  computed: {
    ...mapState(useCategoryStore, ['categories', 'categoryNames'])
  },
  mounted() {
    this.fetchProducts()
    this.fetchCategories()
    this.fetchBrands()
  },
  methods: {
    ...mapActions(useCategoryStore, ['fetchCategories', 'createCategory']),
    async fetchProducts() {
      this.loading = true
      try {
        const res = await EventServices.getProducts()
        this.products = res.data
      } catch (err) { console.error(err) }
      finally { this.loading = false }
    },
    async fetchBrands() {
      try {
        const res = await EventServices.getBrands()
        this.brands = res.data.map(b => b.name)
      } catch (err) { console.error(err) }
    },
    async save() {
      try {
        let categoryId = null;
        
        // Handle Category Selection/Creation
        if (this.selectedCategory) {
            const existing = this.categories.find(c => c.name === this.selectedCategory);
            if (existing) {
                categoryId = existing.id;
            } else {
                // Create new category if selected one is new
                const newCat = await this.createCategory({ name: this.selectedCategory });
                categoryId = newCat.id;
            }
        }
        
        const payload = { ...this.newItem, category_id: categoryId }
        
        await EventServices.addProduct(payload)
        this.fetchProducts()
        this.fetchBrands() // Refresh brands in case a new one was created
        this.dialog = false
        this.newItem = { name: '', brand_name: '', unit_price: 0, low_stock_threshold: 10, barcode: '', description: '', opening_stock: 0 }
        this.selectedCategory = null
      } catch(e) { console.error(e) }
    },
    getStockColor(item) {
        if (item.current_stock <= item.low_stock_threshold) return 'error'
        if (item.current_stock < 20) return 'warning'
        return 'success'
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
    background: linear-gradient(90deg, #1976D2, #42A5F5);
}
.border-thin { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.bg-gradient-gold {
    background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%) !important;
}
</style>
