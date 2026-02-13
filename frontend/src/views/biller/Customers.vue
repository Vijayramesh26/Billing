<template>
  <v-container fluid>
    <v-row justify="space-between" class="mb-2">
      <v-col><h2 class="text-h5">Customer Management</h2></v-col>
      <v-col class="text-right"><v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">Add Customer</v-btn></v-col>
    </v-row>

    <v-card class="rounded-lg elevation-2">
      <v-data-table 
        :headers="headers" 
        :items="customers" 
        :loading="loading" 
        search 
        hover
        class="elevation-0"
      >
        <template v-slot:item.name="{ item }">
            <span class="font-weight-medium text-primary">{{ item.name }}</span>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Add New Customer</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12"><v-text-field v-model="newItem.name" label="Customer Name"></v-text-field></v-col>
              <v-col cols="12"><v-text-field v-model="newItem.mobile" label="Phone Number"></v-text-field></v-col>
              <v-col cols="12"><v-textarea v-model="newItem.address" label="Address" rows="2"></v-textarea></v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
    name: 'BillerCustomers',
    data() {
        return {
             headers: [
              { title: 'Name', key: 'name' },
              { title: 'Mobile', key: 'mobile' },
              { title: 'Address', key: 'address' },
              { title: 'Points', key: 'loyalty_points' }, // Assuming we might have this
            ],
            customers: [],
            loading: false,
            dialog: false,
            newItem: { name: '', mobile: '', address: '' }
        }
    },
    mounted() {
        this.fetchCustomers()
    },
    methods: {
        async fetchCustomers() {
            this.loading = true
            try {
                const res = await EventServices.getBillerCustomers()
                this.customers = res.data
            } catch (err) { console.error(err) }
            finally { this.loading = false }
        },
        async save() {
            try {
                await EventServices.createCustomer(this.newItem)
                this.fetchCustomers()
                this.dialog = false
                this.newItem = { name: '', mobile: '', address: '' }
            } catch(e) { console.error(e) }
        }
    }
}
</script>
