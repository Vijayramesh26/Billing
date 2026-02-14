<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="$emit('update:drawer', $event)"
    :rail="rail && !mobile"
    permanent
    @click="rail = false"
    color="surface"
    class="border-e"
    elevation="0"
    :rail-width="65"
    :expand-on-hover="rail && !mobile"
  >
    <v-list-item
      prepend-avatar="/logo.svg"
      :title="userRole.toUpperCase()"
      subtitle="Seyyal"
      nav
      class="py-3"
    >
      <template v-slot:append>
        <v-btn
          variant="text"
          icon="mdi-chevron-left"
          @click.stop="rail = !rail"
          v-if="!mobile"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav class="mt-2">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        :to="item.to"
        active-color="primary"
        rounded="lg"
        class="mb-2"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title v-text="item.title" class="font-weight-medium"></v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
        <div class="pa-2">
            <v-btn block color="error" variant="tonal" @click="$emit('logout')" v-if="!rail || mobile" class="mb-2">
                <v-icon start>mdi-logout</v-icon> Logout
            </v-btn>
            <v-btn icon="mdi-logout" color="error" variant="text" @click="$emit('logout')" v-else></v-btn>
        </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { useDisplay } from 'vuetify'

export default {
    name: 'AppSidebar',
    props: {
        items: Array,
        userRole: String,
        drawer: { type: Boolean, default: true }
    },
    emits: ['update:drawer', 'logout'],
    setup() {
        const { mobile } = useDisplay()
        return { mobile }
    },
    data() {
        return {
            rail: false
        }
    },
    computed: {
    }
}
</script>
