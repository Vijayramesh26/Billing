<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6 d-flex flex-column align-start">
    <div class="d-flex flex-column flex-md-row justify-space-between w-100 align-start align-md-center mb-6">
        <div class="mb-4 mb-md-0">
            <h1 class="text-h4 font-weight-black text-secondary">Sales Reports</h1>
            <div class="text-subtitle-1 text-grey-darken-1">Analyze revenue and transaction history</div>
        </div>
        <div class="d-flex flex-column flex-md-row gap-4 w-100 bg-white pa-4 rounded-xl border-thin mb-8 align-center">
            <v-icon color="secondary" class="d-none d-md-flex">mdi-calendar-range</v-icon>
            <input 
                type="date" 
                v-model="startDate" 
                class="pa-2 rounded-lg flex-grow-1"
                style="outline: none; border: 1px solid rgba(0,0,0,0.1); font-family: inherit;"
            />
            <span class="text-grey d-none d-md-flex">to</span>
            <input 
                type="date" 
                v-model="endDate" 
                class="pa-2 rounded-lg flex-grow-1"
                style="outline: none; border: 1px solid rgba(0,0,0,0.1); font-family: inherit;"
            />
            <v-btn class="bg-gradient-gold text-white w-100 w-md-auto" rounded="lg" elevation-2 @click="fetchReports" :loading="loading" height="44">
                Apply Filter
            </v-btn>
        </div>
    </div>

    <!-- Summary Cards -->
    <v-row class="w-100 mb-6">
        <v-col cols="12" md="4">
            <v-card class="rounded-xl border-thin elevation-0 bg-white pa-4">
                <div class="d-flex align-start">
                    <v-avatar color="amber-lighten-5" class="text-secondary rounded-lg mr-4">
                        <v-icon>mdi-cash-multiple</v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-caption text-grey font-weight-bold text-uppercase">Total Revenue</div>
                        <div class="text-h4 font-weight-black text-secondary mt-1">₹{{ summary.total_revenue.toFixed(2) }}</div>
                    </div>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
            <v-card class="rounded-xl border-thin elevation-0 bg-white pa-4">
                <div class="d-flex align-start">
                    <v-avatar color="success-lighten-5" class="text-success rounded-lg mr-4">
                        <v-icon>mdi-receipt-text</v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-caption text-grey font-weight-bold text-uppercase">Total Transactions</div>
                        <div class="text-h4 font-weight-black text-grey-darken-3 mt-1">{{ summary.total_transactions }}</div>
                    </div>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
            <v-card class="rounded-xl border-thin elevation-0 bg-white pa-4">
                <div class="d-flex align-start">
                    <v-avatar color="info-lighten-5" class="text-info rounded-lg mr-4">
                        <v-icon>mdi-package-variant-closed</v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-caption text-grey font-weight-bold text-uppercase">Products Sold</div>
                        <div class="text-h4 font-weight-black text-grey-darken-3 mt-1">{{ summary.products_sold }}</div>
                    </div>
                </div>
            </v-card>
        </v-col>
    </v-row>

    <v-card class="w-100 rounded-xl elevation-0 border-thin bg-transparent">
      <v-data-table
        :headers="headers"
        :items="transactions"
        :loading="loading"
        class="rounded-xl elevation-1 bg-white"
        show-expand
        hover
      >
        <template v-slot:header="{ props }">
            <tr>
                <th v-for="head in props.headers" :key="head.key" class="text-caption font-weight-bold text-uppercase text-grey-darken-1 bg-grey-lighten-5 py-3 border-b">
                    {{ head.title }}
                </th>
            </tr>
        </template>

        <template v-slot:item="{ item, internalItem, toggleExpand, isExpanded }">
            <tr class="hover-bg-grey-lighten-5 transition-swing cursor-pointer" @click="toggleExpand(internalItem)">
                <td class="py-4">
                     <div class="font-weight-bold text-body-2 text-primary">{{ item.bill_no }}</div>
                </td>
                <td class="py-4">
                     <div class="text-body-2">{{ new Date(item.bill_date).toLocaleString() }}</div>
                </td>
                <td class="py-4">
                     <div class="text-body-2 font-weight-bold text-grey-darken-3">₹{{ item.net_payable.toFixed(2) }}</div>
                </td>
                <td class="py-4">
                    <v-chip size="small" :color="getPaymentColor(item.payment_mode)" variant="tonal" class="font-weight-bold">
                        {{ item.payment_mode }}
                    </v-chip>
                </td>
                <td class="py-4">
                    <div class="text-caption text-grey">{{ item.user ? item.user.username : 'System' }}</div>
                </td>
                <td class="py-4 text-center">
                    <v-icon :class="{'rotate-180': isExpanded(internalItem)}" class="transition-swing">mdi-chevron-down</v-icon>
                </td>
            </tr>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
            <tr class="bg-grey-lighten-5">
                <td :colspan="columns.length" class="pa-4">
                    <div class="text-caption font-weight-bold text-uppercase text-grey mb-2">Order Items</div>
                    <v-table density="compact" class="bg-transparent">
                        <tbody>
                            <tr v-for="sub in item.items" :key="sub.id">
                                <td class="text-body-2">{{ sub.product ? sub.product.name : 'Unknown Product' }}</td>
                                <td class="text-body-2 text-right">{{ sub.quantity }} x ₹{{ sub.unit_price }}</td>
                                <td class="text-body-2 text-right font-weight-bold">₹{{ sub.total }}</td>
                            </tr>
                        </tbody>
                    </v-table>
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
    name: 'ManagerReports',
    data() {
        return {
            headers: [
                { title: 'Bill No', key: 'bill_no' },
                { title: 'Date', key: 'bill_date' },
                { title: 'Amount', key: 'net_payable' },
                { title: 'Mode', key: 'payment_mode' },
                { title: 'Biller', key: 'user.username' },
                { title: '', key: 'data-table-expand', align: 'center' },
            ],
            transactions: [],
            summary: { total_revenue: 0, total_transactions: 0, products_sold: 0 },
            loading: false,
            startDate: new Date().toISOString().substr(0, 10),
            endDate: new Date().toISOString().substr(0, 10)
        }
    },
    mounted() {
        this.fetchReports()
    },
    methods: {
        async fetchReports() {
            this.loading = true
            try {
                // Using 'sales' type and params
                const res = await EventServices.getReports('sales', {
                    start_date: this.startDate,
                    end_date: this.endDate
                })
                this.transactions = res.data.transactions || []
                this.summary = res.data.summary
            } catch(e) { console.error(e) }
            finally { this.loading = false }
        },
        getPaymentColor(mode) {
            if (mode === 'CASH') return 'green'
            if (mode === 'UPI') return 'purple'
            if (mode === 'ONLINE') return 'blue'
            return 'grey'
        }
    }
}
</script>

<style scoped>
.border-thin { border: 1px solid rgba(0,0,0,0.08); }
.rotate-180 { transform: rotate(180deg); }
.gap-2 { gap: 8px; }
.bg-gradient-gold {
    background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%) !important;
}
</style>
