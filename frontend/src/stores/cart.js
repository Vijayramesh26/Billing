import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    drawer: false
  }),
  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.qty, 0),
    totalPrice: (state) => state.items.reduce((acc, item) => acc + (item.unit_price * item.qty), 0)
  },
  actions: {
    addToCart(product) {
      const existing = this.items.find(i => i.id === product.id)
      if (existing) {
        existing.qty++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          unit_price: product.unit_price,
          qty: 1,
          image: product.image 
        })
      }
      this.drawer = true
    },
    removeFromCart(itemId) {
      this.items = this.items.filter(i => i.id !== itemId)
    },
    updateQty(itemId, delta) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        item.qty += delta
        if (item.qty <= 0) {
          this.removeFromCart(itemId)
        }
      }
    },
    clearCart() {
      this.items = []
    },
    toggleDrawer() {
      this.drawer = !this.drawer
    }
  }
})
