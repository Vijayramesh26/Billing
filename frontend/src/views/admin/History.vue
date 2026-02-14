<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6 d-flex flex-column align-start">
    <div class="mb-6 w-100">
        <h1 class="text-h4 font-weight-black gradient-text">Access Logs</h1>
        <div class="text-subtitle-1 text-grey-darken-1">Monitor system login activity</div>
    </div>

    <v-card class="w-100 rounded-xl elevation-0 border-thin bg-transparent flex-grow-1 d-flex flex-column">
      <v-data-table
        :headers="headers"
        :items="history"
        :loading="loading"
        :search="search"
        class="rounded-xl elevation-1 bg-white flex-grow-1"
        hover
      >
        <template v-slot:top>
            <div class="px-4 py-3 d-flex align-center bg-white border-b w-100">
                <v-icon color="grey-lighten-1" class="mr-3">mdi-magnify</v-icon>
                <v-text-field
                    v-model="search"
                    placeholder="Search logs..."
                    variant="plain"
                    hide-details
                    density="compact"
                    class="text-body-1 w-100"
                ></v-text-field>
            </div>
        </template>

        <template v-slot:header="{ props }">
            <tr>
                <th v-for="head in props.headers" :key="head.key" class="text-caption font-weight-bold text-uppercase text-grey-darken-1 bg-grey-lighten-5 py-3 border-b">
                    {{ head.title }}
                </th>
            </tr>
        </template>

        <template v-slot:item="{ item }">
            <tr class="hover-bg-grey-lighten-5 transition-swing">
                <td class="py-4">
                     <div class="d-flex align-center">
                        <v-avatar color="primary-lighten-5" class="mr-3 text-primary font-weight-bold" rounded="lg" size="small">
                            <v-icon size="small">mdi-account</v-icon>
                        </v-avatar>
                        <span class="font-weight-bold text-body-2 text-grey-darken-3">{{ item.user ? item.user.username : 'Unknown' }}</span>
                    </div>
                </td>
                <td class="py-4">
                    <v-chip variant="tonal" size="small" class="font-weight-bold text-uppercase" label color="grey">
                        {{ item.user && item.user.role ? item.user.role.name : '-' }}
                    </v-chip>
                </td>
                <td class="py-4">
                    <div class="text-body-2">{{ new Date(item.login_time).toLocaleDateString() }}</div>
                    <div class="text-caption text-grey">{{ new Date(item.login_time).toLocaleTimeString() }}</div>
                </td>
                <td class="py-4">
                    <div class="font-family-monospace bg-grey-lighten-4 px-2 py-1 rounded d-inline-block text-caption text-grey-darken-3">
                        {{ item.ip_address || '127.0.0.1' }}
                    </div>
                </td>
            </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
    name: 'AdminHistory',
    data() {
        return {
            headers: [
              { title: 'User', key: 'user.username' },
              { title: 'Role', key: 'user.role.name' },
              { title: 'Login Time', key: 'login_time' },
              { title: 'IP Address', key: 'ip_address' },
            ],
            history: [],
            loading: false,
            search: ''
        }
    },
    mounted() {
        this.fetchHistory()
    },
    methods: {
        async fetchHistory() {
            this.loading = true
            try {
                const res = await EventServices.getLoginHistory()
                this.history = res.data
            } catch (err) {
                console.error(err)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.border-thin { border: 1px solid rgba(0,0,0,0.08); }
.bg-gradient-gold {
    background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%) !important;
}
.gradient-text {
    background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
