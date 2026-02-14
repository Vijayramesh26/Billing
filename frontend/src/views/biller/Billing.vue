<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6">
    <!-- History Drawer -->
    <v-navigation-drawer
      v-model="historyDrawer"
      location="right"
      temporary
      width="450"
      class="elevation-10"
    >
      <v-toolbar color="surface" density="prominent" class="border-b pl-2">
         <v-toolbar-title class="text-h5 font-weight-bold gradient-text">Transaction History</v-toolbar-title>
         <v-spacer></v-spacer>
         <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="historyDrawer = false"></v-btn>
      </v-toolbar>
      
      <v-list lines="two" class="pa-2">
        <v-list-item
            v-for="(bill, index) in historyBills"
            :key="bill.ID"
            :value="bill"
            @click="viewOldBill(bill)"
            class="mb-2 rounded-lg border hover-card bg-surface"
            elevation="0"
        >
            <template v-slot:prepend>
                <v-avatar color="primary-lighten-5" class="text-primary font-weight-bold" rounded="lg">
                    {{ bill.bill_no.split('-').pop() }}
                </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold text-body-1">₹{{ bill.net_payable.toFixed(2) }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption mt-1">
                <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                {{ new Date(bill.bill_date).toLocaleString() }}
                <span class="mx-1">•</span>
                <span class="text-uppercase font-weight-medium">{{ bill.payment_mode }}</span>
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-btn icon="mdi-chevron-right" variant="text" color="grey-lighten-1" size="small"></v-btn>
            </template>
        </v-list-item>

        <div v-if="historyBills.length < totalBills" class="pa-2 text-center">
            <v-btn 
                variant="text" 
                color="primary" 
                :loading="loadingHistory"
                @click="loadMoreHistory"
            >
                Load More
            </v-btn>
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between mb-8 w-100">
       <div class="d-flex align-center mb-4 mb-md-0">
         <v-avatar color="secondary" class="mr-4 elevation-2">
             <v-icon color="white">mdi-storefront-outline</v-icon>
         </v-avatar>
         <div>
            <h1 class="text-h5 text-md-h4 font-weight-black text-grey-darken-3 gradient-text" style="letter-spacing: -1px;">POS Terminal</h1>
            <div class="text-subtitle-2 text-grey-darken-1">Manage sales and billing efficiently</div>
         </div>
       </div>
       <div class="d-flex align-center gap-4 w-100 w-md-auto justify-end">
           <v-card class="d-none d-sm-flex align-center px-4 py-2 rounded-pill modern-card mr-4 bg-white">
              <span class="text-caption text-uppercase font-weight-bold text-grey mr-2">Session</span>
              <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ new Date().toLocaleDateString() }}</span>
           </v-card>
           
           <v-chip color="secondary" class="bg-amber-lighten-5 font-weight-bold px-6 py-4 flex-grow-1 flex-md-grow-0 justify-center" size="large" rounded="pill">
              <v-icon start size="small" class="mr-2">mdi-receipt-text-outline</v-icon>
              {{ nextBillNo }}
           </v-chip>
           
           <v-btn 
             icon="mdi-clipboard-list-outline" 
             variant="text" 
             color="grey-darken-1" 
             size="large"
             class="ml-2 hover-card"
             @click="fetchPendingOrders"
             title="Pending Orders"
           >
              <v-badge dot color="error" v-if="pendingOrders.length > 0">
                <v-icon>mdi-clipboard-list-outline</v-icon>
              </v-badge>
              <v-icon v-else>mdi-clipboard-list-outline</v-icon>
           </v-btn>
           
           <v-btn 
             icon="mdi-history" 
             variant="text" 
             color="grey-darken-1" 
             size="large"
             class="ml-2 hover-card"
             @click="fetchHistory"
             title="Transaction History"
           ></v-btn>
       </div>
    </div>
    
    <!-- Pending Orders Drawer -->
    <v-navigation-drawer
      v-model="pendingOrdersDrawer"
      location="right"
      temporary
      width="450"
      class="elevation-10"
    >
      <v-toolbar color="surface" density="prominent" class="border-b pl-2">
         <v-toolbar-title class="text-h5 font-weight-bold text-orange-darken-2">Pending Orders</v-toolbar-title>
         <v-spacer></v-spacer>
         <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="pendingOrdersDrawer = false"></v-btn>
      </v-toolbar>
      
      <div v-if="loadingPending" class="d-flex justify-center align-center pa-8">
          <v-progress-circular indeterminate color="orange"></v-progress-circular>
      </div>
      
      <div v-else-if="pendingOrders.length === 0" class="d-flex flex-column align-center justify-center fill-height pa-8 text-grey-lighten-1">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-clipboard-check-outline</v-icon>
          <div class="text-h6">No pending orders</div>
      </div>
      
      <v-list v-else lines="two" class="pa-2">
        <v-list-item
            v-for="(order, index) in pendingOrders"
            :key="order.id"
            class="mb-2 rounded-lg border hover-card bg-surface"
            elevation="0"
        >
            <template v-slot:prepend>
                <v-avatar color="orange-lighten-5" class="text-orange-darken-2 font-weight-bold" rounded="lg">
                    {{ order.items ? order.items.length : 0 }}
                </v-avatar>
            </template>
            
            <v-list-item-title class="font-weight-bold text-body-1">
                {{ order.customer_name || (order.customer ? order.customer.name : 'Unknown') }}
            </v-list-item-title>
            
            <v-list-item-subtitle class="text-caption mt-1">
                <div class="d-flex align-center">
                    <span class="font-weight-bold text-grey-darken-3 mr-2">₹{{ order.total_estimated ? order.total_estimated.toFixed(2) : '0.00' }}</span>
                    <span class="text-grey">• {{ new Date(order.order_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                </div>
                <div class="text-truncate text-grey-lighten-1" style="max-width: 200px;">
                    {{ order.items.map(i => i.product ? i.product.name : i.name).join(', ') }}
                </div>
            </v-list-item-subtitle>
            
            <template v-slot:append>
                <v-btn 
                    color="orange" 
                    variant="tonal" 
                    size="small" 
                    rounded="pill" 
                    class="font-weight-bold"
                    @click="loadOrderToPOS(order)"
                >
                    Load
                    <v-icon end size="small">mdi-arrow-left</v-icon>
                </v-btn>
            </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-row class="fill-height">
      <!-- Left Panel: Add Items -->
      <v-col cols="12" md="4" class="d-flex flex-column">
        <v-card class="modern-card flex-grow-1 d-flex flex-column overflow-visible bg-white">
            <div class="pa-6 pb-2">
                <div class="d-flex align-center mb-6">
                    <div class="text-h6 font-weight-bold text-grey-darken-3">Details</div>
                    <v-spacer></v-spacer>
                        <v-btn 
                            variant="tonal" 
                            color="secondary" 
                            size="small" 
                            rounded="pill" 
                            prepend-icon="mdi-account-plus"
                            @click="showAddCustomer=true"
                        >New Customer</v-btn>
                </div>

               <!-- Customer Selection -->
               <v-autocomplete
                   v-model="selectedCustomer"
                   :items="customers"
                   :item-title="item => item.name + ' (' + item.mobile + ')'"
                   placeholder="Search Customer (Name or Mobile)"
                   return-object
                   variant="outlined"
                   density="comfortable"
                   prepend-inner-icon="mdi-account-search-outline"
                   @update:search="searchCustomers"
                   rounded="lg"
                   class="mb-2"
                   bg-color="grey-lighten-5"
                   hide-details="auto"
               >
                   <template v-slot:selection="{ item }">
                       <span class="font-weight-medium">{{ item.raw.name }} ({{ item.raw.mobile }})</span>
                   </template>
                   <template v-slot:item="{ props, item }">
                       <v-list-item v-bind="props" :title="item.raw.name" :subtitle="item.raw.mobile">
                           <template v-slot:prepend><v-icon color="secondary">mdi-account</v-icon></template>
                       </v-list-item>
                   </template>
                   <template v-slot:no-data>
                     <v-list-item>
                       <v-list-item-title class="text-grey">No customer found</v-list-item-title>
                     </v-list-item>
                   </template>
               </v-autocomplete>
            </div>
            
            <v-divider class="mx-6 border-dashed"></v-divider>

            <div class="pa-6 pt-4 flex-grow-1">
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-3">Add Products</div>
               <!-- Product Selection -->
               <v-autocomplete
                 v-model="selectedProduct"
                 :items="products"
                 :item-title="item => item.brand ? `${item.name} (${item.brand.name})` : item.name"
                 item-value="id"
                 placeholder="Scan barcode or search product..."
                 variant="outlined"
                 density="comfortable"
                 prepend-inner-icon="mdi-barcode-scan"
                 return-object
                 auto-select-first
                 class="mb-6"
                 rounded="lg"
                 bg-color="grey-lighten-5"
                 menu-icon="mdi-chevron-down"
               >
                 <template v-slot:item="{ props, item }">
                   <v-list-item v-bind="props" :title="item.raw.name" :subtitle="item.raw.brand ? item.raw.brand.name : ''" class="py-3 border-b">
                     <template v-slot:append>
                         <div class="d-flex flex-column align-end">
                             <span class="font-weight-bold text-body-2">₹{{ item.raw.unit_price }}</span>
                             <v-chip size="x-small" :color="item.raw.current_stock < 10 ? 'red-lighten-4' : 'green-lighten-4'" class="mt-1 font-weight-bold" :class="item.raw.current_stock < 10 ? 'text-red' : 'text-green-darken-2'">
                                 {{ item.raw.current_stock }} in stock
                             </v-chip>
                         </div>
                     </template>
                   </v-list-item>
                 </template>
               </v-autocomplete>
              
              <v-expand-transition>
                  <div v-if="selectedProduct" class="bg-blue-lighten-5 pa-4 rounded-xl mb-6">
                      <div class="d-flex justify-space-between align-center mb-3">
                        <span class="text-subtitle-2 text-grey-darken-2">Item Price</span>
                         <span class="text-h6 font-weight-bold text-secondary">₹{{ selectedProduct.unit_price }}</span>
                      </div>
                      
                      <div class="d-flex align-center">
                          <v-btn icon="mdi-minus" size="small" variant="text" color="secondary" @click="qty > 1 ? qty-- : null" class="bg-white rounded-lg"></v-btn>
                         <v-text-field
                            v-model.number="qty"
                            type="number"
                            variant="plain"
                            density="compact"
                            hide-details
                            class="text-center mx-2 font-weight-bold text-h6"
                            style="max-width: 60px"
                         ></v-text-field>
                          <v-btn icon="mdi-plus" size="small" variant="text" color="secondary" @click="qty++" class="bg-white rounded-lg"></v-btn>
                      </div>
                      
                      <div class="d-flex justify-space-between align-center mt-4 pt-3 border-t border-dashed border-opacity-50">
                        <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">Subtotal</span>
                        <span class="text-h5 font-weight-black gradient-text">₹{{ (selectedProduct.unit_price * (qty || 0)).toFixed(2) }}</span>
                      </div>
                  </div>
              </v-expand-transition>

              <v-btn 
                block 
                class="bg-gradient-gold text-white text-capitalize"
                size="x-large"
                rounded="xl"
                @click="addToCart" 
                :disabled="!selectedProduct || qty <= 0"
                height="56"
              >
                <v-icon start class="mr-2">mdi-cart-plus</v-icon>
                Add to Cart
              </v-btn>
            </div>
        </v-card>
      </v-col>

      <!-- Right Panel: Bill Preview -->
      <v-col cols="12" md="8" class="d-flex flex-column h-100">
        <v-card class="modern-card flex-grow-1 d-flex flex-column bg-white h-100" style="max-height: calc(100vh - 120px);">
          <div class="d-flex justify-space-between align-center px-6 py-4 border-b">
            <div class="d-flex align-center">
               <v-icon color="grey-darken-1" class="mr-2">mdi-shopping-outline</v-icon>
               <span class="text-h6 font-weight-bold text-grey-darken-3">Current Cart</span>
                <v-chip class="ml-3 font-weight-bold bg-amber-lighten-5 text-secondary" size="small" rounded="pill">{{ cart.length }} items</v-chip>
            </div>
            <v-btn width="40" height="40" icon variant="tonal" color="error" class="rounded-lg" @click="cart = []" :disabled="cart.length === 0" title="Clear Cart">
               <v-icon>mdi-delete-sweep-outline</v-icon>
            </v-btn>
          </div>

          <div class="flex-grow-1 position-relative overflow-y-auto" style="min-height: 200px;">
             <!-- Empty State -->
             <div v-if="cart.length === 0" class="d-flex flex-column align-center justify-center fill-height text-grey-lighten-1">
                <div class="bg-grey-lighten-5 pa-6 rounded-circle mb-4">
                    <v-icon size="64" color="grey-lighten-2">mdi-cart-variant</v-icon>
                </div>
                <div class="text-h6 font-weight-medium text-grey">Your cart is empty</div>
                <div class="text-body-2 text-grey-lighten-1 mt-1">Select items to begin transaction</div>
             </div>

             <!-- Cart List -->
             <v-table v-else fixed-header hover density="comfortable">
                 <thead>
                    <tr>
                       <th class="text-left text-uppercase text-caption font-weight-bold text-grey pl-6">Product</th>
                       <th class="text-center text-uppercase text-caption font-weight-bold text-grey">Qty</th>
                       <th class="text-right text-uppercase text-caption font-weight-bold text-grey">Price</th>
                       <th class="text-right text-uppercase text-caption font-weight-bold text-grey">Total</th>
                       <th class="text-center text-uppercase text-caption font-weight-bold text-grey pr-6"></th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr v-for="item in cart" :key="item.product_id" class="transition-swing">
                       <td class="pl-6 py-3">
                          <div class="font-weight-bold text-body-2">{{ item.name }}</div>
                          <div class="text-caption text-grey">{{ item.brand_name || 'Generic' }}</div>
                       </td>
                       <td class="text-center">
                          <div class="d-inline-flex align-center bg-grey-lighten-4 rounded-pill px-1">
                              <v-btn icon="mdi-minus" size="x-small" variant="text" density="comfortable" color="grey-darken-2" @click="decreaseQty(item)"></v-btn>
                              <span class="mx-2 font-weight-bold text-body-2" style="min-width: 20px">{{ item.quantity }}</span>
                               <v-btn icon="mdi-plus" size="x-small" variant="text" density="comfortable" color="secondary" @click="increaseQty(item)"></v-btn>
                          </div>
                       </td>
                       <td class="text-right text-body-2">₹{{ item.unit_price }}</td>
                       <td class="text-right font-weight-bold text-body-2">₹{{ item.total }}</td>
                       <td class="text-center pr-6">
                          <v-btn icon="mdi-close" size="small" variant="text" color="grey-lighten-1" class="hover-red" @click="removeFromCart(item)"></v-btn>
                       </td>
                    </tr>
                 </tbody>
             </v-table>
             <div v-if="mobile" style="height: 200px"></div>
          </div>
          
          <!-- Modern Footer -->
          <div class="pa-6 bg-grey-lighten-5 rounded-b-xl border-t">
            <v-row align="center">
               <v-col cols="12" md="5">
                  <div class="text-caption font-weight-bold text-uppercase text-grey mb-2">Payment Method</div>
                  <v-item-group v-model="paymentMode" mandatory class="d-flex gap-2">
                       <v-item v-for="mode in ['CASH', 'ONLINE', 'UPI']" :key="mode" :value="mode" v-slot="{ isSelected, toggle }">
                           <v-card
                               :color="isSelected ? 'secondary' : 'white'"
                               :variant="isSelected ? 'flat' : 'outlined'"
                               class="d-flex align-center justify-center px-4 py-2 rounded-lg cursor-pointer mr-2 transition-swing"
                               @click="toggle"
                               :elevation="isSelected ? 2 : 0"
                               border
                           >
                               <span class="text-caption font-weight-bold" :class="isSelected ? 'text-white' : 'text-grey-darken-2'">{{ mode }}</span>
                           </v-card>
                       </v-item>
                  </v-item-group>
               </v-col>
               <v-col cols="12" md="7">
                  <v-card class="pa-4 bg-white rounded-xl border elevation-0">
                      <div class="d-flex justify-space-between mb-2">
                         <span class="text-body-2 text-grey-darken-1">Subtotal</span>
                         <span class="font-weight-bold">₹{{ subTotal.toFixed(2) }}</span>
                      </div>
                      
                      <div class="d-flex justify-space-between mb-2 text-grey-darken-1">
                         <span class="text-caption">GST (18%)</span>
                         <span>₹{{ (subTotal * 0.18).toFixed(2) }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-3 text-caption text-success" v-if="totalDiscountPercent > 0">
                         <div class="d-flex flex-column">
                             <span>Total Discount ({{ totalDiscountPercent }}%)</span>
                             <span class="text-xs text-grey-lighten-1">
                                Base: {{ activeRule ? activeRule.percentage + '% (Tiered)' : globalDiscount + '% (Global)' }}
                                <span v-if="selectedCustomer && selectedCustomer.discount_percent > 0"> + Customer: {{ selectedCustomer.discount_percent }}%</span>
                             </span>
                         </div>
                         <span>- ₹{{ discountAmount.toFixed(2) }}</span>
                      </div>
                      <v-divider class="mb-3 border-dashed"></v-divider>
                      <div class="d-flex justify-space-between align-center">
                         <span class="text-h6 font-weight-bold text-grey-darken-3">Net Payable</span>
                         <span class="text-h4 font-weight-black gradient-text">₹{{ netPayable.toFixed(2) }}</span>
                      </div>
                  </v-card>
               </v-col>
            </v-row>
            
            <v-btn 
               block 
               class="bg-gradient-gold text-white mt-6 text-capitalize"
               size="x-large"
               rounded="xl"
               elevation="4"
               height="64"
               @click="previewBill" 
               :disabled="cart.length === 0"
            >
               <div class="d-flex align-center">
                   <span class="text-h6 font-weight-bold mr-2">Complete Transaction</span>
                   <v-icon>mdi-arrow-right</v-icon>
               </div>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Refined Invoice Preview -->
    <v-dialog v-model="previewDialog" max-width="400" scrollable transition="dialog-bottom-transition">
        <v-card class="rounded-xl overflow-hidden">
            <div class="bg-gradient-gold px-6 py-4 d-flex justify-space-between align-center">
                <span class="text-h6 font-weight-bold text-white">Invoice Preview</span>
                <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="previewDialog = false" class="text-white"></v-btn>
            </div>
            <v-card-text class="pa-0 bg-white" id="invoice-section">
                <div class="pa-8">
                    <div class="text-center mb-6">
                        <div class="d-inline-flex align-center justify-center bg-gradient-gold rounded-circle mb-3" style="width:48px; height:48px">
                            <v-icon color="white">mdi-store</v-icon>
                        </div>
                        <h2 class="text-h6 font-weight-black text-uppercase letter-spacing-1">{{ companyName }}</h2>
                        <div class="text-caption text-grey-darken-1">{{ companyAddress }}</div>
                        <div class="text-caption text-grey-darken-1">Phone: {{ companyPhone }}</div>
                    </div>
                    
                    <div class="d-flex justify-space-between text-caption mb-4 pa-3 bg-grey-lighten-4 rounded-lg">
                        <div>
                            <div class="text-grey">Bill No</div>
                            <div class="font-weight-bold text-body-2">{{ displayBill.billNo }}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-grey">Date</div>
                            <div class="font-weight-bold text-body-2">{{ new Date().toLocaleDateString() }}</div>
                        </div>
                    </div>
                    
                    <div class="text-caption mb-4" v-if="selectedCustomer">
                        <span class="text-grey">Customer:</span> <span class="font-weight-bold">{{ selectedCustomer.name }}</span>
                    </div>
                    
                    <v-divider class="border-dashed mb-4"></v-divider>
                    
                    <div v-for="item in displayBill.items" :key="item.product_id" class="mb-3">
                        <div class="d-flex justify-space-between text-body-2 font-weight-bold">
                            <span>{{ item.name }}</span>
                            <span>₹{{ item.total }}</span>
                        </div>
                        <div class="d-flex justify-space-between text-caption text-grey">
                            <span>{{ item.quantity }} x {{ item.unit_price }}</span>
                        </div>
                    </div>
                    
                    <v-divider class="border-dashed my-4"></v-divider>
                    
                    <div class="d-flex justify-space-between text-h6 font-weight-black mt-2">
                        <span>Total</span>
                        <span>₹{{ displayBill.netPayable }}</span>
                    </div>
                    <div class="text-center mt-8 text-caption text-grey-lighten-1">
                        THANK YOU FOR YOUR VISIT
                    </div>
                     <div class="text-center mt-1 text-caption text-grey-lighten-2">
                        System Generated Invoice
                    </div>
                </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="pa-4 bg-grey-lighten-5 d-flex">
                <v-btn variant="text" @click="previewDialog=false">Close</v-btn>
                <v-spacer></v-spacer>
                 <v-btn 
                   color="success" 
                   variant="tonal" 
                   prepend-icon="mdi-whatsapp" 
                   class="mr-2"
                   @click="shareOnWhatsApp"
                   v-if="selectedCustomer || isViewOnly"
               >
                   Share
               </v-btn>
                <v-btn class="bg-gradient-gold text-white" size="large" rounded="lg" prepend-icon="mdi-printer" @click="isViewOnly ? printBill() : confirmAndPrint()" :loading="saving" elevation="3">
                    {{ isViewOnly ? 'Print' : 'Confirm & Print' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Add Customer Dialog -->
    <v-dialog v-model="showAddCustomer" max-width="450" transition="dialog-bottom-transition">
      <v-card class="rounded-xl">
        <v-card-title class="pa-4 pl-6 text-h6 font-weight-bold border-b">
            Add New Customer
        </v-card-title>
        <v-card-text class="pa-6">
          <v-text-field label="Full Name" v-model="newCustomer.name" variant="outlined" density="comfortable" class="mb-2" prepend-inner-icon="mdi-account"></v-text-field>
          <v-text-field label="Mobile Number" v-model="newCustomer.mobile" variant="outlined" density="comfortable" class="mb-2" prepend-inner-icon="mdi-phone"></v-text-field>
          <v-textarea label="Address" v-model="newCustomer.address" variant="outlined" density="comfortable" rows="3" prepend-inner-icon="mdi-map-marker"></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4 pr-6 border-t bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" @click="showAddCustomer=false" class="mr-2">Cancel</v-btn>
          <v-btn color="secondary" variant="flat" rounded="lg" @click="createCustomer" class="px-6">Save Customer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-snackbar v-model="snackbar" :color="snackbarColor" location="top" rounded="pill" elevation="4">
        <v-icon start icon="mdi-check-circle" v-if="snackbarColor==='success'"></v-icon>
        <v-icon start icon="mdi-alert-circle" v-if="snackbarColor==='error'"></v-icon>
        {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import EventServices from '../../services/EventServices'
import { useDisplay } from 'vuetify'

export default {
  name: 'BillerPOS',
  setup() {
    const { mobile } = useDisplay()
    return { mobile }
  },
  data() {
    return {
      products: [],
      cart: [],
      historyBills: [],
      customers: [],
      selectedProduct: null,
      selectedCustomer: null,
      qty: 1,
      paymentMode: 'CASH',
      nextBillNo: 'Calculating...',
      historyDrawer: false,
      previewDialog: false,
      valid: false,
      saving: false,
      isViewOnly: false,
      companyName: 'Namma Pharmacy',
      companyAddress: '123, Health Street, Care City',
      companyPhone: '+91 98765 43210',
      globalDiscount: 0,
      showAddCustomer: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      newCustomer: {
        name: '',
        mobile: '',
        address: ''
      },
      displayBill: {
        billNo: '',
        netPayable: 0,
        items: []
      },
      loadingHistory: false,
      historyPage: 1,
      totalBills: 0,
      discountRules: [],
      pendingOrders: [],
      pendingOrdersDrawer: false,
      loadingPending: false,
      currentOrderId: null
    }
  },
  computed: {
    subTotal() {
        return this.cart.reduce((sum, item) => sum + item.total, 0)
    },
    totalDiscountPercent() {
        let d = this.globalDiscount
        
        // Check for Tiered Rules
        if (this.discountRules.length > 0) {
            const amt = this.subTotal
            const rule = this.discountRules.find(r => amt >= r.min_amount && (r.max_amount === 0 || amt <= r.max_amount))
            if (rule) {
                d = rule.percentage
            }
        }
    
        if (this.selectedCustomer && this.selectedCustomer.discount_percent) {
            d += this.selectedCustomer.discount_percent
        }
        return d
    },
    activeRule() {
        if (this.discountRules.length > 0) {
            const amt = this.subTotal
            return this.discountRules.find(r => amt >= r.min_amount && (r.max_amount === 0 || amt <= r.max_amount))
        }
        return null
    },
    discountAmount() {
        return (this.subTotal * this.totalDiscountPercent) / 100
    },
    netPayable() {
        return this.subTotal - this.discountAmount
    }
  },
  async mounted() {
    await this.fetchConfig()
    // Check for orderId in query
    if (this.$route.query.orderId) {
         await this.fetchPendingOrders()
         const orderId = parseInt(this.$route.query.orderId)
         const order = this.pendingOrders.find(o => o.id === orderId)
         if (order) {
             this.loadOrderToPOS(order)
             // Clean up query param
             this.$router.replace({ query: null })
         }
    }
    await this.fetchProducts()
    await this.fetchNextBillNo()
    await this.searchCustomers('') 
    await this.fetchGlobalDiscount()
    await this.fetchDiscountRules()
  },
  methods: {
    async fetchConfig() {
        try {
            const res = await EventServices.getConfig()
            if (res.data.company_name) {
                 this.companyName = res.data.company_name
            }
        } catch (e) { console.error("Failed to load config", e) }
    },
    async fetchDiscountRules() {
        try {
            const res = await EventServices.getDiscountRules()
            this.discountRules = res.data
        } catch(e) { console.error("Failed rules", e) }
    },
    async fetchGlobalDiscount() {
        try {
            const res = await EventServices.getBillingDiscount()
            this.globalDiscount = res.data.percentage
        } catch(e) { console.error("Failed to load discount", e) }
    },
    async fetchProducts() {
      try {
        const res = await EventServices.getProducts()
        this.products = res.data
      } catch (e) { console.error(e) }
    },
    async fetchNextBillNo() {
      try {
          const res = await EventServices.getNextBillNo()
          this.nextBillNo = res.data.next_bill_no
      } catch (e) { 
          console.error(e) 
          this.nextBillNo = 'Offline'
      }
    },
    addToCart() {
        if (!this.selectedProduct) return
        
        const existing = this.cart.find(i => i.product_id === this.selectedProduct.id)
        if (existing) {
            existing.quantity += this.qty
            existing.total = existing.quantity * existing.unit_price
        } else {
            this.cart.push({
                product_id: this.selectedProduct.id,
                name: this.selectedProduct.name,
                brand_name: this.selectedProduct.brand ? this.selectedProduct.brand.name : '',
                unit_price: this.selectedProduct.unit_price,
                quantity: this.qty,
                total: this.selectedProduct.unit_price * this.qty
            })
        }
        
        // Reset selection
        this.selectedProduct = null
        this.qty = 1
    },
    removeFromCart(item) {
        const index = this.cart.indexOf(item)
        if (index > -1) {
            this.cart.splice(index, 1)
        }
    },
    increaseQty(item) {
        item.quantity++
        item.total = item.quantity * item.unit_price
    },
    decreaseQty(item) {
        if (item.quantity > 1) {
            item.quantity--
            item.total = item.quantity * item.unit_price
        } else {
            this.removeFromCart(item)
        }
    },
    async fetchPendingOrders() {
        this.loadingPending = true
        this.pendingOrdersDrawer = true
        try {
            const res = await EventServices.getOrders({ status: 'PENDING' })
            this.pendingOrders = res.data
        } catch (e) { console.error(e) }
        finally { this.loadingPending = false }
    },
    loadOrderToPOS(order) {
        if (this.cart.length > 0) {
            if(!confirm("Current cart will be cleared. Continue?")) return
        }
        
        this.currentOrderId = order.id // Track the order ID
        
        // Load Customer
        if (order.customer) {
            this.selectedCustomer = order.customer
        } else {
            // Create temp customer from order details if valid
            this.selectedCustomer = {
                name: order.customer_name || 'Walk-in',
                mobile: order.customer_mobile || '',
                address: order.address || ''
            }
        }
        
        // Load Items
        this.cart = order.items.map(i => {
            // Use order item price, fallback to current product price
            const price = parseFloat(i.unit_price) || (i.product ? parseFloat(i.product.unit_price) : 0)
            const qty = parseInt(i.quantity) || 1
            return {
                product_id: i.product_id,
                name: i.product ? i.product.name : i.name || 'Unknown Product',
                brand_name: i.product && i.product.brand ? i.product.brand.name : '',
                unit_price: price,
                quantity: qty,
                total: price * qty
            }
        })
        
        this.pendingOrdersDrawer = false
        this.showSnackbar('Order Loaded Successfully', 'success')
    },
    async fetchHistory() {
        this.loadingHistory = true
        this.historyDrawer = true
        try {
            const res = await EventServices.getBills({ limit: 10 })
            this.historyBills = res.data.data
            this.totalBills = res.data.total
            this.historyPage = 1
        } catch (e) { console.error(e) }
        finally { this.loadingHistory = false }
    },
    async loadMoreHistory() {
        this.loadingHistory = true
        try {
            const nextPage = this.historyPage + 1
            const res = await EventServices.getBills({ page: nextPage, limit: 10 })
            this.historyBills.push(...res.data.data)
            this.historyPage = nextPage
        } catch (e) { console.error(e) }
        finally { this.loadingHistory = false }
    },
    previewBill() {
        this.displayBill = {
            billNo: this.nextBillNo,
            netPayable: this.netPayable,
            items: this.cart.map(i => ({
                product_id: i.product_id,
                name: i.name,
                quantity: i.quantity,
                unit_price: i.unit_price,
                total: i.total
            }))
        }
        this.isViewOnly = false
        this.previewDialog = true
    },
    async confirmAndPrint() {
        this.saving = true
        try {
            const payload = {
              customer_id: this.selectedCustomer ? this.selectedCustomer.id : null,
              total_amount: this.subTotal,
              discount_amount: this.discountAmount, 
              gst_amount: 0,
              net_payable: this.netPayable,
              payment_mode: this.paymentMode,
              items: this.cart.map(i => ({
                product_id: i.product_id,
                quantity: i.quantity,
                unit_price: i.unit_price,
                total: i.total
              }))
            }
            
            await EventServices.createBill(payload)
            
            // If this was a pending order, mark it as completed
            if (this.currentOrderId) {
                try {
                    await EventServices.updateOrderStatus(this.currentOrderId, 'COMPLETED')
                    // Remove from local list to update UI immediately
                    this.pendingOrders = this.pendingOrders.filter(o => o.id !== this.currentOrderId)
                } catch (e) {
                    console.error("Failed to update order status", e)
                    this.showSnackbar('Bill created but failed to update order status', 'warning')
                }
            }
            
            window.print() 
            
            // Reset
            this.cart = []
            this.selectedCustomer = null
            this.currentOrderId = null // Reset order ID
            this.fetchNextBillNo()
            this.fetchProducts() 
            this.previewDialog = false
            this.showSnackbar('Transaction Completed', 'success')
        } catch(e) {
            this.showSnackbar('Transaction Failed', 'error')
        } finally {
            this.saving = false
        }
    },
    async searchCustomers(val) {
      try {
        const query = val || ''
        const res = await EventServices.searchCustomers(query)
        this.customers = res.data
      } catch (e) {
        console.error(e)
      }
    },
    printBill() {
        window.print()
    },
    onCustomerSelect(customer) {
        this.selectedCustomer = customer
    },
    async createCustomer() {
        try {
            const res = await EventServices.createCustomer(this.newCustomer)
            this.selectedCustomer = res.data
            this.showAddCustomer = false
            this.showSnackbar('Customer Created', 'success')
        } catch(e) {
            this.showSnackbar('Failed to create customer', 'error')
        }
    },
    showSnackbar(msg, color) {
        this.snackbarText = msg
        this.snackbarColor = color
        this.snackbar = true
    },
    viewOldBill(bill) {
        this.isViewOnly = true
        this.displayBill = {
            billNo: bill.bill_no,
            netPayable: bill.net_payable,
            items: bill.items ? bill.items.map(i => ({
                product_id: i.product_id,
                name: i.product ? i.product.name : `Product #${i.product_id}`,
                quantity: i.quantity,
                unit_price: i.unit_price,
                total: i.total
            })) : []
        }
        if (bill.customer) {
            this.selectedCustomer = bill.customer
        } else {
            this.selectedCustomer = null
        }
        this.previewDialog = true
    },
    shareOnWhatsApp() {
        if (!this.selectedCustomer) {
            this.showSnackbar('No customer selected to share with', 'warning')
            return
        }
        
        let message = `*Bill Receipt from My Shop*\n`
        message += `Bill No: ${this.displayBill.billNo}\n`
        message += `Date: ${new Date().toLocaleDateString()}\n`
        message += `--------------------------------\n`
        
        this.displayBill.items.forEach(item => {
            message += `${item.name} x ${item.quantity}: ₹${item.total.toFixed(2)}\n`
        })
        
        message += `--------------------------------\n`
        message += `*Total: ₹${this.displayBill.netPayable.toFixed(2)}*\n`
        message += `Thank you for shopping with us!`
        
        const encodedMsg = encodeURIComponent(message)
        const mobile = this.selectedCustomer.mobile
        let formattedMobile = mobile.replace(/\D/g, '')
        if (formattedMobile.length === 10) formattedMobile = '91' + formattedMobile
        
        window.open(`https://wa.me/${formattedMobile}?text=${encodedMsg}`, '_blank')
    }
  }
}
</script>

<style scoped>
.bg-gradient-gold {
     background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%) !important;
}
.gradient-text {
     background: linear-gradient(135deg, #C5A065 0%, #B08D55 100%);
     -webkit-background-clip: text;
     background-clip: text;
     -webkit-text-fill-color: transparent;
}
.border-dashed {
    border-style: dashed !important;
}

@media print {
    body * {
        visibility: hidden;
    }
    #invoice-section, #invoice-section * {
        visibility: visible;
    }
    #invoice-section {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 20px !important; /* Ensure some padding but not too much */
        background: white !important;
        color: black !important; /* Force black text for clarity */
    }
    
    /* Hide shadows and borders that look bad in print */
    .elevation-2, .elevation-3, .elevation-10 {
        box-shadow: none !important;
    }
    .v-card {
        border: none !important;
    }
    
    /* Ensure dashed lines print correctly */
    .border-dashed {
        border-style: dashed !important;
        border-color: #000 !important;
    }

    .v-overlay__scrim {
        display: none !important; /* Hide background dimming */
    }
    
    .v-overlay__content {
        display: block !important; /* Ensure content wrapper is visible */
        position: static !important; /* Reset positioning context */
        width: 100% !important;
        height: 100% !important;
    }
    
    @page {
        size: auto;
        margin: 0mm;
    }
}
</style>
