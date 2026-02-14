<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6 d-flex flex-column align-start">
    <div class="d-flex flex-column flex-md-row justify-space-between w-100 align-start align-md-center mb-6">
        <div class="mb-4 mb-md-0">
            <h1 class="text-h4 font-weight-black text-secondary">Customer Management</h1>
            <div class="text-subtitle-1 text-grey-darken-1">Manage customer profiles and special discounts</div>
        </div>
        <v-btn prepend-icon="mdi-account-plus" class="bg-gradient-gold text-white align-self-stretch align-self-sm-auto" rounded="lg" size="large" elevation="2">New Customer</v-btn>
    </div>

    <!-- Top Buys Cards -->
    <v-row class="w-100 mb-6" v-if="topCustomers.length > 0">
        <v-col cols="12" md="4" v-for="(customer, index) in topCustomers" :key="customer.id">
            <v-card class="rounded-xl border-thin elevation-2 bg-white pa-4 relative overflow-hidden">
                <div class="absolute-rank text-h1 font-weight-black text-grey-lighten-4">{{ index + 1 }}</div>
                <div class="d-flex align-center relative z-1">
                    <v-avatar :color="getRankColor(index)" size="56" class="mr-4 elevation-2 font-weight-bold text-white text-h5">
                        {{ index + 1 }}
                    </v-avatar>
                    <div>
                        <div class="text-body-1 font-weight-bold text-grey-darken-3">{{ customer.name }}</div>
                        <div class="text-caption text-grey font-weight-bold text-uppercase">Total Spend</div>
                        <div class="text-h6 font-weight-black text-secondary">₹{{ customer.total_spend.toLocaleString() }}</div>
                    </div>
                </div>
            </v-card>
        </v-col>
    </v-row>

    <v-card class="w-100 rounded-xl elevation-0 border-thin bg-transparent">
      <!-- Search Toolbar -->
      <div class="px-4 py-3 d-flex align-center bg-white border-b rounded-t-xl w-100">
          <v-icon color="grey-lighten-1" class="mr-3">mdi-magnify</v-icon>
          <v-text-field
              v-model="search"
              placeholder="Search by Name or Mobile..."
              variant="plain"
              hide-details
              density="compact"
              class="text-body-1 w-100"
          ></v-text-field>
          <v-chip color="secondary" variant="tonal" class="font-weight-bold ml-4" size="small">Total: {{ customers.length }}</v-chip>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="customers"
        :search="search"
        :custom-filter="filterCustomers"
        class="rounded-b-xl elevation-1 bg-white"
        hover
      >
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
                        <div v-if="item.rank <= 3" class="mr-3">
                             <v-icon :color="getRankIconColor(item.rank - 1)">mdi-trophy</v-icon>
                        </div>
                        <div v-else class="mr-3 text-caption font-weight-bold text-grey" style="width: 24px; text-align: center;">{{ item.rank }}</div>
                        
                        <v-avatar color="primary-lighten-5" class="mr-3 text-primary font-weight-bold" rounded="lg" size="small">
                            {{ item.name.charAt(0) }}
                        </v-avatar>
                        <div>
                            <div class="font-weight-bold text-body-2 text-grey-darken-3">{{ item.name }}</div>
                            <div class="text-caption text-grey">{{ item.mobile }}</div>
                        </div>
                    </div>
                </td>
                <td class="py-4">
                     <div class="text-body-2 text-grey-darken-2" style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        {{ item.address || '-' }}
                     </div>
                </td>
                 <td class="py-4 text-center">
                    <div class="font-weight-bold text-grey-darken-3">₹{{ item.total_spend?.toLocaleString() || '0' }}</div>
                </td>
                <td class="py-4 text-center">
                    <v-chip
                        :color="item.discount_percent > 0 ? 'success' : 'grey'"
                        variant="tonal"
                        size="small"
                        class="font-weight-bold px-3"
                    >
                        <v-icon start size="small" class="mr-1">mdi-brightness-percent</v-icon>
                        {{ item.discount_percent }}% Extra
                    </v-chip>
                </td>
                <td class="py-4 text-right">
                    <v-btn 
                        variant="text" 
                        color="primary" 
                        size="small" 
                        rounded="lg" 
                        prepend-icon="mdi-pencil"
                        @click="editDiscount(item)"
                    >
                        Edit Discount
                    </v-btn>
                </td>
            </tr>
        </template>
        

      </v-data-table>
    </v-card>

    <!-- Edit Discount Dialog -->
    <v-dialog v-model="dialog" max-width="400">
        <v-card class="rounded-xl elevation-10">
            <div class="bg-primary px-6 py-4 d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-sale</v-icon>
                <span class="text-h6 font-weight-bold text-white">Update Discount</span>
            </div>
            <v-card-text class="pa-6">
                <div class="d-flex align-center mb-4 bg-blue-lighten-5 pa-3 rounded-lg">
                    <v-avatar color="white" class="mr-3 text-primary font-weight-bold" size="small"> {{ selectedCustomer?.name.charAt(0) }}</v-avatar>
                     <div>
                        <div class="font-weight-bold text-body-2 text-grey-darken-3">{{ selectedCustomer?.name }}</div>
                        <div class="text-caption text-primary">{{ selectedCustomer?.mobile }}</div>
                    </div>
                </div>
                
                <label class="text-caption font-weight-bold text-uppercase text-grey mb-2 d-block">Extra Discount %</label>
                <v-text-field
                    v-model.number="newDiscount"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    suffix="%"
                    class="font-weight-black text-h5 centered-input"
                    bg-color="grey-lighten-5"
                    items-center
                    rounded="lg"
                    autofocus
                ></v-text-field>
                <div class="text-caption text-grey mt-2">
                    <v-icon size="small" class="mr-1">mdi-information-outline</v-icon>
                    This will be applied <b>in addition</b> to the global discount.
                </div>
            </v-card-text>
            <v-card-actions class="pa-4 bg-grey-lighten-5">
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="dialog = false" color="grey-darken-1">Cancel</v-btn>
                <v-btn color="primary" variant="flat" rounded="lg" @click="saveDiscount" :loading="saving">Save Changes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    
    <v-snackbar v-model="snackbar" color="success" location="top" rounded="pill">
        <v-icon start>mdi-check-circle</v-icon> Discount Updated
    </v-snackbar>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'

export default {
  name: 'ManagerCustomers',
  data() {
    return {
      search: '',
      headers: [
        { title: 'Customer', key: 'name' },
        { title: 'Address', key: 'address' },
        { title: 'Total Spend', key: 'total_spend', align: 'center' },
        { title: 'Extra Discount', key: 'discount_percent', align: 'center' },
        { title: 'Actions', key: 'actions', align: 'end', sortable: false },
      ],
      customers: [],
      loading: false,
      dialog: false,
      selectedCustomer: null,
      newDiscount: 0,
      saving: false,
      snackbar: false
    }
  },
  computed: {
    topCustomers() {
      return this.customers.slice(0, 3)
    }
  },
  mounted() {
    this.fetchCustomers()
  },
  methods: {
    async fetchCustomers() {
      try {
        const res = await EventServices.getCustomers()
        this.customers = res.data
      } catch (e) { console.error(e) }
    },
    filterCustomers(value, query, item) {
        if (!query) return true
        const q = query.toLowerCase()
        const name = item.raw.name ? item.raw.name.toLowerCase() : ''
        const mobile = item.raw.mobile ? item.raw.mobile.toString() : ''
        return name.includes(q) || mobile.includes(q)
    },
    getRankColor(index) {
        if (index === 0) return 'secondary' // Gold
        if (index === 1) return 'blue-grey-lighten-1' // Silver
        if (index === 2) return 'brown-lighten-1' // Bronze
        return 'grey'
    },
    getRankIconColor(index) {
        if (index === 0) return 'amber' 
        if (index === 1) return 'blue-grey' 
        if (index === 2) return 'brown' 
        return 'grey'
    },
    openDiscountDialog(item) {
        this.selectedCustomer = item
        this.newDiscount = item.discount_percent
        this.dialog = true
    },
    // Also kept previous name for compatibility if template uses it
    editDiscount(item) {
        this.openDiscountDialog(item)
    },
    async saveDiscount() {
        this.saving = true
        try {
            await EventServices.updateCustomerDiscount(this.selectedCustomer.id, {
                discount_percent: this.newDiscount
            })
            // Update local state directly to reflect change
            const customer = this.customers.find(c => c.id === this.selectedCustomer.id)
            if (customer) {
                customer.discount_percent = this.newDiscount
            }
            
            this.dialog = false
            this.snackbar = true
        } catch(e) {
            console.error(e)
        } finally {
            this.saving = false
        }
    }
  }
}
</script>

<style scoped>
.centered-input :deep(input) {
    text-align: center;
}
.border-thin { border: 1px solid rgba(0,0,0,0.08); }
.absolute-rank {
    position: absolute;
    right: -10px;
    bottom: -20px;
    font-size: 8rem !important;
    opacity: 0.2;
    z-index: 0;
    line-height: 1;
}
.relative { position: relative; }
.z-1 { z-index: 1; }
.bg-gradient-gold {
    background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%) !important;
}
</style>
