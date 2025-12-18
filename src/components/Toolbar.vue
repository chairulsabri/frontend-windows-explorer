<script setup lang="ts">
import { ref } from 'vue'
import { 
  Plus, 
  FolderPlus, 
  Upload, 
  Trash2, 
  Grid3x3, 
  List, 
  Search,
  RefreshCw
} from 'lucide-vue-next'
import { useExplorerStore } from '@/stores/explorer'

const store = useExplorerStore()

const emit = defineEmits<{
  createFolder: []
  createFile: []
  deleteSelected: []
  refresh: []
}>()

function handleSearch(event: Event) {
  const target = event.target as HTMLInputElement
  store.setSearchQuery(target.value)
}
</script>

<template>
  <div class="bg-white border-b border-gray-200 p-4">
    <div class="flex items-center justify-between gap-4">
      <!-- Left Actions -->
      <div class="flex items-center gap-2">
        <button 
          class="btn btn-primary flex items-center gap-2"
          @click="emit('createFolder')"
        >
          <FolderPlus :size="18" />
          <span class="hidden sm:inline">New Folder</span>
        </button>

        <button 
          class="btn btn-secondary flex items-center gap-2"
          @click="emit('createFile')"
        >
          <Plus :size="18" />
          <span class="hidden sm:inline">New File</span>
        </button>

        <button 
          v-if="store.hasSelection"
          class="btn btn-danger flex items-center gap-2"
          @click="emit('deleteSelected')"
        >
          <Trash2 :size="18" />
          <span class="hidden sm:inline">Delete ({{ store.selectionCount }})</span>
        </button>

        <button 
          class="btn btn-secondary"
          @click="emit('refresh')"
          title="Refresh"
        >
          <RefreshCw :size="18" />
        </button>
      </div>

      <!-- Search -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
          <input
            type="text"
            placeholder="Search files and folders..."
            class="input pl-10"
            :value="store.searchQuery"
            @input="handleSearch"
          />
        </div>
      </div>

      <!-- View Mode Toggle -->
      <div class="flex items-center gap-2">
        <button
          class="btn btn-secondary"
          :class="{ 'btn-primary': store.viewMode === 'list' }"
          @click="store.viewMode = 'list'"
          title="List View"
        >
          <List :size="18" />
        </button>
        <button
          class="btn btn-secondary"
          :class="{ 'btn-primary': store.viewMode === 'grid' }"
          @click="store.viewMode = 'grid'"
          title="Grid View"
        >
          <Grid3x3 :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>
