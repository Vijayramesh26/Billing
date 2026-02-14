<template>
  <div class="contact-view py-12">
    <v-container>
      <SectionTitle
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to us for any queries."
      />

      <v-row class="mt-8">
        <!-- Contact Info -->
        <v-col cols="12" md="5" class="mb-8 mb-md-0">
          <v-card class="h-100 pa-8 bg-primary text-white" rounded="xl" elevation="4">
             <h3 class="text-h4 font-weight-bold mb-8">Contact Information</h3>
             
             <div class="d-flex mb-8">
               <v-icon class="mr-6 mt-1 text-secondary">mdi-map-marker</v-icon>
               <div>
                 <div class="font-weight-bold text-h6 mb-1">Address</div>
                 <div class="opacity-90 text-body-1">{{ siteInfo?.address || 'Loading...' }}</div>
               </div>
             </div>

             <div class="d-flex mb-8">
               <v-icon class="mr-6 mt-1 text-secondary">mdi-phone</v-icon>
               <div>
                 <div class="font-weight-bold text-h6 mb-1">Phone</div>
                 <div class="opacity-90 text-body-1">{{ siteInfo?.phone }}</div>
               </div>
             </div>

             <div class="d-flex mb-8">
               <v-icon class="mr-6 mt-1 text-secondary">mdi-email</v-icon>
               <div>
                 <div class="font-weight-bold text-h6 mb-1">Email</div>
                 <div class="opacity-90 text-body-1">{{ siteInfo?.email }}</div>
               </div>
             </div>

             <div class="mt-auto pt-8">
                <div class="text-subtitle-2 text-secondary mb-4 text-uppercase letter-spacing-2">Follow Us</div>
               <v-btn
                  v-for="(link, platform) in siteInfo?.socials"
                  :key="platform"
                  icon
                  variant="outlined"
                  color="white"
                  :href="link"
                  class="mr-3 border-opacity-50"
               >
                  <v-icon>mdi-{{ platform }}</v-icon>
               </v-btn>
             </div>
          </v-card>
        </v-col>

        <!-- Contact Form -->
        <v-col cols="12" md="7">
          <v-card class="pa-10 h-100" rounded="xl" elevation="2">
            <h3 class="text-h5 font-weight-bold mb-6 text-primary">Send us a message</h3>
            <v-form v-model="form" @submit.prevent="submit">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.name"
                    label="Your Name"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.phone"
                    label="Phone Number"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.email"
                    label="Email Address"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.message"
                    label="Message"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rows="4"
                    :rules="[rules.required]"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="x-large"
                    block
                    rounded="xl"
                    class="font-weight-bold"
                    :loading="loading"
                    :disabled="!form"
                  >
                    Send Message
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Map Section -->
      <v-row class="mt-12">
        <v-col cols="12">
          <ShopTiming :isMap="true" class="mb-4 bg-white rounded-xl elevation-1 d-md-none" />
          <v-card height="400" rounded="xl" elevation="2" class="overflow-hidden">
             <!-- Placeholder for map -->
             <v-img
               src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
               cover
               height="100%"
             >
               <div class="d-flex align-center justify-center fill-height bg-black-opacity text-white">
                 <div class="text-center">
                   <v-icon size="48" class="mb-2">mdi-map-marker-radius</v-icon>
                   <div class="text-h5">Find us on Google Maps</div>
                   <div class="text-caption mt-1">{{ siteInfo?.address }}</div>
                 </div>
               </div>
             </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar" color="success">
      Message sent successfully!
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useSiteStore } from '@/stores/site'
import SectionTitle from '@/components/shop/SectionTitle.vue'
import ShopTiming from '@/components/shop/ShopTiming.vue'

export default {
  name: 'ContactView',
  components: {
    SectionTitle,
    ShopTiming
  },
  data() {
    return {
      form: false,
      formData: {
        name: '',
        email: '',
        phone: '',
        message: ''
      },
      loading: false,
      snackbar: false,
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  computed: {
    ...mapState(useSiteStore, ['siteInfo'])
  },
  methods: {
    async submit() {
      if (!this.form) return
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.loading = false
      this.snackbar = true
      this.formData = { name: '', email: '', phone: '', message: '' }
    }
  }
}
</script>

<style scoped>
.bg-black-opacity { background: rgba(0,0,0,0.6); }
.letter-spacing-2 { letter-spacing: 0.2em; }
.border-opacity-50 { border-color: rgba(255, 255, 255, 0.5) !important; }
</style>
