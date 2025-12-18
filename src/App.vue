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

// Auto-refresh interval (dalam milidetik)
const REFRESH_INTERVAL = 3000 // 3 detik

// Current folder query
const { data: currentFolder } = useQuery({
  queryKey: ['folder', store.currentFolderId],
  queryFn: () => store.currentFolderId ? foldersService.getById(store.currentFolderId) : null,
  enabled: computed(() => store.currentFolderId !== null),
})

// Folder contents query dengan AUTO-REFRESH
const { data: folderContents, isLoading, refetch } = useQuery({
  queryKey: ['folder-contents', store.currentFolderId],
  queryFn: () => store.currentFolderId ? foldersService.getContents(store.currentFolderId) : null,
  refetchInterval: REFRESH_INTERVAL,
  refetchOnWindowFocus: true,
  refetchIntervalInBackground: false,
})

// Folder tree juga auto-refresh
const { refetch: refetchTree } = useQuery({
  queryKey: ['folder-tree'],
  queryFn: () => foldersService.getTree(),
  refetchInterval: REFRESH_INTERVAL,
  refetchOnWindowFocus: true,
  refetchIntervalInBackground: false,
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

// ← COMPUTED: Current path dan folder info
const currentPath = computed(() => {
  return currentFolder.value?.data?.path || '/'
})

const currentFolderName = computed(() => {
  return currentFolder.value?.data?.name || 'Root'
})

const currentParentId = computed(() => {
  return store.currentFolderId
})

// Create folder mutation
const createFolderMutation = useMutation({
  mutationFn: (data: { name: string; path: string; parent_id: number | null }) => 
    foldersService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
    queryClient.invalidateQueries({ queryKey: ['folder-tree'] })
    showCreateFolderModal.value = false
    alert('✅ Folder created successfully in ' + currentFolderName.value + '!')
  },
  onError: (error: any) => {
    alert(`❌ Error creating folder: ${error.response?.data?.error || error.message}`)
  },
})

// Create file mutation
const createFileMutation = useMutation({
  mutationFn: (data: { name: string; path: string; folder_id: number | null; extension: string; size: number; mime_type: string }) => 
    filesService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['folder-contents'] })
    showCreateFileModal.value = false
    alert('✅ File created successfully in ' + currentFolderName.value + '!')
  },
  onError: (error: any) => {
    alert(`❌ Error creating file: ${error.response?.data?.error || error.message}`)
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
    alert('✅ Items deleted successfully!')
  },
  onError: (error: any) => {
    alert(`❌ Error deleting items: ${error.response?.data?.error || error.message}`)
  },
})

// ← HANDLER: Create folder di posisi aktif
function handleCreateFolder(name: string) {
  // Build path berdasarkan folder aktif
  const path = buildPath(currentPath.value, name)
  
  console.log('Creating folder:', {
    name,
    path,
    parent_id: currentParentId.value,
    current_location: currentFolderName.value
  })
  
  createFolderMutation.mutate({
    name,
    path,
    parent_id: currentParentId.value, // ← Otomatis masuk ke folder aktif
  })
}

// ← HANDLER: Create file di posisi aktif
function handleCreateFile(name: string, extension: string, size: number) {
  const fullName = `${name}.${extension}`
  // Build path berdasarkan folder aktif
  const path = buildPath(currentPath.value, fullName)
  const mimeType = getMimeType(extension)
  
  console.log('Creating file:', {
    name: fullName,
    path,
    folder_id: currentParentId.value,
    current_location: currentFolderName.value
  })
  
  createFileMutation.mutate({
    name: fullName,
    path,
    folder_id: currentParentId.value, // ← Otomatis masuk ke folder aktif
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
  refetchTree()
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

      <!-- Status Bar dengan Location Info -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 text-xs border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-gray-700 font-medium">
            📁 {{ filteredFolders.length }} folders · 📄 {{ filteredFiles.length }} files
          </span>
          <span class="text-blue-600 font-medium">
            📍 Current: {{ currentFolderName }}
          </span>
        </div>
        <div class="flex items-center gap-2 text-green-600">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span class="font-medium">Auto-refresh Active</span>
        </div>
      </div>

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

    <!-- Modals dengan info lokasi -->
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