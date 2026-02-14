<template>
  <v-app>
    <v-overlay
      :model-value="loaderStore.isLoading"
      class="align-center justify-center"
      persistent
      z-index="9999"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <router-view />
  </v-app>
</template>

<script setup>
import { useLoaderStore } from '@/stores/loader'

const loaderStore = useLoaderStore()
</script>
