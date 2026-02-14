<template>
  <div class="gallery-view py-20 bg-surface">
    <v-container>
      <div class="text-center mb-16">
        <h1 class="text-h2 font-heading font-weight-bold mb-4 text-primary">Visual Stories</h1>
        <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 600px">
          A curated glimpse into our world and work.
        </p>
      </div>

      <v-row>
        <v-col
          v-for="(item, index) in gallery"
          :key="item.id"
          cols="12" sm="6" md="4"
        >
          <div class="gallery-item-wrapper overflow-hidden rounded-xl cursor-pointer" @click="openLightbox(item)">
             <v-img
                 :src="item.image"
                 :lazy-src="item.image"
                 aspect-ratio="1"
                 cover
                 class="gallery-image transition-transform duration-700"
               >
                 <template v-slot:placeholder>
                   <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                     <v-progress-circular indeterminate color="primary"></v-progress-circular>
                   </div>
                 </template>
                 
                 <div class="overlay d-flex align-center justify-center">
                    <span class="text-white text-uppercase letter-spacing-2 font-weight-bold border-bottom-white pb-1">View</span>
                 </div>
               </v-img>
          </div>
        </v-col>
      </v-row>

      <!-- Minimal Lightbox Dialog -->
      <v-dialog v-model="dialog" max-width="1200" scrim="black" opacity="0.95">
        <v-card v-if="selectedImage" color="transparent" elevation="0" class="d-flex justify-center align-center h-screen-80">
          <v-img :src="selectedImage.image" max-height="85vh" contain></v-img>
          <v-btn 
            color="white" 
            icon="mdi-close" 
            variant="text" 
            class="position-absolute top-0 right-0 ma-4" 
            size="large"
            @click="dialog = false"
          ></v-btn>
        </v-card>
      </v-dialog>

    </v-container>
  </div>
</template>

<script>
export default {
  name: 'GalleryView',
  data() {
    return {
      selectedImage: null,
      dialog: false,
      gallery: [
          { id: 1, image: 'https://images.unsplash.com/photo-1556228552-6c330c9d32dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
          { id: 2, image: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
          { id: 3, image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
          { id: 4, image: 'https://images.unsplash.com/photo-1556228720-1957be9b9403?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
          { id: 5, image: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
          { id: 6, image: 'https://images.unsplash.com/photo-1520607162513-7770d868b387?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
      ]
    }
  },
  methods: {
    openLightbox(image) {
      this.selectedImage = image
      this.dialog = true
    }
  }
}
</script>

<style scoped>
.py-20 { padding-top: 5rem; padding-bottom: 5rem; }
.gallery-item-wrapper { position: relative; }
.gallery-image { transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.gallery-item-wrapper:hover .gallery-image { transform: scale(1.05); }
.overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.4); opacity: 0; transition: opacity 0.4s ease; }
.gallery-item-wrapper:hover .overlay { opacity: 1; }
.letter-spacing-2 { letter-spacing: 0.2em; }
.border-bottom-white { border-bottom: 2px solid white; }
.h-screen-80 { height: 80vh; }
</style>
