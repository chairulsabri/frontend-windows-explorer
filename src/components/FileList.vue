<script setup lang="ts">
import { computed } from 'vue'
import { 
  Folder as FolderIcon, 
  File as FileIcon, 
  Star,
  ArrowUpDown
} from 'lucide-vue-next'
import { formatFileSize, formatDate, getFileIcon } from '@/lib/utils'
import { useExplorerStore } from '@/stores/explorer'
import type { Folder, File } from '@/types'

interface FileListProps {
  folders: Folder[]
  files: File[]
  loading?: boolean
}

const props = withDefaults(defineProps<FileListProps>(), {
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

function handleSort(field: string) {
  store.setSortBy(field)
}
</script>

<template>
  <div class="flex-1 overflow-auto">
    <!-- Table Header -->
    <div class="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center text-xs font-semibold text-gray-600 uppercase">
      <div class="flex-1 flex items-center gap-2 cursor-pointer" @click="handleSort('name')">
        <span>Name</span>
        <ArrowUpDown :size="14" />
      </div>
      <div class="w-32 flex items-center gap-2 cursor-pointer" @click="handleSort('updated_at')">
        <span>Modified</span>
        <ArrowUpDown :size="14" />
      </div>
      <div class="w-24 flex items-center gap-2 cursor-pointer" @click="handleSort('size')">
        <span>Size</span>
        <ArrowUpDown :size="14" />
      </div>
      <div class="w-24">Type</div>
    </div>

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

    <!-- Items List -->
    <div v-else>
      <div
        v-for="item in allItems"
        :key="`${item.type}-${item.id}`"
        class="file-item"
        :class="{ selected: isSelected(item.id) }"
        @click="handleClick(item, $event)"
        @dblclick="handleDoubleClick(item)"
        @contextmenu="handleContextMenu($event, item)"
      >
        <!-- Name Column -->
        <div class="flex-1 flex items-center gap-3 min-w-0">
          <FolderIcon v-if="item.type === 'folder'" :size="20" class="text-primary-600 flex-shrink-0" />
          <span v-else class="text-2xl flex-shrink-0">{{ getFileIcon(item.extension) }}</span>
          <span class="font-medium truncate">{{ item.name }}</span>
        </div>

        <!-- Modified Column -->
        <div class="w-32 text-sm text-gray-600">
          {{ formatDate(item.updated_at) }}
        </div>

        <!-- Size Column -->
        <div class="w-24 text-sm text-gray-600">
          <span v-if="item.type === 'file'">{{ formatFileSize(item.size) }}</span>
          <span v-else class="text-gray-400">—</span>
        </div>

        <!-- Type Column -->
        <div class="w-24 text-sm text-gray-600">
          <span v-if="item.type === 'folder'" class="text-primary-600">Folder</span>
          <span v-else class="uppercase">{{ item.extension || 'File' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
