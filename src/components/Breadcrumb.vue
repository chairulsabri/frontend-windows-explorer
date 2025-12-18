<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, Home } from 'lucide-vue-next'

interface BreadcrumbProps {
  path: string
  currentFolderId: number | null
}

const props = defineProps<BreadcrumbProps>()

const emit = defineEmits<{
  navigate: [folderId: number | null]
}>()

const breadcrumbs = computed(() => {
  if (!props.path || props.path === '/') {
    return [{ id: null, name: 'Home', path: '/' }]
  }

  const parts = props.path.split('/').filter(Boolean)
  let currentPath = ''
  
  return [
    { id: null, name: 'Home', path: '/' },
    ...parts.map((part, index) => {
      currentPath += `/${part}`
      return {
        id: index + 1, // This should ideally come from the actual folder data
        name: part,
        path: currentPath
      }
    })
  ]
})

function handleNavigate(folderId: number | null) {
  emit('navigate', folderId)
}
</script>

<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3">
    <div class="flex items-center gap-2 text-sm">
      <button
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.path"
        class="flex items-center gap-2 hover:text-primary-600 transition-colors"
        @click="handleNavigate(crumb.id)"
      >
        <Home v-if="index === 0" :size="16" />
        <span>{{ crumb.name }}</span>
        <ChevronRight 
          v-if="index < breadcrumbs.length - 1" 
          :size="16" 
          class="text-gray-400"
        />
      </button>
    </div>
  </div>
</template>
