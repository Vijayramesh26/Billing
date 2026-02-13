<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card class="elevation-10 rounded-xl pa-5">
            <div class="text-center mt-4 mb-2">
                 <v-avatar color="primary" size="64">
                    <v-icon icon="mdi-account" size="large" color="white"></v-icon>
                 </v-avatar>
            </div>
          <v-card-title class="text-h5 font-weight-bold text-center primary--text">
            Welcome Back
          </v-card-title>
          <v-card-subtitle class="text-center mb-6">
            Sign in to your account
          </v-card-subtitle>

          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="employeeId"
                label="Employee ID"
                name="login"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                color="primary"
                :rules="[v => !!v || 'ID is required']"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-inner-icon="mdi-lock-outline"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                color="primary"
                :rules="[v => !!v || 'Password is required']"
              ></v-text-field>
              
               <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" icon="mdi-alert-circle">
                {{ error }}
              </v-alert>

              <v-btn
                block
                color="primary"
                size="large"
                type="submit"
                :loading="loading"
                class="mt-2 text-none font-weight-bold rounded-lg"
                elevation="2"
              >
                Sign In
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
             <div class="text-center mt-4 text-caption text-medium-emphasis">
            &copy; {{ new Date().getFullYear() }} Seyyal. All rights reserved.
          </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'Login',
  data() {
    return {
      employeeId: '',
      password: '',
      loading: false,
      valid: false,
      error: '',
      showPassword: false
    }
  },
  computed: {
    ...mapState(useAuthStore, ['role'])
  },
  methods: {
    ...mapActions(useAuthStore, ['login']),
    async handleLogin() {
      if (!this.employeeId || !this.password) return

      this.loading = true
      this.error = ''
      
      try {
        await this.login(this.employeeId, this.password)
        
        // Redirect based on role
        switch (this.role) {
          case 'admin':
            this.$router.push('/admin')
            break
          case 'manager':
            this.$router.push('/manager')
            break
          case 'biller':
            this.$router.push('/billing')
            break
          case 'inventory':
            this.$router.push('/inventory')
            break
          default:
            this.$router.push('/')
        }
      } catch (err) {
        this.error = 'Invalid credentials or server error'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.bg-grey-lighten-4 {
  background-color: #f5f5f5 !important;
}
</style>
