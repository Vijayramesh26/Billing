<template>
  <div class="products-view py-12 bg-surface h-100">
      <v-container id="products-section" class="pb-16">
        <!-- Header -->
        <div class="d-flex flex-column flex-md-row justify-space-between align-end mb-10">
            <div>
                 <div class="text-overline text-secondary font-weight-bold ls-2 mb-1">OUR CATALOG</div>
                 <h2 class="text-h3 font-weight-bold text-primary font-heading">Featured Products</h2>
            </div>
            
            <div class="d-flex align-center gap-4 mt-4 mt-md-0 w-full w-md-auto">
                 <div class="search-wrapper rounded-pill elevation-0 border d-flex align-center bg-white px-2" style="min-width: 250px;">
                    <v-icon color="grey" class="ml-2" size="small">mdi-magnify</v-icon>
                    <input 
                        v-model="search"
                        placeholder="Search..."
                        class="flex-grow-1 px-2 py-2 text-body-2 outline-none"
                        style="width: 100%; border: none; outline: none;"
                    />
                </div>
                <div class="text-medium-emphasis font-weight-medium text-body-2">
                    {{ filteredProducts.length }} items
                </div>
            </div>
        </div>

        <!-- Category Filter -->
        <div class="d-flex overflow-x-auto gap-2 mb-8 hide-scrollbar pb-2">
          <v-chip
            v-for="cat in computedCategories"
            :key="cat"
            :color="selectedCategory === cat ? 'primary' : 'surface'"
            :variant="selectedCategory === cat ? 'flat' : 'elevated'"
            class="font-weight-bold px-6 shadow-soft"
            size="large"
            @click="selectedCategory = cat"
            link
          >
            {{ cat }}
          </v-chip>
        </div>

        <v-fade-transition mode="out-in">
          <v-row :key="selectedCategory">
             <!-- Product Cards -->
            <v-col
              v-for="product in filteredProducts"
              :key="product.id"
              cols="12" sm="6" md="4" lg="3"
            >
              <ShopProductCard 
                :product="product" 
                @add-to-cart="addToCart"
                @view="viewProduct"
              />
            </v-col>
            
            <!-- Empty State -->
            <v-col cols="12" v-if="filteredProducts.length === 0 && !loading" class="text-center py-24">
               <div class="bg-grey-lighten-5 rounded-circle d-inline-flex pa-8 mb-6">
                 <v-icon size="64" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
               </div>
              <h3 class="text-h6 text-medium-emphasis">No items found.</h3>
              <p class="text-grey mt-2">Try adjusting your search.</p>
               <v-btn variant="text" color="primary" @click="resetFilters" class="mt-2">Clear Filters</v-btn>
            </v-col>
            
             <!-- Loading State -->
            <v-col cols="12" v-if="loading" class="text-center py-24">
                 <v-progress-circular indeterminate color="secondary" size="64"></v-progress-circular>
            </v-col>
          </v-row>
        </v-fade-transition>
      </v-container>
  </div>
</template>

<script>
import EventServices from '@/services/EventServices'
import ShopProductCard from '@/components/ShopProductCard.vue'
import { mapActions, mapState } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useCategoryStore } from '@/stores/category'

export default {
  name: 'ProductsView',
  components: {
    ShopProductCard
  },
  data() {
    return {
      products: [],
      loading: false,
      search: '',
      selectedCategory: 'All',
    }
  },
  computed: {
    ...mapState(useCategoryStore, ['categoryNames']),
    computedCategories() {
        // Combine 'All' with fetched category names
        // Also could include brands if needed, but request was specifically for categories (e.g. Plywood)
        return ['All', ...this.categoryNames]
    },
    filteredProducts() {
        let res = this.products
        
        // Category Filter
        if (this.selectedCategory !== 'All') {
            res = res.filter(p => {
                // If product has a category, match name. 
                // Fallback to Uncategorized or check if it matches Brand for backward compatibility? 
                // User said: "not brand type of product... plywood category"
                // So strict category matching is preferred.
                return p.category && p.category.name === this.selectedCategory
            })
        }
        
        // Search Filter
        if (this.search) {
            const q = this.search.toLowerCase()
            res = res.filter(p => 
                p.name.toLowerCase().includes(q) || 
                (p.brand && p.brand.name.toLowerCase().includes(q)) ||
                (p.category && p.category.name.toLowerCase().includes(q))
            )
        }
        return res
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchCategories()
  },
  methods: {
    ...mapActions(useCartStore, ['addToCart']),
    ...mapActions(useCategoryStore, ['fetchCategories']),
    async fetchProducts() {
      this.loading = true
      try {
        const res = await EventServices.getPublicProducts()
        this.products = res.data
      } catch(e) { 
        console.error(e)
      }
      finally { this.loading = false }
    },
    viewProduct(product) {
        // Future implementation: Navigate to product detail
        console.log("View", product)
    },
    resetFilters() {
        this.search = ''
        this.selectedCategory = 'All'
    }
  }
}
</script>

<style scoped>
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.ls-2 { letter-spacing: 2px; }
.gap-4 { gap: 16px; }
.gap-2 { gap: 8px; }
.w-full { width: 100%; }
.outline-none:focus { outline: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.shadow-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; }
</style>
