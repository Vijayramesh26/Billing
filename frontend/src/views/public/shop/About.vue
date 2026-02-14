<template>
  <div class="about-view py-12">
    <v-container>
      <v-row align="center" class="mb-16">
        <v-col cols="12" md="6">
          <SectionTitle
            title="Our Story"
            :centered="false"
            subtitle="Building trust since 2024"
          />
          <p class="text-body-1 mb-4 text-medium-emphasis">
            It all started with a simple idea: to provide high-quality products and services that people can rely on. Over the years, we have grown from a small local shop to a trusted name in the industry.
          </p>
          <p class="text-body-1 mb-6 text-medium-emphasis">
            Our mission is simple. We want to make our customers' lives better. Whether it's through our products, our services, or just a friendly smile, we are here for you.
          </p>
          
          <v-row class="mt-8">
            <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="3">
              <div class="text-h4 font-weight-bold text-primary">{{ stat.value }}</div>
              <div class="text-caption text-uppercase font-weight-bold opacity-70">{{ stat.label }}</div>
            </v-col>
          </v-row>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"
            rounded="xl"
            cover
            class="elevation-4 shadow-soft"
            height="500"
          ></v-img>
        </v-col>
      </v-row>

      <v-divider class="my-16"></v-divider>

      <SectionTitle
        title="Our Values"
        subtitle="What drives us every day"
      />

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="py-10 px-6 text-center h-100 rounded-xl" elevation="0" border>
            <v-avatar color="primary-lighten-5" size="80" class="mb-6 text-primary">
              <v-icon size="40">mdi-handshake</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-2 text-primary">Integrity</h3>
            <p class="text-body-2 text-medium-emphasis">We believe in doing the right thing, even when no one is watching.</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="py-10 px-6 text-center h-100 rounded-xl" elevation="0" border>
            <v-avatar color="primary-lighten-5" size="80" class="mb-6 text-primary">
              <v-icon size="40">mdi-star</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-2 text-primary">Quality</h3>
            <p class="text-body-2 text-medium-emphasis">We never compromise on the quality of our products and services.</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="py-10 px-6 text-center h-100 rounded-xl" elevation="0" border>
             <v-avatar color="primary-lighten-5" size="80" class="mb-6 text-primary">
              <v-icon size="40">mdi-account-group</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-2 text-primary">Community</h3>
            <p class="text-body-2 text-medium-emphasis">We are proud to be a part of this community and give back whenever we can.</p>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import SectionTitle from '@/components/shop/SectionTitle.vue'

export default {
  name: 'AboutView',
  components: {
    SectionTitle
  },
  data() {
    return {
      stats: [
        { value: '2+', label: 'Years Experience' },
        { value: '1k+', label: 'Happy Customers' },
        { value: '10+', label: 'Team Members' },
        { value: '24/7', label: 'Support' },
      ]
    }
  }
}
</script>
