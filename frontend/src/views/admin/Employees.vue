<template>
  <v-container fluid class="fill-height bg-background pa-6 d-flex flex-column align-start">
    <div class="d-flex flex-column flex-md-row justify-space-between w-100 align-start align-md-center mb-6">
        <div class="mb-4 mb-md-0">
            <h1 class="text-h4 font-weight-black gradient-text">Team</h1>
            <div class="text-subtitle-1 text-grey-darken-1">Manage employees and their access roles</div>
        </div>
        <v-btn 
            class="bg-gradient-gold text-white text-capitalize rounded-lg elevation-4 w-100 w-md-auto"
            prepend-icon="mdi-account-plus" 
            size="large" 
            @click="dialog = true"
        >
            Add New Employee
        </v-btn>
    </div>

    <v-card class="w-100 rounded-xl elevation-0 border-thin bg-transparent flex-grow-1 d-flex flex-column">
      <v-data-table 
        :headers="headers" 
        :items="employees" 
        :loading="loading"
        :search="search"
        class="rounded-xl elevation-1 bg-surface flex-grow-1"
        hover
      >
        <template v-slot:top>
            <div class="px-4 py-3 d-flex align-center bg-surface border-b w-100">
                <v-icon color="grey-lighten-1" class="mr-3">mdi-magnify</v-icon>
                <v-text-field
                    v-model="search"
                    placeholder="Search employees..."
                    variant="plain"
                    hide-details
                    density="compact"
                    class="text-body-1 w-100"
                ></v-text-field>
            </div>
        </template>

        <template v-slot:headers="{ columns }">
            <tr>
                <th v-for="column in columns" :key="column.key" class="text-caption font-weight-bold text-uppercase text-grey-darken-1 bg-background py-3 border-b">
                    {{ column.title }}
                </th>
            </tr>
        </template>

        <template v-slot:item="{ item }">
            <tr class="hover-bg-grey-lighten-5 transition-swing">
                <td class="py-4">
                    <div class="d-flex align-center">
                        <v-avatar color="primary-lighten-5" class="mr-3 text-primary font-weight-bold" rounded="lg" size="small">
                            {{ item.employee_id }}
                        </v-avatar>
                        <span class="font-weight-bold text-body-2">{{ item.employee_id }}</span>
                    </div>
                </td>
                <td class="py-4">
                    <div class="font-weight-bold text-grey-darken-3">{{ item.username }}</div>
                    <div class="text-caption text-grey">{{ item.mobile || '-' }}</div>
                </td>
                <td class="py-4">
                     <v-chip :color="getRoleColor(item.role.name)" variant="tonal" size="small" class="font-weight-bold text-uppercase" label>
                        {{ item.role.name }}
                    </v-chip>
                </td>
                <td class="py-4">
                  <v-chip :color="item.is_active ? 'success' : 'error'" variant="flat" size="small" class="font-weight-bold">
                      <v-icon start size="x-small">{{ item.is_active ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                      {{ item.is_active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </td>
                <td class="py-4 text-right">
                  <v-btn icon="mdi-key-variant" size="small" variant="text" color="orange-darken-2" class="mr-2" @click="openResetDialog(item)"></v-btn>
                  <v-btn size="small" variant="tonal" color="primary" rounded="lg" prepend-icon="mdi-pencil" @click="editItem(item)">Edit</v-btn>
                </td>
            </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px" transition="dialog-bottom-transition">
      <v-card class="rounded-xl">
        <v-toolbar color="primary" class="px-4">
            <v-toolbar-title class="font-weight-bold">{{ formTitle }}</v-toolbar-title>
            <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="editedItem.username" 
                    label="Username" 
                    variant="outlined" 
                    density="comfortable" 
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="editedItem.mobile" 
                    label="Mobile Number" 
                    variant="outlined" 
                    density="comfortable" 
                    prepend-inner-icon="mdi-phone"
                  ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="editedIndex > -1">
                  <v-text-field 
                    v-model="editedItem.employee_id" 
                    label="Employee ID" 
                    disabled 
                    variant="filled" 
                    density="comfortable"
                    prepend-inner-icon="mdi-identifier"
                  ></v-text-field>
              </v-col>
              <v-col cols="12">
                 <v-select 
                    v-model="editedItem.role_id" 
                    :items="roles" 
                    item-title="name" 
                    item-value="id" 
                    label="Role" 
                    variant="outlined" 
                    density="comfortable"
                    prepend-inner-icon="mdi-shield-account"
                 ></v-select>
              </v-col>
              <v-col cols="12" v-if="editedItem.id === -1">
                <v-text-field 
                    v-model="editedItem.password" 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    density="comfortable"
                    prepend-inner-icon="mdi-lock"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-else>
                 <v-switch v-model="editedItem.is_active" label="Active Account" color="success" inset></v-switch>
              </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-background">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" size="large" @click="close" class="mr-2">Cancel</v-btn>
          <v-btn class="bg-gradient-gold text-white px-6" variant="flat" size="large" rounded="lg" @click="save" :loading="saving">Save Employee</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Password Reset Dialog -->
    <v-dialog v-model="resetDialog" max-width="400px">
      <v-card class="rounded-xl">
        <v-toolbar color="orange-darken-2" class="px-4" density="comfortable">
            <v-toolbar-title class="text-body-1 font-weight-bold">Reset Password</v-toolbar-title>
            <v-btn icon="mdi-close" variant="text" @click="resetDialog = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
            <div class="text-caption text-grey mb-4">Resetting password for <b>{{ resetUser.username }}</b></div>
            <v-text-field 
                v-model="newPassword" 
                label="New Password" 
                type="password" 
                variant="outlined" 
                density="comfortable"
                prepend-inner-icon="mdi-lock-reset"
                hide-details
            ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-background">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="resetDialog = false">Cancel</v-btn>
          <v-btn color="orange-darken-2" variant="flat" rounded="lg" @click="handleResetPassword" :loading="resetting">Reset Password</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'
import { useSnackbarStore } from '@/stores/snackbar'

export default {
    name: 'AdminEmployees',
    setup() {
        const snackbarStore = useSnackbarStore()
        return { snackbarStore }
    },
    data() {
        return {
             headers: [
              { title: 'Emp ID', key: 'employee_id' },
              { title: 'Username & Mobile', key: 'username' },
              { title: 'Role', key: 'role.name' },
              { title: 'Status', key: 'is_active' },
              { title: 'Actions', key: 'actions', sortable: false },
            ],
            employees: [],
            loading: false,
            dialog: false,
            search: '',
            saving: false, 
            resetDialog: false,
            resetUser: {},
            newPassword: '',
            resetting: false,
            roles: [
                { id: 1, name: 'admin' }, 
                { id: 2, name: 'manager' }, 
                { id: 3, name: 'inventory' }, 
                { id: 4, name: 'biller' }
            ],
            editedIndex: -1,
            editedItem: {
              id: -1,
              username: '',
              mobile: '',
              employee_id: '',
              role_id: 4,
              password: '',
              is_active: true
            },
            defaultItem: {
              id: -1,
              username: '',
              mobile: '',
              employee_id: '',
              role_id: 4,
              password: '',
              is_active: true
            }
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Employee' : 'Edit Employee'
        }
    },
    mounted() {
        this.fetchEmployees()
    },
    methods: {
        getRoleColor(role) {
            switch(role) {
                case 'admin': return 'red-darken-1'
                case 'manager': return 'blue-darken-1'
                case 'biller': return 'green-darken-1'
                case 'inventory': return 'orange-darken-1'
                default: return 'grey'
            }
        },
        async fetchEmployees() {
          this.loading = true
          try {
            const res = await EventServices.getEmployees()
            this.employees = res.data
          } catch (err) { console.error(err) }
          finally { this.loading = false }
        },
        editItem(item) {
          this.editedIndex = this.employees.indexOf(item)
          this.editedItem = Object.assign({}, item)
          // Ensure password is reset/empty for edit unless needed
          this.editedItem.password = '' 
          this.dialog = true
        },
        close() {
          this.dialog = false
          this.$nextTick(() => {
              this.editedItem = Object.assign({}, this.defaultItem)
              this.editedIndex = -1
          })
        },
        async save() {
          this.saving = true; // Start loading
          if (this.editedIndex > -1) {
            // Update
            try {
                // We don't have direct access to old state here easily without finding it again, 
                // so we might just call updates if fields are present? 
                // Or simplified: update status and role regardless if changed, to be safe 
                // OR compare with this.employees[this.editedIndex]
                const original = this.employees[this.editedIndex]
                
                if (this.editedItem.is_active !== original.is_active) {
                     await EventServices.updateEmployeeStatus(this.editedItem.id, { is_active: this.editedItem.is_active })
                }
                
                // Update basic details (username, mobile, role)
                await EventServices.updateEmployee(this.editedItem.id, {
                    username: this.editedItem.username,
                    mobile: this.editedItem.mobile,
                    role_id: this.editedItem.role_id
                })

                this.snackbarStore.showSnackbar('Employee updated successfully', 'success')
            } catch(e) { console.error(e) }
          } else {
            // Create
            try {
                await EventServices.addEmployee(this.editedItem)
                this.snackbarStore.showSnackbar('Employee added successfully', 'success')
            } catch(e) { console.error(e) }
          }
          this.saving = false; // Stop loading
          this.close()
          this.fetchEmployees()
        },
        openResetDialog(item) {
            this.resetUser = item
            this.newPassword = ''
            this.resetDialog = true
        },
        async handleResetPassword() {
            if (!this.newPassword) return
            this.resetting = true
            try {
                await EventServices.resetEmployeePassword(this.resetUser.id, this.newPassword)
                this.snackbarStore.showSnackbar(`Password reset for ${this.resetUser.username}`, 'success')
                this.resetDialog = false
            } catch (e) {
                console.error(e)
                this.snackbarStore.showSnackbar('Failed to reset password', 'error')
            } finally {
                this.resetting = false
            }
        }
    }
}
</script>

<style scoped>
.hover-bg-grey-lighten-5:hover {
    background-color: rgba(var(--v-theme-primary), 0.05) !important;
}
.border-thin { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
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
