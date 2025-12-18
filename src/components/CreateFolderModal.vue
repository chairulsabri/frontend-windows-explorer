<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

interface CreateFolderModalProps {
  show: boolean
  parentPath: string
}

const props = defineProps<CreateFolderModalProps>()

const emit = defineEmits<{
  close: []
  create: [name: string]
}>()

const folderName = ref('')
const error = ref('')

function handleSubmit() {
  error.value = ''
  
  if (!folderName.value.trim()) {
    error.value = 'Folder name is required'
    return
  }

  // Validate folder name
  const invalidChars = /[<>:"/\\|?*]/
  if (invalidChars.test(folderName.value)) {
    error.value = 'Folder name contains invalid characters'
    return
  }

  emit('create', folderName.value.trim())
  folderName.value = ''
}

function handleClose() {
  folderName.value = ''
  error.value = ''
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleClose">
        <div class="modal-content">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold">Create New Folder</h2>
            <button @click="handleClose" class="p-1 hover:bg-gray-100 rounded">
              <X :size="20" />
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <input
                v-model="folderName"
                type="text"
                class="input"
                placeholder="Enter folder name"
                autofocus
              />
              <p v-if="error" class="text-sm text-red-600 mt-1">{{ error }}</p>
            </div>

            <div class="bg-gray-50 p-3 rounded">
              <p class="text-sm text-gray-600">
                <span class="font-medium">Location:</span> {{ parentPath }}
              </p>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-2 pt-4">
              <button type="button" class="btn btn-secondary" @click="handleClose">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Create Folder
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
