<template>
  <div class="product-card-wrapper h-100">
    <v-card
      class="h-100 product-card bg-white overflow-visible"
      rounded="xl"
      elevation="0"
    >
      <div class="image-container rounded-xl overflow-hidden position-relative mb-4">
        <v-img
          :src="product.image || 'https://placehold.co/400x500?text=Product'"
          height="320"
          cover
          class="product-image"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </template>
        </v-img>
        
        <!-- Hover Overlay Actions -->
        <div class="hover-overlay d-flex align-center justify-center gap-2">
           <v-btn icon color="white" class="text-primary hover-scale" @click="$emit('view', product)">
             <v-icon>mdi-eye-outline</v-icon>
           </v-btn>
           <v-btn 
            icon 
            :color="product.current_stock > 0 ? 'primary' : 'grey'" 
            class="text-white hover-scale" 
            :disabled="product.current_stock <= 0"
            @click="$emit('add-to-cart', product)"
           >
             <v-icon>mdi-cart-plus</v-icon>
           </v-btn>
        </div>
        
        <v-chip
          v-if="isNew"
          color="secondary"
          size="small"
          class="position-absolute top-0 right-0 ma-4 font-weight-bold"
          variant="flat"
        >
          New
        </v-chip>
        
        <v-chip
          v-if="product.current_stock <= 0"
          class="position-absolute top-0 left-0 ma-4 font-weight-bold bg-black text-gold border-gold"
          size="small"
          variant="flat"
        >
          Sold Out
        </v-chip>
         <v-chip
          v-else-if="product.current_stock < 10"
          color="warning"
          size="small"
          class="position-absolute top-0 left-0 ma-4 font-weight-bold text-black"
          variant="flat"
        >
          Low Stock
        </v-chip>
      </div>
      
      <div class="pt-2 px-1">
        <div class="d-flex justify-space-between align-center mb-1">
            <div class="text-caption text-uppercase text-medium-emphasis letter-spacing-1">
              {{ product.brand ? product.brand.name : 'General' }}
            </div>
             <div v-if="product.category" class="text-caption text-primary font-weight-bold bg-blue-lighten-5 px-2 rounded">
              {{ product.category.name }}
            </div>
        </div>
        <div class="d-flex justify-space-between align-start">
          <h3 class="text-h6 font-weight-bold text-primary mb-1 text-truncate pr-2" :class="{'text-decoration-line-through text-grey': product.current_stock <= 0}">
            {{ product.name }}
          </h3>
          <span class="text-h6 font-weight-bold text-secondary">₹{{ product.unit_price }}</span>
        </div>
        <p class="text-body-2 text-medium-emphasis text-truncate-2">
          {{ product.description || 'No description available.' }}
        </p>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ShopProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    isNew() {
      // Logic to determine if product is new, e.g., created within last 7 days
      // For now, random or based on ID
      return this.product.id > 105; 
    }
  }
}
</script>

<style scoped>
/* Scoped styles ported from business-template ProductCard.vue */
.product-card-wrapper {
  perspective: 1000px;
}

.image-container {
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
  transition: box-shadow 0.4s ease;
  position: relative; /* Ensure specific positioning context */
}

.product-card:hover .image-container {
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
}

.product-image {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-card:hover .product-image {
  transform: scale(1.08); /* Using CSS transform directly */
}
/* Ensure v-img__img inherits the transform if needed, but often v-img handles it on wrapper */
:deep(.v-img__img) {
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.product-card:hover :deep(.v-img__img) {
    transform: scale(1.08);
}


.hover-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2; /* Ensure above image */
}

.product-card:hover .hover-overlay {
  opacity: 1;
}

.hover-scale {
  transition: transform 0.2s;
}
.hover-scale:hover {
  transform: scale(1.1);
}

.letter-spacing-1 {
  letter-spacing: 0.1em;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Colors from variables (fallbacks if not defined globally yet) */
.text-primary { color: #0F172A !important; }
.text-secondary { color: #C5A065 !important; }

/* Custom Premium Colors */
.bg-black { background-color: #000000 !important; }
.text-gold { color: #C5A065 !important; }
.bg-gold { background-color: #C5A065 !important; }
</style>
