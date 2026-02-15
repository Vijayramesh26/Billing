<template>
  <v-app class="bg-surface font-sans">
    <!-- Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      temporary 
      class="glass-dark bg-primary text-white" 
      width="300"
      style="position: fixed !important; height: 100vh !important; top: 0 !important; z-index: 3000 !important;"
    >
      <div class="pa-6 text-center">
        <v-avatar size="80" color="secondary" class="mb-4 text-white font-weight-bold text-h4">
           {{ siteInfo?.name?.charAt(0) || 'S' }}
        </v-avatar>
        <div class="text-h6 font-weight-bold text-white">{{ siteInfo?.name }}</div>
        <div class="text-caption text-grey-lighten-1">{{ siteInfo?.tagline }}</div>
      </div>
      
      <v-divider class="border-opacity-10"></v-divider>
      
      <v-list class="bg-transparent pa-4">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          active-color="secondary"
          class="mb-2 rounded-lg text-white"
          variant="text"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" class="mr-4"></v-icon>
          </template>
          <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Floating Capsule App Bar -->
    <v-app-bar 
      flat 
      fixed 
      class="floating-capsule-appbar"
      height="80"
    >
      <v-container class="d-flex align-center h-100 px-6" fluid>
        <!-- Left: Branding -->
        <div class="d-flex align-center cursor-pointer logo-section" @click="$router.push('/shop')" style="width: 200px;">
           <img src="/logo.svg" alt="Logo" height="38" class="mr-2 logo-bounce" />
          <!-- <span class="text-h5 font-heading font-weight-bold text-secondary d-none d-sm-block">
            {{ siteInfo?.name }}
          </span> -->
        </div>

        <!-- Center: Navigation -->
        <div class="d-none d-md-flex align-center flex-grow-1 justify-center nav-items-wrapper">
          <v-btn
            v-for="item in items"
            :key="item.title"
            :to="item.to"
            variant="text"
            rounded="pill"
            class="nav-item-btn mx-1"
          >
            {{ item.title }}
          </v-btn>
        </div>

        <!-- Right: Actions -->
        <div class="d-flex align-center justify-end" style="width: 200px;">
           <div class="d-none d-md-block divider mx-4"></div>
           
           <!-- Cart Button -->
           <v-btn icon @click="toggleDrawer" class="cart-btn-floating">
               <v-badge :content="cartTotalItems" color="secondary" v-if="cartTotalItems" floating overlap>
                  <v-icon size="24">mdi-shopping-outline</v-icon>
              </v-badge>
               <v-icon v-else size="24">mdi-shopping-outline</v-icon>
           </v-btn>

           <!-- Mobile Drawer Toggle -->
           <v-app-bar-nav-icon class="d-md-none ml-2" @click="drawer = !drawer"></v-app-bar-nav-icon>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="pt-0">
      <router-view v-slot="{ Component }">
        <transition name="fade-up" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Global Shop Cart Drawer -->
    <v-navigation-drawer 
        v-model="cartDrawer" 
        location="right" 
        width="450" 
        temporary
        class="elevation-24 rounded-l-xl border-none shadow-premium"
        style="position: fixed !important; height: 100vh !important; top: 0 !important; z-index: 3000 !important;"
    >
      <div class="d-flex flex-column h-100">
          <div class="pa-6 bg-primary text-white">
              <div class="d-flex align-center justify-space-between mb-4">
                  <div class="text-h5 font-weight-black">Shopping Bag</div>
                  <v-btn icon="mdi-close" variant="text" color="white" @click="toggleDrawer"></v-btn>
              </div>
              <div class="d-flex align-center text-teal-lighten-4 text-subtitle-2 bg-white/10 py-2 px-3 rounded-lg w-fit">
                  <v-icon start size="small" color="secondary">mdi-shield-check-outline</v-icon>
                  Secure Checkout
              </div>
          </div>
          
          <div class="flex-grow-1 overflow-y-auto bg-grey-lighten-5 px-4 pt-4">
               <div v-if="cartItems.length === 0" class="d-flex flex-column align-center justify-center fill-height pb-16 text-center">
                   <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-basket-off-outline</v-icon>
                   <h3 class="text-h6 font-weight-medium text-grey-darken-2">Your bag is empty</h3>
                   <v-btn color="primary" variant="flat" size="large" rounded="xl" class="mt-6" @click="toggleDrawer">
                        Start Shopping
                   </v-btn>
              </div>

               <v-list v-else lines="two" bg-color="transparent" class="pa-0">
                <v-slide-y-transition group>
                    <v-list-item 
                        v-for="item in cartItems" 
                        :key="item.id"
                        class="mb-3 bg-white rounded-xl elevation-0 border-thin py-3"
                    >
                      <template v-slot:prepend>
                          <div class="rounded-lg bg-grey-lighten-4 mr-4 d-flex align-center justify-center overflow-hidden" style="width: 72px; height: 72px;">
                           <img :src="item.image || '/logo.svg'" class="object-cover w-full h-full" />
                      </div>
                      </template>
                      
                      <v-list-item-title class="font-weight-bold text-body-1 mb-1 text-primary">{{ item.name }}</v-list-item-title>
                      <template v-slot:subtitle>
                          <div class="d-flex align-center justify-space-between mt-2">
                             <div class="font-weight-black text-h6 text-secondary">₹{{ (item.unit_price * item.qty).toFixed(2) }}</div>
                             
                             <div class="d-flex align-center bg-grey-lighten-5 border rounded-pill px-1">
                                 <v-btn icon="mdi-minus" size="x-small" variant="text" density="comfortable" color="grey-darken-1" @click="updateQty(item.id, -1)"></v-btn>
                                 <span class="mx-3 font-weight-bold text-body-2">{{ item.qty }}</span>
                                 <v-btn icon="mdi-plus" size="x-small" variant="text" density="comfortable" color="primary" @click="updateQty(item.id, 1)"></v-btn>
                             </div>
                          </div>
                      </template>
                    </v-list-item>
                </v-slide-y-transition>
              </v-list>
          </div>

           <div class="pa-6 bg-white border-t elevation-4" v-if="cartItems.length">
             <div class="d-flex justify-space-between text-subtitle-1 mb-2 text-grey-darken-1 font-weight-medium">
                 <span>Subtotal</span>
                 <span>₹{{ cartTotal.toFixed(2) }}</span>
             </div>
             <div class="d-flex justify-space-between align-end mb-6">
                 <span class="text-h6 text-primary font-weight-bold">Total</span>
                 <span class="text-h4 font-weight-black text-secondary lh-1">₹{{ cartTotal.toFixed(2) }}</span>
             </div>
             <v-btn 
                block 
                color="primary" 
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
        <div class="bg-primary pa-8 text-white pb-12 relative overflow-hidden">
            <div class="text-h5 font-weight-black relative z-1">Checkout</div>
            <div class="text-grey-lighten-3 relative z-1">Complete your order details</div>
        </div>
        <v-card-text class="pa-8 mt-n8 bg-white rounded-t-xl relative z-2">
          <v-form v-model="valid" @submit.prevent="submitOrder">
            <v-text-field label="Full Name" v-model="customer.name" :rules="[v => !!v || 'Required']" variant="outlined" color="primary" class="mb-3"></v-text-field>
            <v-text-field label="Mobile Number" v-model="customer.mobile" :rules="[v => !!v || 'Required']" variant="outlined" color="primary" class="mb-3"></v-text-field>
            <v-textarea label="Address" v-model="customer.address" :rules="[v => !!v || 'Required']" variant="outlined" color="primary" rows="3"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 bg-grey-lighten-5">
          <v-btn variant="text" @click="checkoutDialog = false" color="grey-darken-1">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" rounded="xl" size="large" @click="submitOrder" :disabled="!valid" :loading="loading">Place Order</v-btn>
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

    <!-- Footer -->
    <v-footer class="bg-primary text-white d-flex flex-column pt-16 pb-8">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="mb-8 mb-md-0">
            <div class="text-h4 font-heading font-weight-bold mb-6">
              {{ siteInfo?.name }}<span class="text-secondary">.</span>
            </div>
            <p class="text-body-1 text-grey-lighten-1 mb-8" style="max-width: 300px; line-height: 1.8;">
              {{ siteInfo?.description }}
            </p>
            <div class="d-flex ga-4" v-if="siteInfo?.socials">
              <v-btn v-if="siteInfo.socials.facebook" icon variant="outlined" color="secondary" size="small" :href="siteInfo.socials.facebook" class="rounded-circle border-opacity-25"><v-icon size="small">mdi-facebook</v-icon></v-btn>
              <v-btn v-if="siteInfo.socials.instagram" icon variant="outlined" color="secondary" size="small" :href="siteInfo.socials.instagram" class="rounded-circle border-opacity-25"><v-icon size="small">mdi-instagram</v-icon></v-btn>
              <v-btn v-if="siteInfo.socials.twitter" icon variant="outlined" color="secondary" size="small" :href="siteInfo.socials.twitter" class="rounded-circle border-opacity-25"><v-icon size="small">mdi-twitter</v-icon></v-btn>
             </div>
          </v-col>
          
          <v-col cols="6" md="2">
            <div class="text-subtitle-1 font-weight-bold mb-6 text-secondary">Explore</div>
            <div class="d-flex flex-column ga-3">
              <router-link to="/shop" class="text-decoration-none text-body-2 text-grey-lighten-2 hover-link">Home</router-link>
              <router-link to="/shop/about" class="text-decoration-none text-body-2 text-grey-lighten-2 hover-link">About</router-link>
              <router-link to="/shop/products" class="text-decoration-none text-body-2 text-grey-lighten-2 hover-link">Products</router-link>
              <router-link to="/shop/contact" class="text-decoration-none text-body-2 text-grey-lighten-2 hover-link">Contact</router-link>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="text-subtitle-1 font-weight-bold mb-6 text-secondary">Contact</div>
            <div class="d-flex align-start mb-4">
              <v-icon size="small" color="secondary" class="mr-3 mt-1">mdi-map-marker</v-icon>
              <span class="text-body-2 text-grey-lighten-2">{{ siteInfo?.address }}</span>
            </div>
            <div class="d-flex align-center mb-4">
              <v-icon size="small" color="secondary" class="mr-3">mdi-phone</v-icon>
              <span class="text-body-2 text-grey-lighten-2">{{ siteInfo?.phone }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="small" color="secondary" class="mr-3">mdi-email</v-icon>
              <span class="text-body-2 text-grey-lighten-2">{{ siteInfo?.email }}</span>
            </div>
          </v-col>
        </v-row>
        
        <v-divider class="my-8 border-opacity-10"></v-divider>
        
        <div class="d-flex flex-column flex-md-row justify-space-between align-center text-caption text-grey-darken-1">
          <div>© {{ new Date().getFullYear() }} {{ siteInfo?.name }}. All rights reserved.</div>
          <div class="mt-4 mt-md-0">
             Powered by Seyal Engine
          </div>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useSiteStore } from '@/stores/site'
import { useCartStore } from '@/stores/cart'
import EventServices from '@/services/EventServices'

export default {
  name: 'ShopLayout',
  data() {
    return {
      drawer: false,
      scrolled: false,
      items: [
        { title: 'Home', icon: 'mdi-home-outline', to: '/shop' },
        { title: 'Products', icon: 'mdi-package-variant', to: '/shop/products' },
        { title: 'Gallery', icon: 'mdi-image-outline', to: '/shop/gallery' },
        { title: 'About', icon: 'mdi-information-outline', to: '/shop/about' },
        { title: 'Contact', icon: 'mdi-email-outline', to: '/shop/contact' },
      ],
      checkoutDialog: false,
      successDialog: false,
      valid: false,
      loading: false,
      customer: { name: '', mobile: '', address: '' },
      orderNo: '',
      whatsappLink: ''
    }
  },
  computed: {
    ...mapState(useSiteStore, ['siteInfo']),
    ...mapState(useCartStore, {
        cartItems: 'items',
        cartTotal: 'totalPrice',
        cartTotalItems: 'totalItems',
        cartDrawerState: 'drawer'
    }),
    cartDrawer: {
        get() { return this.cartDrawerState },
        set(val) { if(!val) this.toggleDrawer() } // Only handle close from v-model
    }
  },
  methods: {
    ...mapActions(useSiteStore, ['fetchSiteInfo']),
    ...mapActions(useCartStore, ['toggleDrawer', 'updateQty', 'clearCart']),
    
    handleScroll() {
      this.scrolled = window.scrollY > 50
    },
    
    async submitOrder() {
      if (!this.valid) return
      this.loading = true
      try {
        const items = this.cartItems.map(i => ({
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
        this.clearCart()
        
      } catch(e) {
        console.error(e)
        alert("Failed to place order. Please try again.")
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchSiteInfo()
    window.addEventListener('scroll', this.handleScroll)
    
    const saved = localStorage.getItem('saved_customer')
    if (saved) {
      try {
        this.customer = { ...this.customer, ...JSON.parse(saved) }
      } catch (e) { console.error(e) }
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.font-heading { font-family: var(--font-heading) !important; }
.hover-link { transition: color 0.2s ease; }
.hover-link:hover { color: white !important; }
.border-opacity-10 { border-color: rgba(255, 255, 255, 0.1) !important; }
.border-opacity-25 { border-color: rgba(255, 255, 255, 0.25) !important; }
.transition-all { transition: all 0.3s ease; }
.hover-scale:hover { transform: scale(1.1); }

/* Floating Capsule Appbar */
.floating-capsule-appbar {
  position: fixed !important;
  top: 0 !important;
  background: #ffffff !important;
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(197, 160, 101, 0.4) !important; /* Golden Touch Border */
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.1),
    0 5px 20px rgba(197, 160, 101, 0.15), /* Golden Glow */
    inset 0 1px 2px rgba(255, 255, 255, 0.8);
  border-radius: 999px !important;
  width: calc(100% - 48px) !important;
  max-width: 1200px !important;
  margin: 16px auto !important;
  left: 0 !important;
  right: 0 !important;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 2000 !important;
}

/* Golden branding highlight */
.logo-section .text-secondary {
  color: #c5a065 !important;
  text-shadow: 0 0 10px rgba(197, 160, 101, 0.3);
}

/* Nav Item Centering & Scaling */
.nav-items-wrapper {
  gap: 8px;
}

.nav-item-btn {
  font-size: 0.85rem !important;
  letter-spacing: 0.5px !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
  text-transform: uppercase !important;
  transition: all 0.3s ease !important;
}

.nav-item-btn:hover {
  background: rgba(197, 160, 101, 0.1) !important;
  color: #c5a065 !important;
  transform: translateY(-2px);
}

.nav-item-btn.v-btn--active {
  background: #c5a065 !important;
  color: white !important;
}

/* Glass Dark Style */
.glass-dark {
  background: rgba(15, 23, 42, 0.9) !important;
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Liquid Shine Effect */
.floating-capsule-appbar::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: skewX(-25deg);
  transition: 0.7s;
  pointer-events: none;
}

.floating-capsule-appbar:hover::before {
  left: 150%;
}

/* Logo Animation */
.logo-bounce {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.logo-section:hover .logo-bounce {
  transform: scale(1.1) rotate(5deg);
}

/* Cart Button */
.cart-btn-floating {
  background: rgba(197, 160, 101, 0.1) !important;
  color: #c5a065 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.cart-btn-floating:hover {
  background: #c5a065 !important;
  color: white !important;
  transform: scale(1.1);
}

.divider {
  width: 1px;
  height: 24px;
  background: rgba(197, 160, 101, 0.2);
}

/* Transitions */
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.4s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
