<template>
  <v-app>
    <v-overlay
      :model-value="loaderStore.isLoading"
      class="align-center justify-center"
      persistent
      z-index="10000"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <v-snackbar
      v-model="snackbarStore.show"
      :color="snackbarStore.color"
      :timeout="snackbarStore.timeout"
      location="top right"
    >
      {{ snackbarStore.message }}

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbarStore.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <router-view />
  </v-app>
</template>

<script setup>
import { useLoaderStore } from '@/stores/loader'
import { useSnackbarStore } from '@/stores/snackbar'

const loaderStore = useLoaderStore()
const snackbarStore = useSnackbarStore()
</script>
