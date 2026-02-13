<template>
  <div class="bg-background fill-height">
    <!-- Top App Bar (Always Visible) -->
    <v-app-bar app color="surface" elevation="1" class="px-md-4">
        <div v-if="companyLogo" class="d-flex align-center mr-3 cursor-pointer select-none" style="height: 100%; max-width: 200px;" @click="$router.push('/')">
          <img :src="companyLogo" alt="Logo" style="max-height: 48px; max-width: 100%; object-fit: contain;" />
        </div>
        <!-- <v-app-bar-title class="font-weight-bold text-primary" style="max-width: 400px">
            {{ companyName }} <span class="text-caption text-grey">| Inventory Login</span>
        </v-app-bar-title> -->
        
        <!-- Desktop Navigation -->
        <template v-if="!mobile">
            <v-spacer></v-spacer>
            <div class="d-flex align-center gap-2">
                <v-btn 
                    v-for="(item, i) in menuItems" 
                    :key="i" 
                    :to="item.to"
                    variant="text"
                    rounded="lg"
                    :color="$route.path === item.to ? 'primary' : 'grey-darken-1'"
                    class="text-capitalize font-weight-medium"
                >
                    <v-icon start size="small">{{ item.icon }}</v-icon>
                    {{ item.title }}
                </v-btn>
                <v-divider vertical class="mx-2 my-3"></v-divider>
                <v-btn color="error" variant="tonal" rounded="lg" @click="handleLogout" prepend-icon="mdi-logout">Logout</v-btn>
            </div>
        </template>
        
        <!-- Mobile Logout -->
        <template v-else>
            <v-spacer></v-spacer>
            <v-btn icon color="error" variant="text" @click="handleLogout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </template>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4 pa-md-6 mb-16 mb-md-0"> <!-- Add bottom margin for mobile nav -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- Bottom Navigation (Mobile Only) -->
    <v-bottom-navigation v-if="mobile" app grow color="primary" bg-color="surface" elevation="10" style="z-index: 2000;">
       <v-btn v-for="(item, i) in menuItems.slice(0, 5)" :key="i" :to="item.to">
          <v-icon>{{ item.icon }}</v-icon>
          <span class="text-caption" style="font-size: 10px !important">{{ item.title.split(' ')[0] }}</span>
       </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import { useDisplay } from 'vuetify'
import EventServices from '../../services/EventServices'

export default {
  name: 'InventoryDashboard',
  data() {
    return {
      companyName: 'Inventory Dashboard',
      companyLogo: '',
      menuItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/inventory' },
        { title: 'Products', icon: 'mdi-package-variant', to: '/inventory/products' },
        { title: 'Add Stock', icon: 'mdi-plus-box', to: '/inventory/stock' },
        { title: 'Alerts', icon: 'mdi-alert', to: '/inventory/alerts' },
      ]
    }
  },
  computed: {
    ...mapState(useAuthStore, ['user']),
    mobile() {
      const { mobile } = useDisplay()
      return mobile.value
    }
  },
  async mounted() {
    try {
      const res = await EventServices.getConfig()
      if (res.data.company_name) {
        this.companyName = res.data.company_name
      }
      if (res.data.company_logo) {
        this.companyLogo = res.data.company_logo
      }
    } catch (e) {
      console.error("Failed to load config", e)
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>
