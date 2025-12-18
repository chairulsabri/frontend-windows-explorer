<script setup lang="ts">
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'

interface CreateFileModalProps {
  show: boolean
  parentPath: string
}

const props = defineProps<CreateFileModalProps>()

const emit = defineEmits<{
  close: []
  create: [name: string, extension: string, size: number]
}>()

const fileName = ref('')
const fileExtension = ref('txt')
const fileSize = ref(1024)
const error = ref('')

const commonExtensions = [
  { value: 'txt', label: 'Text File (.txt)' },
  { value: 'pdf', label: 'PDF Document (.pdf)' },
  { value: 'docx', label: 'Word Document (.docx)' },
  { value: 'xlsx', label: 'Excel Spreadsheet (.xlsx)' },
  { value: 'pptx', label: 'PowerPoint (.pptx)' },
  { value: 'jpg', label: 'JPEG Image (.jpg)' },
  { value: 'png', label: 'PNG Image (.png)' },
  { value: 'mp4', label: 'Video (.mp4)' },
  { value: 'mp3', label: 'Audio (.mp3)' },
  { value: 'zip', label: 'ZIP Archive (.zip)' },
]

const fullFileName = computed(() => {
  return fileName.value ? `${fileName.value}.${fileExtension.value}` : ''
})

function handleSubmit() {
  error.value = ''
  
  if (!fileName.value.trim()) {
    error.value = 'File name is required'
    return
  }

  // Validate file name
  const invalidChars = /[<>:"/\\|?*]/
  if (invalidChars.test(fileName.value)) {
    error.value = 'File name contains invalid characters'
    return
  }

  if (fileSize.value < 0) {
    error.value = 'File size must be positive'
    return
  }

  emit('create', fileName.value.trim(), fileExtension.value, fileSize.value)
  fileName.value = ''
  fileExtension.value = 'txt'
  fileSize.value = 1024
}

function handleClose() {
  fileName.value = ''
  fileExtension.value = 'txt'
  fileSize.value = 1024
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
            <h2 class="text-lg font-semibold">Create New File</h2>
            <button @click="handleClose" class="p-1 hover:bg-gray-100 rounded">
              <X :size="20" />
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                File Name
              </label>
              <input
                v-model="fileName"
                type="text"
                class="input"
                placeholder="Enter file name (without extension)"
                autofocus
              />
              <p v-if="error" class="text-sm text-red-600 mt-1">{{ error }}</p>
              <p v-if="fullFileName" class="text-sm text-gray-500 mt-1">
                Full name: <span class="font-medium">{{ fullFileName }}</span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select v-model="fileExtension" class="input">
                <option v-for="ext in commonExtensions" :key="ext.value" :value="ext.value">
                  {{ ext.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                File Size (bytes)
              </label>
              <input
                v-model.number="fileSize"
                type="number"
                class="input"
                min="0"
                step="1024"
              />
              <p class="text-sm text-gray-500 mt-1">
                Approximate: {{ (fileSize / 1024).toFixed(2) }} KB
              </p>
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
                Create File
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
