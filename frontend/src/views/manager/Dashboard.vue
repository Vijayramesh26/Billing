<template>
  <div class="bg-background fill-height">
    <!-- Top App Bar (Always Visible) -->
    <v-app-bar  app color="surface" elevation="0" class="px-md-4 border-b-gold">
        <div v-if="companyLogo" class="d-flex align-center mr-3 cursor-pointer select-none" style="height: 100%; max-width: 200px;" @click="$router.push('/manager')">
          <img :src="companyLogo" alt="Logo" style="max-height: 48px; max-width: 100%; object-fit: contain;" />
        </div>
        
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
                    :color="$route.path === item.to ? 'secondary' : 'grey-darken-1'"
                    class="text-capitalize font-weight-medium"
                >
                    <v-icon start size="small">{{ item.icon }}</v-icon>
                    {{ item.title }}
                </v-btn>
                <v-divider vertical class="mx-2 my-3"></v-divider>
                
                <!-- Account Menu -->
                <v-menu transition="scale-transition">
                  <template v-slot:activator="{ props }">
                    <v-btn variant="tonal" color="secondary" rounded="lg" class="text-capitalize" v-bind="props">
                      <v-icon start>mdi-account-circle</v-icon>
                      {{ user?.username || 'Manager' }}
                    </v-btn>
                  </template>
                  <v-list class="rounded-xl mt-2 elevation-10 pa-2" min-width="200">
                    <v-list-item @click="toggleTheme" rounded="lg">
                      <template v-slot:prepend>
                        <v-icon :color="isDark ? 'amber' : 'secondary'">
                          {{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
                        </v-icon>
                      </template>
                      <v-list-item-title class="font-weight-medium">
                        {{ isDark ? 'Light' : 'Dark' }} Mode
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-2"></v-divider>
                    <v-list-item @click="passwordDialog = true" rounded="lg">
                      <template v-slot:prepend><v-icon color="secondary">mdi-lock-reset</v-icon></template>
                      <v-list-item-title class="font-weight-medium">Change Password</v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-2"></v-divider>
                    <v-list-item @click="handleLogout" color="error" rounded="lg">
                      <template v-slot:prepend><v-icon color="error">mdi-logout</v-icon></template>
                      <v-list-item-title class="font-weight-medium text-error">Logout</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </div>
        </template>
        
        <!-- Mobile Actions -->
        <template v-else>
            <v-spacer></v-spacer>
            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon color="secondary" v-bind="props">
                  <v-icon>mdi-account-circle</v-icon>
                </v-btn>
              </template>
              <v-list class="rounded-xl mt-2 elevation-10 pa-2" min-width="200">
                <v-list-item @click="toggleTheme" rounded="lg">
                  <template v-slot:prepend>
                    <v-icon :color="isDark ? 'amber' : 'secondary'">
                      {{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
                    </v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    {{ isDark ? 'Light' : 'Dark' }} Mode
                  </v-list-item-title>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item @click="passwordDialog = true" rounded="lg">
                  <template v-slot:prepend><v-icon color="secondary">mdi-lock-reset</v-icon></template>
                  <v-list-item-title class="font-weight-medium">Change Password</v-list-item-title>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item @click="handleLogout" color="error" rounded="lg">
                  <template v-slot:prepend><v-icon color="error">mdi-logout</v-icon></template>
                  <v-list-item-title class="font-weight-medium text-error">Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
        </template>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4 pa-md-6 mb-16 mb-md-0"> <!-- Add bottom margin for mobile nav -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- Change Password Dialog -->
    <v-dialog v-model="passwordDialog" max-width="400px">
      <v-card class="rounded-xl overflow-hidden">
        <v-toolbar color="secondary" class="px-4 bg-gradient-gold text-white" density="comfortable">
            <v-toolbar-title class="text-body-1 font-weight-bold">Change Your Password</v-toolbar-title>
            <v-btn icon="mdi-close" variant="text" @click="passwordDialog = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
            <v-text-field 
                v-model="newPassword" 
                label="New Password" 
                type="password" 
                variant="outlined" 
                density="comfortable"
                prepend-inner-icon="mdi-lock-reset"
                color="secondary"
            ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="passwordDialog = false">Cancel</v-btn>
          <v-btn class="bg-gradient-gold text-white px-6" variant="flat" rounded="lg" @click="handleResetPassword" :loading="resetting">Change Password</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Bottom Navigation (Mobile Only) -->
    <v-bottom-navigation v-if="mobile" app grow color="secondary" bg-color="surface" elevation="10" style="z-index: 2000;">
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
import { useSnackbarStore } from '@/stores/snackbar'
import { useDisplay, useTheme } from 'vuetify'
import EventServices from '../../services/EventServices'

export default {
  name: 'ManagerDashboard',
  setup() {
    const { mobile } = useDisplay()
    const snackbarStore = useSnackbarStore()
    const theme = useTheme()
    return { mobile, snackbarStore, theme }
  },
  data() {
    return {
      companyName: 'Manager Dashboard',
      companyLogo: '',
      passwordDialog: false,
      newPassword: '',
      resetting: false,
      menuItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/manager' },
        { title: 'Customers', icon: 'mdi-account-group', to: '/manager/customers' },
        { title: 'Inventory', icon: 'mdi-package-variant', to: '/manager/stock' },
        { title: 'Update Stock', icon: 'mdi-package-variant-closed', to: '/manager/entry' },
        { title: 'Sales Reports', icon: 'mdi-chart-box', to: '/manager/reports' },
        { title: 'Discounts', icon: 'mdi-sale', to: '/manager/discount' },
        { title: 'Orders', icon: 'mdi-clipboard-list', to: '/manager/orders' },
      ]
    }
  },
  computed: {
    ...mapState(useAuthStore, ['user']),
    isDark() {
      return this.theme.global.current.value.dark
    }
  },
  async mounted() {
    // Persistent theme
    const savedTheme = localStorage.getItem('theme-mode')
    if (savedTheme) {
      this.theme.global.name.value = savedTheme
    }

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
    },
    toggleTheme() {
      this.theme.global.name.value = this.theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'
      localStorage.setItem('theme-mode', this.theme.global.name.value)
    },
    async handleResetPassword() {
      if (!this.newPassword) return
      this.resetting = true
      try {
        await EventServices.changePassword(this.newPassword)
        this.snackbarStore.showSnackbar('Your password has been changed successfully', 'success')
        this.passwordDialog = false
        this.newPassword = ''
      } catch (e) {
        console.error("Password reset error:", e)
        this.snackbarStore.showSnackbar('Failed to change password', 'error')
      } finally {
        this.resetting = false
      }
    }
  }
}
</script>

<style scoped>
.bg-gradient-gold {
  background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%) !important;
}
.border-b-gold {
  position: relative;
  border-bottom: 2px solid rgba(197, 160, 101, 0.2) !important;
}
.border-b-gold::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, #C5A065, #B08D55, #C5A065);
  z-index: 5;
}
</style>
