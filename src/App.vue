<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import Sidebar from './components/Sidebar.vue'
import Toolbar from './components/Toolbar.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import FileList from './components/FileList.vue'
import FileGrid from './components/FileGrid.vue'
import CreateFolderModal from './components/CreateFolderModal.vue'
import CreateFileModal from './components/CreateFileModal.vue'
import { foldersService } from './services/folders.service'
import { filesService } from './services/files.service'
import { useExplorerStore } from './stores/explorer'
import { buildPath, getMimeType } from './lib/utils'

const store = useExplorerStore()
const queryClient = useQueryClient()

// Modal states
const showCreateFolderModal = ref(false)
const showCreateFileModal = ref(false)

// Current folder query
const { data: currentFolder } = useQuery({
  queryKey: ['folder', store.currentFolderId],
  queryFn: () => store.currentFolderId ? foldersService.getById(store.currentFolderId) : null,
  enabled: computed(() => store.currentFolderId !== null),
})

// Folder contents query
const { data: folderContents, isLoading, refetch } = useQuery({
  queryKey: ['folder-contents', store.currentFolderId],
  queryFn: () => store.currentFolderId ? foldersService.getContents(store.currentFolderId) : null,
})

// Filtered items based on search
const filteredFolders = computed(() => {
  if (!folderContents.value?.data?.folders) return []
  const query = store.searchQuery.toLowerCase()
  if (!query) return folderContents.value.data.folders
  return folderContents.value.data.folders.filter(f => 
    f.name.toLowerCase().includes(query)
  )
})

const filteredFiles = computed(() => {
  if (!folderContents.value?.data?.files) return []
  const query = store.searchQuery.toLowerCase()
  if (!query) return folderContents.value.data.files
  return folderContents.value.data.files.filter(f => 
    f.name.toLowerCase().includes(query) || 
    f.extension?.toLowerCase().includes(query)
  )
})

const currentPath = computed(() => {
  return currentFolder.value?.data?.path || '/'
})

// Create folder mutation
const createFolderMutation = useMutation({
  mutationFn: (data: { name: string; path: string; parent_id: number | null }) => 
    foldersService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
    queryClient.invalidateQueries({ queryKey: ['folder-tree'] })
    showCreateFolderModal.value = false
    alert('Folder created successfully!')
  },
  onError: (error: any) => {
    alert(`Error creating folder: ${error.response?.data?.error || error.message}`)
  },
})

// Create file mutation
const createFileMutation = useMutation({
  mutationFn: (data: { name: string; path: string; folder_id: number | null; extension: string; size: number; mime_type: string }) => 
    filesService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
    showCreateFileModal.value = false
    alert('File created successfully!')
  },
  onError: (error: any) => {
    alert(`Error creating file: ${error.response?.data?.error || error.message}`)
  },
})

// Delete mutation
const deleteMutation = useMutation({
  mutationFn: async (items: { id: number; type: 'folder' | 'file' }[]) => {
    for (const item of items) {
      if (item.type === 'folder') {
        await foldersService.delete(item.id)
      } else {
        await filesService.delete(item.id)
      }
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
    queryClient.invalidateQueries({ queryKey: ['folder-tree'] })
    store.clearSelection()
    alert('Items deleted successfully!')
  },
  onError: (error: any) => {
    alert(`Error deleting items: ${error.response?.data?.error || error.message}`)
  },
})

// Handlers
function handleCreateFolder(name: string) {
  const path = buildPath(currentPath.value, name)
  createFolderMutation.mutate({
    name,
    path,
    parent_id: store.currentFolderId,
  })
}

function handleCreateFile(name: string, extension: string, size: number) {
  const fullName = `${name}.${extension}`
  const path = buildPath(currentPath.value, fullName)
  const mimeType = getMimeType(extension)
  
  createFileMutation.mutate({
    name: fullName,
    path,
    folder_id: store.currentFolderId,
    extension,
    size,
    mime_type: mimeType,
  })
}

function handleOpenFolder(folderId: number) {
  store.setCurrentFolder(folderId)
}

function handleDeleteSelected() {
  if (!store.hasSelection) return
  
  if (!confirm(`Are you sure you want to delete ${store.selectionCount} item(s)?`)) {
    return
  }

  const selectedIds = Array.from(store.selectedItems)
  const items = [
    ...filteredFolders.value.filter(f => selectedIds.includes(f.id)).map(f => ({ id: f.id, type: 'folder' as const })),
    ...filteredFiles.value.filter(f => selectedIds.includes(f.id)).map(f => ({ id: f.id, type: 'file' as const }))
  ]
  
  deleteMutation.mutate(items)
}

function handleRefresh() {
  refetch()
}

function handleNavigate(folderId: number | null) {
  store.setCurrentFolder(folderId)
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Toolbar -->
      <Toolbar
        @create-folder="showCreateFolderModal = true"
        @create-file="showCreateFileModal = true"
        @delete-selected="handleDeleteSelected"
        @refresh="handleRefresh"
      />

      <!-- Breadcrumb -->
      <Breadcrumb
        :path="currentPath"
        :current-folder-id="store.currentFolderId"
        @navigate="handleNavigate"
      />

      <!-- File View -->
      <FileList
        v-if="store.viewMode === 'list'"
        :folders="filteredFolders"
        :files="filteredFiles"
        :loading="isLoading"
        @open-folder="handleOpenFolder"
      />

      <FileGrid
        v-else
        :folders="filteredFolders"
        :files="filteredFiles"
        :loading="isLoading"
        @open-folder="handleOpenFolder"
      />
    </div>

    <!-- Modals -->
    <CreateFolderModal
      :show="showCreateFolderModal"
      :parent-path="currentPath"
      @close="showCreateFolderModal = false"
      @create="handleCreateFolder"
    />

    <CreateFileModal
      :show="showCreateFileModal"
      :parent-path="currentPath"
      @close="showCreateFileModal = false"
      @create="handleCreateFile"
    />
  </div>
</template>
