<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6 d-flex flex-column align-start">
    <div class="mb-8 w-100">
        <h1 class="text-h4 font-weight-black text-grey-darken-3">Welcome Back, {{ user?.username || 'Admin' }}</h1>
        <div class="text-subtitle-1 text-grey-darken-1">System status and user metrics</div>
    </div>

    <!-- Stats Cards -->
    <v-row class="w-100 mb-6">
      <v-col cols="12" md="4">
        <v-card class="rounded-xl elevation-2 overflow-hidden bg-white" height="100%">
            <div class="d-flex flex-row h-100">
                <div class="bg-blue-lighten-5 d-flex align-center justify-center pa-4" style="width: 100px;">
                    <v-icon color="blue-darken-2" size="48">mdi-account-group</v-icon>
                </div>
                <div class="pa-4 d-flex flex-column justify-center flex-grow-1">
                    <div class="text-caption font-weight-bold text-uppercase text-grey mb-1">Total Employees</div>
                    <div class="text-h3 font-weight-black text-grey-darken-3">{{ stats.total_employees }}</div>
                </div>
            </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="rounded-xl elevation-2 overflow-hidden bg-white" height="100%">
            <div class="d-flex flex-row h-100">
                <div class="bg-green-lighten-5 d-flex align-center justify-center pa-4" style="width: 100px;">
                    <v-icon color="green-darken-2" size="48">mdi-account-check</v-icon>
                </div>
                <div class="pa-4 d-flex flex-column justify-center flex-grow-1">
                    <div class="text-caption font-weight-bold text-uppercase text-grey mb-1">Active Users</div>
                    <div class="text-h3 font-weight-black text-grey-darken-3">{{ stats.active_users }}</div>
                </div>
            </div>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Charts/Details Section -->
    <v-row class="w-100">
      <v-col cols="12" md="6">
        <v-card class="rounded-xl elevation-0 border-thin pa-4 bg-white">
            <div class="d-flex align-center mb-4 px-2">
                <div class="bg-amber-lighten-5 pa-3 rounded-lg mr-3">
                    <v-icon color="amber-darken-3">mdi-chart-pie</v-icon>
                </div>
                <div>
                    <div class="text-h6 font-weight-bold text-grey-darken-3">Role Distribution</div>
                    <div class="text-caption text-grey">Employee breakdown by role</div>
                </div>
            </div>
            
            <v-divider class="mb-2 border-dashed"></v-divider>

            <v-list class="bg-transparent">
             <v-list-item v-for="role in stats.role_distribution" :key="role.Name" class="mb-2 rounded-lg border-thin">
               <template v-slot:prepend>
                   <v-avatar size="32" :color="getRoleColor(role.Name)" variant="tonal" class="font-weight-bold">
                       {{ role.Name.charAt(0).toUpperCase() }}
                   </v-avatar>
               </template>
               <v-list-item-title class="text-capitalize font-weight-bold text-body-2">{{ role.Name }}</v-list-item-title>
               <template v-slot:append>
                 <v-chip class="font-weight-bold" size="small" variant="flat">{{ role.Count }} Users</v-chip>
               </template>
             </v-list-item>
           </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'
import { mapState } from 'pinia'
import { useAuthStore } from '../../stores/auth'

export default {
    name: 'AdminStats',
    data() {
        return {
             stats: {
                total_employees: 0,
                active_users: 0,
                role_distribution: []
             }
        }
    },
    computed: {
        ...mapState(useAuthStore, ['user'])
    },
    mounted() {
        this.fetchStats()
    },
    methods: {
        async fetchStats() {
            try {
                const res = await EventServices.getAdminStats()
                this.stats = res.data
            } catch (err) {
                console.error(err)
            }
        },
        getRoleColor(role) {
             switch(role.toLowerCase()) {
                case 'admin': return 'red'
                case 'manager': return 'blue'
                case 'biller': return 'green'
                case 'inventory': return 'orange'
                default: return 'grey'
            }
        }
    }
}
</script>

<style scoped>
.border-thin { border: 1px solid rgba(0,0,0,0.08); }
.border-dashed { border-style: dashed; border-color: rgba(0,0,0,0.1); }
</style>
