<template>
  <v-container fluid class="fill-height bg-background pa-6 d-flex justify-center align-center">
    <v-card width="600" class="rounded-xl elevation-10 modern-card bg-surface border-thin overflow-visible">
      <div class="card-header-glow"></div>
      <v-toolbar color="transparent" class="px-6 pt-6 mb-2">
          <v-avatar color="amber-lighten-5" variant="tonal" size="48" class="mr-4 rounded-lg">
             <v-icon color="secondary" size="28">mdi-package-variant-plus</v-icon>
          </v-avatar>
          <div>
             <v-toolbar-title class="text-h5 font-weight-black">Update Stock</v-toolbar-title>
             <div class="text-caption text-grey font-weight-medium">Update inventory levels</div>
          </div>
      </v-toolbar>
      
      <v-card-text class="pa-6 pt-2">
        <v-autocomplete
          label="Search Product"
          v-model="selectedProduct"
          :items="products"
          item-title="name"
          item-value="id"
          return-object
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-barcode-scan"
          class="mb-6"
          bg-color="background"
          rounded="lg"
          placeholder="Type name or scan barcode"
        >
            <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" class="pa-2">
                    <template v-slot:prepend>
                        <v-avatar color="grey-lighten-4" rounded="lg" class="mr-2">
                            <span class="text-caption font-weight-bold">{{ item.raw.current_stock }}</span>
                        </v-avatar>
                    </template>
                    <v-list-item-subtitle>
                        {{ item.raw.brand ? item.raw.brand.name : '' }} • ₹{{ item.raw.unit_price }}
                    </v-list-item-subtitle>
                </v-list-item>
            </template>
        </v-autocomplete>
        
        <v-expand-transition>
            <div v-if="selectedProduct" class="mt-2">
                <v-card class="bg-secondary-lighten-5 pa-5 rounded-xl border mb-6 elevation-0 relative overflow-hidden">
                    <div class="absolute-pattern"></div>
                    <v-row align="center" no-gutters>
                        <v-col cols="5">
                             <div class="text-caption text-grey-darken-2 font-weight-bold text-uppercase mb-1">Current Stock</div>
                             <div class="text-h3 font-weight-black text-primary">{{ selectedProduct.current_stock }}</div>
                        </v-col>
                        <v-col cols="2" class="text-center">
                            <v-icon color="grey" size="large">mdi-arrow-right</v-icon>
                        </v-col>
                        <v-col cols="5" class="text-right">
                             <div class="text-caption text-grey-darken-2 font-weight-bold text-uppercase mb-1">New Stock</div>
                             <div class="text-h3 font-weight-black" :class="(selectedProduct.current_stock + parseInt(addedStock||0)) < 0 ? 'text-error' : 'text-success'">
                                {{ selectedProduct.current_stock + parseInt(addedStock||0) }}
                             </div>
                        </v-col>
                    </v-row>
                </v-card>
            </div>
        </v-expand-transition>
        
        <div class="d-flex align-end gap-4">
            <v-text-field
                v-model.number="addedStock"
                type="number"
                label="Quantity to Add"
                variant="outlined"
                density="comfortable"
                class="flex-grow-1 font-weight-bold text-h6"
                bg-color="background"
                rounded="lg"
                prepend-inner-icon="mdi-plus-box-outline"
                hide-details
                :disabled="!selectedProduct"
            ></v-text-field>

            <v-btn 
                class="bg-gradient-gold text-white" 
                size="x-large" 
                rounded="lg" 
                elevation="2" 
                @click="updateStock" 
                :loading="loading"
                :disabled="!selectedProduct || addedStock === 0"
                min-width="150"
                height="56"
            >
                Update Stock
            </v-btn>
        </div>

      </v-card-text>
    </v-card>
    
    <v-snackbar v-model="snackbar" color="success" location="top" rounded="pill">
        <v-icon start>mdi-check-circle</v-icon> Stock Updated Successfully
    </v-snackbar>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
  name: 'StockEntry',
  data() {
    return {
      products: [],
      selectedProduct: null,
      addedStock: 0,
      loading: false,
      snackbar: false
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await EventServices.getProducts()
        this.products = res.data
      } catch(e) { console.error(e) }
    },
    async updateStock() {
      this.loading = true
      try {
        await EventServices.addStock({
          product_id: this.selectedProduct.id,
          quantity: this.addedStock
        })
        
        await this.fetchProducts()
        this.selectedProduct = null
        this.addedStock = 0
        this.snackbar = true
      } catch(e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.relative { position: relative; }
.card-header-glow {
    position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #C5A065, #B08D55);
}
.absolute-pattern {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px);
}
.gap-4 { gap: 16px; }
.border-thin { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.bg-secondary-lighten-5 {
    background-color: rgba(var(--v-theme-secondary), 0.08) !important;
}
.bg-gradient-gold {
    background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%) !important;
}
</style>
