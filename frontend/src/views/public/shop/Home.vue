<template>
  <div class="home-view">
    <!-- Hero Section -->
    <HeroSection
      :title="siteInfo?.name || 'Seyal'"
      :subtitle="siteInfo?.tagline || 'Elevate Your Daily Lifestyle'"
      :backgroundImage="'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'"
      ctaText="Explore Collection"
      ctaLink="/shop/products"
    />

    <!-- Features Section -->
    <v-container class="py-16">
      <SectionTitle
        title="Why Choose Us"
        subtitle="Experience the difference of true quality."
        class="mb-12"
      />
      
      <v-row>
        <v-col v-for="(feature, i) in features" :key="i" cols="12" sm="6" md="3">
          <v-card 
            class="fill-height py-10 px-6 text-center shadow-hover border-thin" 
            elevation="0"
          >
            <div class="d-inline-flex align-center justify-center rounded-circle bg-surface mb-6 pa-4 shadow-soft">
              <v-icon color="secondary" size="32">{{ feature.icon }}</v-icon>
            </div>
            <h3 class="text-h6 font-weight-bold mb-3 text-primary">{{ feature.title }}</h3>
            <p class="text-body-2 text-medium-emphasis">{{ feature.desc }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Products Link -->
    <section class="bg-surface py-20 position-relative overflow-hidden">
      <div class="decorative-blob blob-1"></div>
      
      <v-container class="position-relative z-10">
        <div class="d-flex flex-column flex-md-row justify-space-between align-center mb-12">
           <div class="text-center text-md-left mb-6 mb-md-0">
             <h2 class="text-h3 font-heading font-weight-bold text-primary mb-2">Editor's Picks</h2>
             <p class="text-body-1 text-medium-emphasis">Selected items for the season.</p>
           </div>
           <v-btn 
             to="/shop/products" 
             variant="text" 
             color="secondary" 
             class="font-weight-bold"
             append-icon="mdi-arrow-right"
           >
             View All
           </v-btn>
        </div>

        <!-- MOCK DATA FOR HOME PAGE DISPLAY - Just 4 Items -->
        <v-row>
           <v-col cols="12" sm="6" md="3" v-for="n in 4" :key="n">
               <v-skeleton-loader type="card" v-if="loading"></v-skeleton-loader>
               <ShopProductCard 
                  v-else 
                  :product="{
                      id: n, 
                      name: 'Premium Item ' + n, 
                      unit_price: 100 * n, 
                      image: 'https://placehold.co/400x500', 
                      brand: {name: 'Seyal'} 
                  }" 
                  @add-to-cart="addToCart"
               />
           </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Modern Split Section -->
    <v-container fluid class="pa-0">
      <v-row no-gutters>
         <v-col cols="12" md="6" class="bg-primary d-flex align-center justify-center pa-16 text-center text-md-left">
            <div style="max-width: 500px">
              <div class="text-overline text-secondary mb-2 letter-spacing-2">Est. 2024</div>
              <h2 class="text-h3 font-heading font-weight-bold text-white mb-6">
                Crafting Excellence Since Day One.
              </h2>
              <p class="text-white text-body-1 opacity-80 mb-8 font-weight-light">
                We believe in the power of good design and quality craftsmanship. Every product we offer is a testament to our commitment to excellence.
              </p>
              
              <v-list class="bg-transparent text-white mb-8">
                <v-list-item prepend-icon="mdi-check-circle-outline" title="Ethically Sourced" class="px-0"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle-outline" title="Artisan Craftsmanship" class="px-0"></v-list-item>
              </v-list>
              
              <ShopTiming class="bg-white text-primary rounded-xl" />
            </div>
         </v-col>
         <v-col cols="12" md="6">
            <v-img
               src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
               cover
               height="100%"
               min-height="500"
            ></v-img>
         </v-col>
      </v-row>
    </v-container>

    <!-- Reviews -->
    <section class="py-20 bg-background">
      <v-container>
        <SectionTitle
          title="Client Stories"
          subtitle="Hear from those who have experienced the difference."
        />
        <ReviewCarousel />
      </v-container>
    </section>

    <!-- Contact CTA -->
    <ContactCTA />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useSiteStore } from '@/stores/site'
import { useCartStore } from '@/stores/cart'
import HeroSection from '@/components/shop/HeroSection.vue'
import SectionTitle from '@/components/shop/SectionTitle.vue'
import ShopProductCard from '@/components/ShopProductCard.vue'
import ReviewCarousel from '@/components/shop/ReviewCarousel.vue'
import ContactCTA from '@/components/shop/ContactCTA.vue'
import ShopTiming from '@/components/shop/ShopTiming.vue'

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    SectionTitle,
    ShopProductCard,
    ReviewCarousel,
    ContactCTA,
    ShopTiming
  },
  data() {
    return {
      loading: false,
      features: [
        { title: 'Premium Quality', icon: 'mdi-diamond-stone', desc: 'Curated selection of best-in-class products.' },
        { title: 'Global Delivery', icon: 'mdi-earth', desc: 'Fast and secure shipping worldwide.' },
        { title: 'Expert Support', icon: 'mdi-face-agent', desc: 'Dedicated concierge service for clients.' },
        { title: 'Secure Payment', icon: 'mdi-shield-check-outline', desc: '100% secure payment processing.' }
      ]
    }
  },
  computed: {
    ...mapState(useSiteStore, ['siteInfo'])
  },
  methods: {
      ...mapActions(useCartStore, ['addToCart'])
  }
}
</script>

<style scoped>
.py-20 { padding-top: 5rem; padding-bottom: 5rem; }
.border-thin { border: 1px solid rgba(0,0,0,0.05); }
.decorative-blob { position: absolute; filter: blur(80px); z-index: 1; opacity: 0.5; }
.blob-1 { top: -10%; right: -5%; width: 500px; height: 500px; background-color: rgba(197, 160, 101, 0.1); border-radius: 50%; }
.z-10 { z-index: 10; }
.letter-spacing-2 { letter-spacing: 0.2em; }
.shadow-hover { transition: box-shadow 0.3s; }
.shadow-hover:hover { box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1) !important; }
</style>
