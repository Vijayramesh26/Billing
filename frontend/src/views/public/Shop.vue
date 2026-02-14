<template>
  <div class="products-view bg-surface h-100 font-sans">
    <!-- App Bar -->
    <v-app-bar color="white" elevation="0" height="80" class="border-b-0 sticky-nav">
      <v-container class="d-flex align-center py-0">
        <div class="d-flex align-center cursor-pointer" @click="$router.push('/')">
            <img src="/logo.svg" alt="Seyyal Logo" height="48" class="mr-3 elevation-1 rounded-lg" />
        </div>
        <v-spacer></v-spacer>
        
        <v-btn 
            variant="flat" 
            color="teal-lighten-5" 
            class="text-teal-darken-3 font-weight-bold rounded-pill px-5 transition-transform hover-scale"
            height="48"
            @click="cartDrawer = !cartDrawer"
            elevation="0"
        >
          <v-badge :content="cartTotalItems" color="error" v-if="cartTotalItems" floating offset-x="2" offset-y="2" class="font-weight-bold">
            <v-icon start icon="mdi-cart-outline" size="24"></v-icon>
          </v-badge>
          <v-icon v-else start icon="mdi-cart-outline" size="24"></v-icon>
          <span class="d-none d-sm-inline ml-1 text-body-1">My Cart</span>
          <span class="ml-3 bg-white px-3 py-1 rounded-pill text-caption font-weight-black text-teal-darken-3 elevation-1" v-if="cartTotalItems">
            ₹{{ cartTotal.toFixed(0) }}
          </span>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <!-- Original Hero Section Restored -->
      <div class="hero-section relative overflow-hidden mb-12">
        <div class="hero-bg-pattern"></div>
        <div class="hero-overlay"></div>
        <v-container class="relative z-1 py-16">
            <v-row align="center" justify="center" class="py-lg-16">
                <v-col cols="12" md="8" lg="7" class="text-center text-md-left">
                    <v-chip 
                        color="white" 
                        variant="flat" 
                        class="font-weight-bold mb-6 px-4 text-teal-darken-4 elevation-2" 
                        size="default"
                    >
                        <v-icon start icon="mdi-star-four-points" size="small" class="mr-1 text-amber"></v-icon>
                        NEW COLLECTION ARRIVED
                    </v-chip>
                    
                    <h1 class="text-h3 text-md-h2 text-lg-h1 font-weight-black mb-6 text-white lh-tight drop-shadow-sm font-heading">
                        Elevate Your <br>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">Daily Lifestyle.</span>
                    </h1>
                    
                    <p class="text-h6 text-teal-lighten-4 mb-10 font-weight-regular lh-relaxed mx-auto mx-md-0" style="max-width: 600px;">
                        Discover a curated selection of premium products designed to enhance your everyday life. Quality, delivered fast.
                    </p>
                    
                    <div class="d-flex flex-column flex-sm-row gap-4 justify-center justify-md-start">
                        <v-btn 
                            color="white" 
                            class="text-teal-darken-4 font-weight-bold px-8" 
                            size="x-large" 
                            rounded="pill" 
                            prepend-icon="mdi-arrow-down"
                            @click="scrollToProducts"
                            elevation="3"
                        >
                            Start Shopping
                        </v-btn>
                        <!-- Integrated Search in Hero -->
                        <div class="hero-search-wrapper rounded-pill elevation-3 d-flex align-center bg-white px-2 mt-4 mt-sm-0" style="min-width: 300px;">
                            <v-icon color="grey" class="ml-3">mdi-magnify</v-icon>
                            <input 
                                v-model="search"
                                placeholder="Search products..."
                                class="flex-grow-1 px-3 py-3 text-body-1 text-grey-darken-3 outline-none"
                                style="width: 100%; border: none; outline: none;"
                            />
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="4" lg="5" class="d-none d-md-flex justify-end relative">
                     <div class="floating-card rounded-xl bg-white/10 backdrop-blur-md pa-6 border-white/20 border-thin elevation-10" style="width: 380px;">
                        <div class="d-flex align-center mb-6">
                            <v-avatar color="white" size="56" class="mr-4 elevation-2">
                                <v-icon color="teal" size="32">mdi-basket-outline</v-icon>
                            </v-avatar>
                            <div>
                                <div class="text-white font-weight-bold text-h6">Premium Quality</div>
                                <div class="text-teal-lighten-4 text-caption">Guaranteed Authentic</div>
                            </div>
                        </div>
                        <div class="d-flex align-center justify-space-between mb-2">
                             <div class="h-2 w-24 bg-white/20 rounded-pill"></div>
                             <div class="h-2 w-12 bg-white/20 rounded-pill"></div>
                        </div>
                        <div class="h-32 w-full bg-gradient-to-br from-white/10 to-transparent rounded-lg mb-4 border-white/10 border-thin"></div>
                     </div>
                </v-col>
            </v-row>
        </v-container>
      </div>

      <v-container id="products-section" class="pb-16">
        <div class="d-flex justify-space-between align-end mb-10">
            <div>
                 <div class="text-overline text-teal font-weight-bold ls-2 mb-1">OUR CATALOG</div>
                 <h2 class="text-h3 font-weight-bold text-grey-darken-4 font-heading">Featured Products</h2>
            </div>
            <div class="text-grey-darken-1 font-weight-medium">
                Showing {{ filteredProducts.length }} results
            </div>
        </div>

        <!-- Category Filter -->
        <div class="d-flex overflow-x-auto gap-2 mb-8 hide-scrollbar">
          <v-chip
            v-for="cat in computedCategories"
            :key="cat"
            :color="selectedCategory === cat ? 'teal' : 'grey-lighten-3'"
            :variant="selectedCategory === cat ? 'flat' : 'flat'"
            :class="selectedCategory === cat ? 'text-white' : 'text-grey-darken-1'"
            class="font-weight-bold px-4"
            size="large"
            @click="selectedCategory = cat"
            link
          >
            {{ cat }}
          </v-chip>
        </div>

        <v-fade-transition mode="out-in">
          <v-row :key="selectedCategory">
             <!-- Product Cards - Using the NEW ShopProductCard -->
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
            </v-col>
            
             <!-- Loading State -->
            <v-col cols="12" v-if="loading" class="text-center py-24">
                 <v-progress-circular indeterminate color="teal" size="64"></v-progress-circular>
            </v-col>
          </v-row>
        </v-fade-transition>
      </v-container>
    </v-main>

    <!-- Cart Drawer (Kept intact with Teal/Green theme from original shop) -->
    <v-navigation-drawer 
        v-model="cartDrawer" 
        location="right" 
        width="450" 
        temporary
        class="elevation-24 rounded-l-xl border-none"
    >
      <div class="d-flex flex-column h-100">
          <div class="pa-6 bg-teal-darken-4 text-white">
              <div class="d-flex align-center justify-space-between mb-4">
                  <div class="text-h5 font-weight-black">Shopping Bag</div>
                  <v-btn icon="mdi-close" variant="text" color="white" @click="cartDrawer = false"></v-btn>
              </div>
              <div class="d-flex align-center text-teal-lighten-4 text-subtitle-2 bg-teal-darken-3 py-2 px-3 rounded-lg w-fit">
                  <v-icon start size="small">mdi-shield-check-outline</v-icon>
                  Secure Checkout
              </div>
          </div>
          
          <div class="flex-grow-1 overflow-y-auto bg-grey-lighten-5 px-4 pt-4">
               <div v-if="cart.length === 0" class="d-flex flex-column align-center justify-center fill-height pb-16 text-center">
                   <v-img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" width="120" class="mb-6 opacity-60 grayscale"></v-img>
                   <h3 class="text-h6 font-weight-medium text-grey-darken-2">Your bag is empty</h3>
                   <v-btn color="teal-darken-3" variant="flat" size="large" rounded="xl" class="mt-6" @click="cartDrawer = false">
                        Start Shopping
                   </v-btn>
              </div>

               <v-list v-else lines="two" bg-color="transparent" class="pa-0">
                <v-slide-y-transition group>
                    <v-list-item 
                        v-for="(item, i) in cart" 
                        :key="item.id"
                        class="mb-3 bg-white rounded-xl elevation-0 border-thin py-3"
                    >
                      <template v-slot:prepend>
                          <div class="rounded-lg bg-grey-lighten-4 mr-4 d-flex align-center justify-center overflow-hidden" style="width: 72px; height: 72px;">
                           <img :src="item.image || '/logo.svg'" class="object-cover w-full h-full" />
                      </div>
                      </template>
                      
                      <v-list-item-title class="font-weight-bold text-body-1 mb-1 text-grey-darken-4">{{ item.name }}</v-list-item-title>
                      <template v-slot:subtitle>
                          <div class="d-flex align-center justify-space-between mt-2">
                             <div class="font-weight-black text-h6 text-teal-darken-2">₹{{ (item.unit_price * item.qty).toFixed(2) }}</div>
                             
                             <div class="d-flex align-center bg-grey-lighten-5 border rounded-pill px-1">
                                 <v-btn icon="mdi-minus" size="x-small" variant="text" density="comfortable" color="grey-darken-1" @click="updateQty(item, -1)"></v-btn>
                                 <span class="mx-3 font-weight-bold text-body-2">{{ item.qty }}</span>
                                 <v-btn icon="mdi-plus" size="x-small" variant="text" density="comfortable" color="teal-darken-2" @click="updateQty(item, 1)"></v-btn>
                             </div>
                          </div>
                      </template>
                    </v-list-item>
                </v-slide-y-transition>
              </v-list>
          </div>

           <div class="pa-6 bg-white border-t elevation-4" v-if="cart.length">
             <div class="d-flex justify-space-between text-subtitle-1 mb-2 text-grey-darken-1 font-weight-medium">
                 <span>Subtotal</span>
                 <span>₹{{ cartTotal.toFixed(2) }}</span>
             </div>
             <div class="d-flex justify-space-between align-end mb-6">
                 <span class="text-h6 text-grey-darken-3 font-weight-bold">Total</span>
                 <span class="text-h4 font-weight-black text-teal-darken-3 lh-1">₹{{ cartTotal.toFixed(2) }}</span>
             </div>
             <v-btn 
                block 
                color="teal-darken-3" 
                size="x-large" 
                rounded="xl" 
                class="font-weight-bold elevation-4 hover-scale"
                @click="checkoutDialog = true"
                height="64"
                append-icon="mdi-arrow-right"
            >
                Checkout Now
             </v-btn>
          </div>
      </div>
    </v-navigation-drawer>

    <!-- Checkout Dialog -->
    <v-dialog v-model="checkoutDialog" max-width="500">
      <v-card class="rounded-xl overflow-hidden elevation-24">
        <div class="bg-teal-darken-3 pa-8 text-white pb-12 relative overflow-hidden">
            <div class="absolute-bg-pattern opacity-10"></div>
            <div class="text-h5 font-weight-black relative z-1">Checkout</div>
            <div class="text-teal-lighten-4 relative z-1">Complete your order details</div>
        </div>
        <v-card-text class="pa-8 mt-n8 bg-white rounded-t-xl relative z-2">
          <v-form v-model="valid" @submit.prevent="submitOrder">
            <v-text-field label="Full Name" v-model="customer.name" :rules="[v => !!v || 'Required']" variant="outlined" color="teal" class="mb-3"></v-text-field>
            <v-text-field label="Mobile Number" v-model="customer.mobile" :rules="[v => !!v || 'Required']" variant="outlined" color="teal" class="mb-3"></v-text-field>
            <v-textarea label="Address" v-model="customer.address" :rules="[v => !!v || 'Required']" variant="outlined" color="teal" rows="3"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 bg-grey-lighten-5">
          <v-btn variant="text" @click="checkoutDialog = false" color="grey-darken-1">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="teal-darken-3" variant="flat" rounded="xl" size="large" @click="submitOrder" :disabled="!valid" :loading="loading">Place Order</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="420">
      <v-card class="text-center pa-8 rounded-xl">
        <div class="d-inline-flex justify-center align-center bg-green-lighten-5 rounded-circle mb-6 elevation-0" style="width: 100px; height: 100px;">
            <v-icon size="56" color="success">mdi-check-decagram</v-icon>
        </div>
        <h3 class="text-h4 font-weight-black text-grey-darken-4 mb-2">Order Placed!</h3>
        <p class="text-body-1 text-grey mb-6">Order #{{ orderNo }}</p>
        <v-btn color="success" size="x-large" rounded="xl" block :href="whatsappLink" target="_blank" prepend-icon="mdi-whatsapp">Track on WhatsApp</v-btn>
        <v-btn variant="text" block class="mt-4" @click="successDialog = false">Close</v-btn>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import EventServices from '../../services/EventServices'
import ShopProductCard from '../../components/ShopProductCard.vue'

export default {
  name: 'PublicShop',
  components: {
    ShopProductCard
  },
  data() {
    return {
      products: [],
      cart: [],
      cartDrawer: false,
      checkoutDialog: false,
      successDialog: false,
      loading: false,
      valid: false,
      customer: { name: '', mobile: '', address: '' },
      whatsappLink: '',
      orderNo: '',
      search: '',
      selectedCategory: 'All',
      // Mock categories if backend doesn't provide them, or extract from products
      categories: ['Medicine', 'Health Care', 'Baby Care', 'Personal Care', 'Groceries'] 
    }
  },
  computed: {
    cartTotal() {
      return this.cart.reduce((acc, item) => acc + (item.unit_price * item.qty), 0)
    },
    cartTotalItems() {
        return this.cart.reduce((acc, item) => acc + item.qty, 0)
    },
    computedCategories() {
        // Dynamic extraction of brands/categories if available
        const brands = new Set(this.products.map(p => p.brand ? p.brand.name : 'General'))
        return ['All', ...Array.from(brands)]
    },
    filteredProducts() {
        let res = this.products
        
        // Category Filter
        if (this.selectedCategory !== 'All') {
            res = res.filter(p => (p.brand ? p.brand.name : 'General') === this.selectedCategory)
        }
        
        // Search Filter
        if (this.search) {
            const q = this.search.toLowerCase()
            res = res.filter(p => 
                p.name.toLowerCase().includes(q) || 
                (p.brand && p.brand.name.toLowerCase().includes(q))
            )
        }
        return res
    }
  },
  mounted() {
    this.fetchProducts()
    const saved = localStorage.getItem('saved_customer')
    if (saved) {
      try {
        this.customer = { ...this.customer, ...JSON.parse(saved) }
      } catch (e) { console.error(e) }
    }
  },
  methods: {
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
    scrollToProducts() {
        const el = document.getElementById('products-section')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
    addToCart(product) {
      const existing = this.cart.find(i => i.id === product.id)
      if (existing) {
        existing.qty++
      } else {
        // Use generic image from card logic if not present
        this.cart.push({
          id: product.id,
          name: product.name,
          unit_price: product.unit_price,
          qty: 1,
          image: product.image 
        })
      }
      this.cartDrawer = true
    },
    viewProduct(product) {
        console.log("View product", product)
    },
    updateQty(item, delta) {
      item.qty += delta
      if (item.qty <= 0) {
        this.cart = this.cart.filter(i => i.id !== item.id)
      }
    },
    async submitOrder() {
      if (!this.valid) return
      this.loading = true
      try {
        const items = this.cart.map(i => ({
          product_id: i.id,
          quantity: i.qty,
          unit_price: i.unit_price,
          total: i.unit_price * i.qty
        }))
        
        const payload = {
          customer_name: this.customer.name,
          customer_mobile: this.customer.mobile,
          address: this.customer.address,
          items: items
        }
        
        const res = await EventServices.submitOrder(payload)
        
        localStorage.setItem('saved_customer', JSON.stringify({
            name: this.customer.name,
            mobile: this.customer.mobile,
            address: this.customer.address
        }))
        
        this.orderNo = res.data.order_no
        this.whatsappLink = res.data.whatsapp_url
        
        this.checkoutDialog = false
        this.successDialog = true
        this.cart = []
        
      } catch(e) {
        console.error(e)
        alert("Failed to place order. Please try again.")
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Font & Typo Utilities */
.font-sans { font-family: 'Public Sans', 'Inter', system-ui, -apple-system, sans-serif !important; }
.tracking-tight { letter-spacing: -0.5px; }
.tracking-wide { letter-spacing: 1px; }
.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }
.lh-tight { line-height: 1.1; }
.lh-sm { line-height: 1.3; }
.lh-1 { line-height: 1; }
.lh-relaxed { line-height: 1.6; }

/* Positioning */
.relative { position: relative; }
.absolute { position: absolute; }
.absolute-full { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.sticky-nav { position: sticky !important; top: 0; z-index: 1000; }
.z-0 { z-index: 0; }
.z-1 { z-index: 1; }
.z-2 { z-index: 2; }
.z-10 { z-index: 10; }
.top-4 { top: 16px; }
.left-4 { left: 16px; }
.right-4 { right: 16px; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.w-full { width: 100%; }
.w-fit { width: fit-content; }
.h-full { height: 100%; }

/* Hero Styling - Reverted to Teal Gradient */
.hero-section {
    background: linear-gradient(135deg, #004D40 0%, #00695C 100%);
    min-height: 600px;
}
.hero-bg-pattern {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
        radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 20%);
    z-index: 0;
}
.hero-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    /* Subtle texture */
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
}
.text-transparent { color: transparent; }
.bg-clip-text { -webkit-background-clip: text; background-clip: text; }
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
.from-teal-200 { --tw-gradient-stops: #b2f5ea, var(--tw-gradient-to, #ffffff); }
.to-white { --tw-gradient-to: #ffffff; }
.outline-none:focus { outline: none; }

/* Utilities */
.elevation-0 { box-shadow: none !important; }
.elevation-1 { box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important; }
.elevation-2 { box-shadow: 0 4px 6px rgba(0,0,0,0.07) !important; }
.elevation-3 { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; }
.elevation-4 { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1) !important; }

.rounded-xl { border-radius: 20px !important; }
.rounded-full { border-radius: 9999px; }

.border-thin { border: 1px solid rgba(0,0,0,0.05); }

/* Decorative */
.floating-card {
    animation: float 6s ease-in-out infinite;
}
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
}

.hover-scale { transition: transform 0.2s; }
.hover-scale:hover { transform: scale(1.05); }

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
