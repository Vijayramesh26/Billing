<template>
  <v-carousel
    cycle
    hide-delimiter-background
    show-arrows="hover"
    height="auto"
    class="review-carousel pb-12"
    :show-arrows="false"
    delimiter-icon="mdi-circle-medium"
    active-class="text-secondary"
  >
    <v-carousel-item
      v-for="review in reviews"
      :key="review.id"
    >
      <v-sheet
        class="d-flex flex-column align-center justify-center text-center px-6 py-10 bg-transparent"
        min-height="400"
      >
        <v-icon class="mb-8 text-secondary opacity-50" size="64">mdi-format-quote-open</v-icon>
        
        <p class="text-h5 text-md-h4 font-heading font-italic text-primary mb-10" style="max-width: 900px; line-height: 1.4;">
          "{{ review.comment }}"
        </p>
        
        <div class="d-flex align-center">
            <v-avatar size="60" class="mr-4 shadow-soft">
              <v-img :src="review.avatar || 'https://placehold.co/100'" cover></v-img>
            </v-avatar>
            <div class="text-left">
                <div class="text-h6 font-weight-bold text-primary">{{ review.name }}</div>
                <v-rating
                  :model-value="review.rating"
                  readonly
                  color="secondary"
                  density="compact"
                  size="small"
                ></v-rating>
            </div>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
// Mock data for reviews since backend doesn't provide them yet
export default {
  name: 'ReviewCarousel',
  data() {
    return {
       reviews: [
      {
        id: 1,
        name: 'John Doe',
        rating: 5,
        comment: 'Excellent service! Highly recommended.',
        avatar: 'https://placehold.co/100'
      },
      {
        id: 2,
        name: 'Jane Smith',
        rating: 4,
        comment: 'Great products and friendly staff.',
        avatar: 'https://placehold.co/100'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        rating: 5,
        comment: 'Best in the city. Will visit again.',
        avatar: 'https://placehold.co/100'
      }
    ]
    }
  }
}
</script>

<style scoped>
.review-carousel :deep(.v-btn--icon) {
  background-color: rgba(0,0,0,0.05);
  color: #0F172A;
}
</style>
