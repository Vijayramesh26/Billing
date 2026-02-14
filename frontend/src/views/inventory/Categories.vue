<template>
  <v-container fluid class="fill-height bg-grey-lighten-5 pa-6 align-start">
    <v-card class="rounded-xl elevation-10 bg-white border-thin w-100">
      <div class="card-header-glow"></div>
      
      <!-- Toolbar -->
      <v-toolbar color="transparent" class="px-6 pt-6 mb-4">
          <v-avatar color="secondary" variant="tonal" size="48" class="mr-4 rounded-lg">
             <v-icon color="secondary" size="28">mdi-shape</v-icon>
          </v-avatar>
          <div>
             <v-toolbar-title class="text-h5 font-weight-black text-grey-darken-3">Category Management</v-toolbar-title>
             <div class="text-caption text-grey font-weight-medium">Organize your product catalog</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            prepend-icon="mdi-plus" 
            rounded="lg" 
            elevation="2" 
            height="44"
            class="text-capitalize font-weight-bold"
            @click="dialog = true"
          >
            New Category
          </v-btn>
      </v-toolbar>

      <!-- Data Table -->
      <v-data-table 
        :headers="headers" 
        :items="categories" 
        :loading="loading" 
        class="bg-transparent px-6 pb-6"
        hover
      >
        <template v-slot:item.name="{ item }">
            <div class="font-weight-bold text-body-1 text-grey-darken-3">{{ item.name }}</div>
        </template>
        <template v-slot:item.description="{ item }">
            <div class="text-body-2 text-medium-emphasis">{{ item.description || '-' }}</div>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-pencil" variant="text" size="small" color="primary"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-xl">
        <v-toolbar color="primary" class="px-4">
             <v-toolbar-title class="text-h6 font-weight-bold text-white">Add New Category</v-toolbar-title>
             <v-btn icon dark @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-text-field v-model="newCategory.name" label="Category Name" variant="outlined" density="comfortable" color="primary" class="mb-4"></v-text-field>
          <v-textarea v-model="newCategory.description" label="Description" rows="3" variant="outlined" density="comfortable" color="primary"></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" size="large" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" size="large" rounded="lg" @click="save" :loading="saving">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCategoryStore } from '@/stores/category'

export default {
  name: 'Categories',
  data() {
    return {
      headers: [
        { title: 'Name', key: 'name', align: 'start' },
        { title: 'Description', key: 'description' },
        { title: 'Actions', key: 'actions', align: 'end' },
      ],
      dialog: false,
      saving: false,
      newCategory: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapState(useCategoryStore, ['categories', 'loading'])
  },
  mounted() {
    this.fetchCategories()
  },
  methods: {
    ...mapActions(useCategoryStore, ['fetchCategories', 'createCategory']),
    async save() {
      if (!this.newCategory.name) return
      this.saving = true
      try {
        await this.createCategory(this.newCategory)
        this.dialog = false
        this.newCategory = { name: '', description: '' }
      } catch(e) { console.error(e) }
      finally { this.saving = false }
    }
  }
}
</script>

<style scoped>
.card-header-glow {
    position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #1976D2, #42A5F5);
}
.border-thin { border: 1px solid rgba(0,0,0,0.08); }
</style>
