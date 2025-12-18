<script setup lang="ts">
import { ref } from 'vue'
import { Folder as FolderIcon, ChevronRight, ChevronDown } from 'lucide-vue-next'

interface FolderTreeItemProps {
  folder: any
  currentFolderId: number | null
  level?: number
}

const props = withDefaults(defineProps<FolderTreeItemProps>(), {
  level: 0,
})

const emit = defineEmits<{
  navigate: [folderId: number]
}>()

const isExpanded = ref(true)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function handleClick() {
  emit('navigate', props.folder.id)
}
</script>

<template>
  <div>
    <div
      class="sidebar-item"
      :class="{ active: folder.id === currentFolderId }"
      :style="{ paddingLeft: `${level * 16 + 16}px` }"
      @click="handleClick"
    >
      <button
        v-if="folder.children?.length"
        @click.stop="toggleExpand"
        class="p-0.5 hover:bg-gray-200 rounded"
      >
        <ChevronRight v-if="!isExpanded" :size="14" />
        <ChevronDown v-else :size="14" />
      </button>

      <FolderIcon :size="16" />
      <span class="text-sm">{{ folder.name }}</span>
    </div>

    <div v-if="isExpanded && folder.children">
      <FolderTreeItem
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :current-folder-id="currentFolderId"
        :level="level + 1"
        @navigate="emit('navigate', $event)"
      />
    </div>
  </div>
</template>
