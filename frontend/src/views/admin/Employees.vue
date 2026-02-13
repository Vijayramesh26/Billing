<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6 d-flex flex-column align-start">
    <div class="d-flex justify-space-between w-100 align-center mb-6">
        <div>
            <h1 class="text-h4 font-weight-black text-grey-darken-3">Team</h1>
            <div class="text-subtitle-1 text-grey-darken-1">Manage employees and their access roles</div>
        </div>
        <v-btn 
            color="primary" 
            prepend-icon="mdi-account-plus" 
            size="large" 
            class="text-capitalize rounded-lg elevation-4"
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
        class="rounded-xl elevation-1 bg-white flex-grow-1"
        hover
      >
        <template v-slot:top>
            <div class="px-4 py-3 d-flex align-center bg-white border-b">
                <v-icon color="grey-lighten-1" class="mr-3">mdi-magnify</v-icon>
                <input 
                    v-model="search"
                    placeholder="Search employees..."
                    class="flex-grow-1 text-body-1"
                    style="outline: none;"
                />
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
                            {{ item.employee_id }}
                        </v-avatar>
                        <span class="font-weight-bold text-body-2">{{ item.employee_id }}</span>
                    </div>
                </td>
                <td class="py-4">
                    <div class="font-weight-bold text-grey-darken-3">{{ item.username }}</div>
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
              <v-col cols="12">
                  <v-text-field 
                    v-model="editedItem.username" 
                    label="Username" 
                    variant="outlined" 
                    density="comfortable" 
                    prepend-inner-icon="mdi-account"
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
        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" size="large" @click="close" class="mr-2">Cancel</v-btn>
          <v-btn color="primary" variant="flat" size="large" rounded="lg" class="px-6" @click="save">Save Employee</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
    name: 'AdminEmployees',
    data() {
        return {
             headers: [
              { title: 'Emp ID', key: 'employee_id' },
              { title: 'Username', key: 'username' },
              { title: 'Role', key: 'role.name' },
              { title: 'Status', key: 'is_active' },
              { title: 'Actions', key: 'actions', sortable: false },
            ],
            employees: [],
            loading: false,
            dialog: false,
            search: '',
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
              employee_id: '',
              role_id: 4,
              password: '',
              is_active: true
            },
            defaultItem: {
              id: -1,
              username: '',
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
                if (this.editedItem.role_id !== original.role.id) { // Note: original has role object, edited has role_id
                     await EventServices.updateEmployeeRole(this.editedItem.id, { role_id: this.editedItem.role_id })
                }
            } catch(e) { console.error(e) }
          } else {
            // Create
            try {
                await EventServices.addEmployee(this.editedItem)
            } catch(e) { console.error(e) }
          }
          this.close()
          this.fetchEmployees()
        }
    }
}
</script>
