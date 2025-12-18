# Windows Explorer Frontend - Vue 3

Frontend aplikasi Windows Explorer yang dibangun dengan **Vue 3**, **TypeScript**, **Tailwind CSS**, dan **TanStack Query (Vue Query)**.

## 🎨 Teknologi Stack

- **Vue 3** - Progressive JavaScript Framework
- **TypeScript** - Type Safety
- **Vite** - Build tool yang sangat cepat
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching & caching
- **Pinia** - State management
- **Axios** - HTTP client
- **Lucide Icons** - Beautiful icons

## ✨ Fitur

### Sudah Diimplementasikan ✅
- [x] Folder tree navigation di sidebar
- [x] List view dan Grid view
- [x] Create folder dan file
- [x] Delete multiple items
- [x] Search functionality
- [x] Sort by name, date, size
- [x] Breadcrumb navigation
- [x] Selection (single & multiple dengan Ctrl+Click)
- [x] Responsive design
- [x] Loading states
- [x] Empty states
- [x] Error handling

### Yang Bisa Ditambahkan 🔜
- [ ] Rename file/folder
- [ ] Move file/folder (drag & drop)
- [ ] Right-click context menu
- [ ] File preview
- [ ] Favorites/starred items
- [ ] File upload (actual files)
- [ ] Download files
- [ ] Copy/Paste/Cut
- [ ] Keyboard shortcuts
- [ ] Undo/Redo
- [ ] Dark mode

## 📦 Instalasi

### Prerequisites
- Node.js 18+ atau Bun
- Backend API sudah running di `http://localhost:3000`

### Setup

```bash
# Install dependencies
npm install
# atau
bun install

# Start development server
npm run dev
# atau
bun run dev
```

Server akan berjalan di: `http://localhost:5173`

## 🚀 Development

### Struktur Project

```
src/
├── components/          # Vue components
│   ├── Sidebar.vue           # Folder tree navigation
│   ├── Toolbar.vue           # Action buttons & search
│   ├── Breadcrumb.vue        # Path navigation
│   ├── FileList.vue          # List view
│   ├── FileGrid.vue          # Grid view
│   ├── CreateFolderModal.vue # Create folder dialog
│   └── CreateFileModal.vue   # Create file dialog
├── services/            # API services
│   ├── folders.service.ts
│   ├── files.service.ts
│   └── favorites.service.ts
├── stores/              # Pinia stores
│   └── explorer.ts           # Explorer state management
├── lib/                 # Utilities
│   ├── api.ts                # Axios instance
│   └── utils.ts              # Helper functions
├── types/               # TypeScript types
│   └── index.ts
├── App.vue              # Main app component
├── main.ts              # Entry point
└── style.css            # Global styles
```

### Scripts

```bash
# Development
npm run dev          # Start dev server dengan hot reload

# Build
npm run build        # Build untuk production

# Preview
npm run preview      # Preview production build
```

## 🔧 Konfigurasi

### Environment Variables

Edit file `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### API Proxy

Vite sudah dikonfigurasi dengan proxy untuk development. Request ke `/api/*` akan otomatis di-forward ke backend.

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

## 📱 UI Components

### Sidebar
- Folder tree dengan expand/collapse
- Quick access links
- Active state indicator

### Toolbar
- Create folder/file buttons
- Delete selected button
- Search bar
- View mode toggle (list/grid)
- Refresh button

### Breadcrumb
- Clickable path navigation
- Home icon untuk root
- Chevron separators

### File List (List View)
- Sortable columns
- Multi-select dengan Ctrl+Click
- Double-click untuk open folder
- Hover states

### File Grid (Grid View)
- Responsive grid layout
- Large icons
- Card-based design
- Selection indicators

### Modals
- Create folder modal
- Create file modal
- Validation & error handling
- Smooth transitions

## 🎨 Styling

### Tailwind CSS

Menggunakan utility classes untuk styling cepat:

```vue
<div class="flex items-center gap-2 p-4 bg-white rounded-lg">
  <!-- Content -->
</div>
```

### Custom Components Classes

Sudah ada beberapa custom classes di `style.css`:

```css
.btn                 /* Base button */
.btn-primary         /* Primary button */
.btn-secondary       /* Secondary button */
.btn-danger          /* Danger button */
.input               /* Input field */
.card                /* Card container */
.sidebar-item        /* Sidebar menu item */
.file-item           /* File list item */
```

## 📊 State Management

### Pinia Store (Explorer)

```typescript
import { useExplorerStore } from '@/stores/explorer'

const store = useExplorerStore()

// State
store.currentFolderId      // ID folder yang aktif
store.selectedItems        // Set of selected item IDs
store.viewMode             // 'list' | 'grid'
store.sortBy               // Column untuk sort
store.sortOrder            // 'ASC' | 'DESC'
store.searchQuery          // Search text

// Actions
store.setCurrentFolder(id)
store.toggleSelection(id)
store.clearSelection()
store.toggleViewMode()
store.setSortBy(field)
```

### TanStack Query

Data fetching & caching otomatis:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['folders'],
  queryFn: () => foldersService.getAll(),
})
```

## 🔌 API Integration

### Services

Semua API calls melalui services:

```typescript
import { foldersService } from '@/services/folders.service'

// Get all folders
const folders = await foldersService.getAll({ page: 1, limit: 10 })

// Create folder
const newFolder = await foldersService.create({
  name: 'New Folder',
  path: '/New Folder',
  parent_id: null
})

// Delete folder
await foldersService.delete(folderId)
```

### Axios Interceptors

Request & response interceptors sudah dikonfigurasi:

```typescript
// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)
```

## 🎯 Usage Examples

### Navigasi Folder

```typescript
// Set folder aktif
store.setCurrentFolder(folderId)

// Get folder contents
const { data } = useQuery({
  queryKey: ['folder-contents', folderId],
  queryFn: () => foldersService.getContents(folderId),
})
```

### Create Folder

```typescript
const createFolder = useMutation({
  mutationFn: (data) => foldersService.create(data),
  onSuccess: () => {
    // Invalidate cache untuk refresh data
    queryClient.invalidateQueries(['folders'])
  },
})

createFolder.mutate({
  name: 'My Folder',
  path: '/My Folder',
  parent_id: 1
})
```

### Search Files

```typescript
// Update search query
store.setSearchQuery('document')

// Filter di computed
const filtered = computed(() => {
  return files.value.filter(f => 
    f.name.toLowerCase().includes(store.searchQuery.toLowerCase())
  )
})
```

## 🎨 Customization

### Warna Theme

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9',  // Your brand color
        600: '#0284c7',
        // ...
      },
    },
  },
}
```

### Icons

Ganti icons di components (menggunakan Lucide):

```vue
<script setup>
import { Folder, File, Star } from 'lucide-vue-next'
</script>

<template>
  <Folder :size="20" />
</template>
```

## 🐛 Troubleshooting

### API Connection Error

```bash
# Pastikan backend running
cd ../windows-explorer-api
bun run dev

# Check API URL di .env
cat .env
```

### CORS Error

Backend sudah dikonfigurasi dengan CORS. Jika masih ada error, cek:

```typescript
// Backend: src/index.ts
app.use(cors())
```

### Build Error

```bash
# Clear cache
rm -rf node_modules
rm -rf dist

# Reinstall
npm install
npm run build
```

## 📝 Best Practices

### Component Design
- Keep components small & focused
- Use composition API
- Extract reusable logic ke composables
- Props down, events up

### State Management
- Use Pinia untuk global state
- Use TanStack Query untuk server state
- Keep local state in components

### Performance
- Use `v-memo` untuk expensive lists
- Lazy load components
- Debounce search input
- Virtual scrolling untuk large lists

### TypeScript
- Always type props & emits
- Use interfaces untuk data structures
- Avoid `any` type

## 🚀 Deployment

### Build untuk Production

```bash
npm run build
```

Output di folder `dist/`.

### Deploy Options

**Vercel:**
```bash
vercel deploy
```

**Netlify:**
```bash
netlify deploy --prod
```

**Static Hosting:**
Upload folder `dist/` ke hosting (GitHub Pages, Cloudflare Pages, dll).

## 📚 Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [Pinia](https://pinia.vuejs.org/)

## 🎓 Learning Tips

1. **Start with App.vue** - Understand main flow
2. **Check components/** - See how UI is built
3. **Look at services/** - Learn API integration
4. **Read stores/explorer.ts** - Understand state
5. **Explore lib/utils.ts** - See helper functions

## 🤝 Contributing

Feel free to:
- Add new features
- Improve UI/UX
- Fix bugs
- Optimize performance

## 📄 License

MIT Chairul Sabri

---

**Happy Coding! 🎉**
