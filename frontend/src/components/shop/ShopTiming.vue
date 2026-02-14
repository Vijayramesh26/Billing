<template>
  <div class="pa-6 text-left border-left-secondary">
    <div class="text-overline text-medium-emphasis mb-1">Status</div>
    <div class="d-flex align-center mb-2">
      <div 
        class="status-dot mr-3"
        :class="isOpen ? 'bg-success pulse' : 'bg-error'"
      ></div>
      <span class="text-h6 font-weight-bold text-primary">
        {{ isOpen ? 'Open Now' : 'Closed Now' }}
      </span>
    </div>
    <div class="text-body-2 text-medium-emphasis">
      {{ isMap ? siteInfo.openingHours : siteInfo.openingHours }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useSiteStore } from '@/stores/site'

export default {
  name: 'ShopTiming',
  props: {
    isMap: { type: Boolean, default: false }
  },
  data() {
    return {
      currentTime: new Date(),
      isOpen: false,
      intervalId: null
    }
  },
  computed: {
    ...mapState(useSiteStore, ['siteInfo'])
  },
  mounted() {
    this.checkStatus()
    this.intervalId = setInterval(() => {
      this.checkStatus()
    }, 60000)
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    checkStatus() {
      this.currentTime = new Date()
      const hour = this.currentTime.getHours()
      this.isOpen = hour >= 9 && hour < 21 // 9 AM to 9 PM
    }
  }
}
</script>

<style scoped>
.border-left-secondary {
  border-left: 4px solid var(--secondary-color);
  background: rgba(0, 0, 0, 0.03);
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.pulse {
  box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}
</style>
