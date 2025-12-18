import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Folder, File } from '@/types'

export const useExplorerStore = defineStore('explorer', () => {
  // State
  const currentFolderId = ref<number | null>(1) // Start at root
  const selectedItems = ref<Set<number>>(new Set())
  const viewMode = ref<'list' | 'grid'>('list')
  const sortBy = ref<string>('name')
  const sortOrder = ref<'ASC' | 'DESC'>('ASC')
  const searchQuery = ref<string>('')
  
  // Computed
  const hasSelection = computed(() => selectedItems.value.size > 0)
  const selectionCount = computed(() => selectedItems.value.size)

  // Actions
  function setCurrentFolder(folderId: number | null) {
    currentFolderId.value = folderId
    clearSelection()
  }

  function toggleSelection(itemId: number) {
    if (selectedItems.value.has(itemId)) {
      selectedItems.value.delete(itemId)
    } else {
      selectedItems.value.add(itemId)
    }
  }

  function selectItem(itemId: number) {
    selectedItems.value.add(itemId)
  }

  function deselectItem(itemId: number) {
    selectedItems.value.delete(itemId)
  }

  function clearSelection() {
    selectedItems.value.clear()
  }

  function selectAll(items: (Folder | File)[]) {
    items.forEach(item => selectedItems.value.add(item.id))
  }

  function toggleViewMode() {
    viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
  }

  function setSortBy(field: string) {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
    } else {
      sortBy.value = field
      sortOrder.value = 'ASC'
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return {
    // State
    currentFolderId,
    selectedItems,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
    // Computed
    hasSelection,
    selectionCount,
    // Actions
    setCurrentFolder,
    toggleSelection,
    selectItem,
    deselectItem,
    clearSelection,
    selectAll,
    toggleViewMode,
    setSortBy,
    setSearchQuery,
  }
})
