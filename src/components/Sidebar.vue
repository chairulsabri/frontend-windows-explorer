<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { Home, Star, HardDrive } from 'lucide-vue-next'
import { foldersService } from '@/services/folders.service'
import { favoritesService } from '@/services/favorites.service'
import { useExplorerStore } from '@/stores/explorer'
import FolderTreeItem from './FolderTreeItem.vue'

const store = useExplorerStore()

const { data: folderTree } = useQuery({
  queryKey: ['folder-tree'],
  queryFn: () => foldersService.getTree(),
})

const { data: favorites } = useQuery({
  queryKey: ['favorites'],
  queryFn: () => favoritesService.getAll(),
})

function navigateToFolder(folderId: number | null) {
  store.setCurrentFolder(folderId)
}
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h1 class="text-xl font-bold text-primary-700 flex items-center gap-2">
        <HardDrive :size="24" />
        Explorer
      </h1>
    </div>

    <!-- Quick Access -->
    <div class="p-4 space-y-1">
      <h2 class="text-xs font-semibold text-gray-500 uppercase mb-2">
        Quick Access
      </h2>

      <div
        class="sidebar-item"
        :class="{ active: store.currentFolderId === 1 }"
        @click="navigateToFolder(1)"
      >
        <Home :size="18" />
        <span>Home</span>
      </div>

      <div class="sidebar-item">
        <Star :size="18" />
        <span>Favorites</span>
        <span class="ml-auto text-xs text-gray-500">
          {{ favorites?.data?.length || 0 }}
        </span>
      </div>
    </div>

    <!-- Folder Tree -->
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="text-xs font-semibold text-gray-500 uppercase mb-2">
        Folders
      </h2>

      <div v-if="folderTree?.data" class="space-y-1">
        <FolderTreeItem
          v-for="folder in folderTree.data"
          :key="folder.id"
          :folder="folder"
          :current-folder-id="store.currentFolderId"
          @navigate="navigateToFolder"
        />
      </div>
    </div>
  </aside>
</template>
