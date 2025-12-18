<script setup lang="ts">
import { computed } from 'vue'
import { Folder as FolderIcon } from 'lucide-vue-next'
import { formatFileSize, getFileIcon } from '@/lib/utils'
import { useExplorerStore } from '@/stores/explorer'
import type { Folder, File } from '@/types'

interface FileGridProps {
  folders: Folder[]
  files: File[]
  loading?: boolean
}

const props = withDefaults(defineProps<FileGridProps>(), {
  loading: false
})

const emit = defineEmits<{
  openFolder: [folderId: number]
  selectItem: [itemId: number, type: 'folder' | 'file']
  contextMenu: [event: MouseEvent, item: Folder | File, type: 'folder' | 'file']
}>()

const store = useExplorerStore()

const allItems = computed(() => {
  return [
    ...props.folders.map(f => ({ ...f, type: 'folder' as const })),
    ...props.files.map(f => ({ ...f, type: 'file' as const }))
  ]
})

function handleDoubleClick(item: any) {
  if (item.type === 'folder') {
    emit('openFolder', item.id)
  }
}

function handleClick(item: any, event: MouseEvent) {
  if (event.ctrlKey || event.metaKey) {
    store.toggleSelection(item.id)
  } else {
    store.clearSelection()
    store.selectItem(item.id)
  }
  emit('selectItem', item.id, item.type)
}

function handleContextMenu(event: MouseEvent, item: any) {
  event.preventDefault()
  emit('contextMenu', event, item, item.type)
}

function isSelected(itemId: number): boolean {
  return store.selectedItems.has(itemId)
}
</script>

<template>
  <div class="flex-1 overflow-auto p-4">
    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-2">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="allItems.length === 0" class="empty-state">
      <FolderIcon :size="64" class="text-gray-300 mb-4" />
      <p class="text-lg font-medium">This folder is empty</p>
      <p class="text-sm mt-1">Create a new folder or file to get started</p>
    </div>

    <!-- Grid Layout -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div
        v-for="item in allItems"
        :key="`${item.type}-${item.id}`"
        class="card p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
        :class="{ 'ring-2 ring-primary-600': isSelected(item.id) }"
        @click="handleClick(item, $event)"
        @dblclick="handleDoubleClick(item)"
        @contextmenu="handleContextMenu($event, item)"
      >
        <!-- Icon -->
        <div class="flex items-center justify-center mb-3">
          <FolderIcon v-if="item.type === 'folder'" :size="64" class="text-primary-600" />
          <span v-else class="text-6xl">{{ getFileIcon(item.extension) }}</span>
        </div>

        <!-- Name -->
        <div class="text-center">
          <p class="font-medium text-sm truncate mb-1" :title="item.name">
            {{ item.name }}
          </p>
          <p v-if="item.type === 'file'" class="text-xs text-gray-500">
            {{ formatFileSize(item.size) }}
          </p>
          <p v-else class="text-xs text-primary-600">
            Folder
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
