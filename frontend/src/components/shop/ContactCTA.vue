<template>
  <v-container class="py-12">
    <div class="cta-wrapper position-relative overflow-hidden rounded-xl bg-primary text-white py-16 px-6 px-md-16 text-center">
      <!-- Background Graphic -->
      <div class="cta-bg-circle d-none d-md-block"></div>
      
      <div class="position-relative z-10">
        <div class="text-overline text-secondary mb-4 letter-spacing-2">Get In Touch</div>
        <h2 class="text-h3 text-md-h2 font-heading font-weight-bold mb-6">
          Ready to elevate your experience?
        </h2>
        <p class="text-h6 font-weight-light opacity-80 mb-10 mx-auto" style="max-width: 600px">
          We are open and ready to serve you. Check out our products or get in touch for more information.
        </p>
        <div class="d-flex flex-column flex-sm-row justify-center gap-4">
          <v-btn 
            size="x-large" 
            color="secondary" 
            class="text-primary font-weight-bold px-8 rounded-pill" 
            to="/shop/contact"
            elevation="4"
          >
            Contact Us
          </v-btn>
          <v-btn 
            size="x-large" 
            variant="outlined" 
            color="white" 
            class="font-weight-bold px-8 rounded-pill border-opacity-50" 
            to="/shop/products"
          >
            Browse Products
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ContactCTA'
}
</script>

<style scoped>
.cta-wrapper {
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
}

.cta-bg-circle {
  position: absolute;
  top: 50%;
  right: -10%;
  transform: translateY(-50%);
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 40px solid rgba(197, 160, 101, 0.05); /* Secondary color faint */
}

.letter-spacing-2 {
  letter-spacing: 0.2em;
}

.border-opacity-50 {
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.gap-4 {
  gap: 1rem;
}
</style>
