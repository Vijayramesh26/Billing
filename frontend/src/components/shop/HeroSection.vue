<template>
  <div class="hero-section d-flex align-center text-center justify-center position-relative">
    <!-- Background Image with Zoom Effect -->
    <div class="hero-bg" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    
    <!-- Gradient Overlay -->
    <div class="hero-overlay"></div>
    
    <v-container class="position-relative z-10 px-6">
      <h1 ref="heroTitle" class="hero-title font-weight-bold text-white mb-6">
        {{ title }}
      </h1>
      <p ref="heroSubtitle" class="hero-subtitle text-white mb-10 opacity-90 mx-auto font-weight-light">
        {{ subtitle }}
      </p>
      <div ref="heroBtn">
        <v-btn
          :to="ctaLink"
          color="white"
          variant="outlined"
          size="x-large"
          class="text-white px-10 py-4 font-weight-bold letter-spacing-wide border-opacity-50"
          rounded="pill"
        >
          {{ ctaText }}
        </v-btn>
      </div>
    </v-container>
    
    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'

export default {
  name: 'HeroSection',
  props: {
    title: String,
    subtitle: String,
    backgroundImage: String,
    ctaText: { type: String, default: 'Discover Collection' },
    ctaLink: { type: String, default: '/shop/products' }
  },
  mounted() {
    const tl = gsap.timeline()
    
    tl.from(this.$refs.heroTitle, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.2
    })
    .from(this.$refs.heroSubtitle, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .from(this.$refs.heroBtn, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.6')
  }
}
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 1;
  animation: zoomSlow 20s infinite alternate;
}

@keyframes zoomSlow {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%);
  z-index: 2;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 4rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  max-width: 700px;
  line-height: 1.6;
}

.z-10 {
  z-index: 10;
}

.letter-spacing-wide {
  letter-spacing: 0.1em;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  opacity: 0.7;
}

.mouse {
  width: 26px;
  height: 40px;
  border: 2px solid rgba(255,255,255,0.7);
  border-radius: 20px;
  position: relative;
}

.wheel {
  width: 4px;
  height: 8px;
  background: white;
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll 1.5s infinite;
}

@keyframes scroll {
  0% { transform: translate(-50%, 0); opacity: 1; }
  100% { transform: translate(-50%, 15px); opacity: 0; }
}

.border-opacity-50 {
  border-color: rgba(255, 255, 255, 0.5) !important;
}
</style>
