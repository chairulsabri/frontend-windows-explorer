# 🚀 Quick Start - Vue Frontend

Panduan untuk menjalankan frontend Windows Explorer.

## Prerequisites ✅

- [x] Backend API running di `http://localhost:3000`
- [x] Node.js 18+ atau Bun installed
- [x] Terminal/Command prompt

## Installation (3 Menit)

### 1. Install Dependencies

```bash
cd windows-explorer-frontend

# Menggunakan npm
npm install

# Atau menggunakan bun (lebih cepat)
bun install
```

### 2. Check Environment

File `.env` sudah ada dengan konfigurasi default:

```env
VITE_API_URL=http://localhost:3000/api
```

Jika backend API Anda running di port lain, edit file ini.

### 3. Start Development Server

```bash
# Menggunakan npm
npm run dev

# Atau menggunakan bun
bun run dev
```

Output yang diharapkan:

```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### 4. Buka Browser

Buka: **http://localhost:5173**

Anda akan melihat:
- Sidebar dengan folder tree
- Toolbar dengan tombol actions
- Main area untuk file list

## Test Frontend (2 Menit)

### ✅ Checklist Testing

**Sidebar:**
- [ ] Klik "Home" untuk navigate ke root
- [ ] Expand/collapse folder tree
- [ ] Klik folder untuk melihat contents

**Toolbar:**
- [ ] Klik "New Folder" → masukkan nama → Create
- [ ] Klik "New File" → masukkan nama → pilih type → Create
- [ ] Search: ketik untuk filter files
- [ ] Toggle view: List ↔️ Grid

**File List:**
- [ ] Single click untuk select item
- [ ] Double click folder untuk open
- [ ] Ctrl+Click untuk multi-select
- [ ] Click "Delete" untuk hapus selected items

**Breadcrumb:**
- [ ] Klik "Home" untuk kembali ke root
- [ ] Klik folder name untuk navigate

## Common Issues 🐛

### Issue 1: "Failed to fetch"

**Problem:** Frontend tidak bisa connect ke backend

**Solution:**
```bash
# Pastikan backend running
cd ../windows-explorer-api
bun run dev

# Check port (harus 3000)
curl http://localhost:3000/health
```

### Issue 2: "CORS Error"

**Problem:** Cross-origin request blocked

**Solution:**
Backend sudah dikonfigurasi dengan CORS. Jika masih error:

```typescript
// Backend: src/index.ts - verify this exists
app.use(cors())
```

### Issue 3: Port 5173 already in use

**Solution:**
```bash
# Kill process
lsof -ti:5173 | xargs kill -9

# Or Vite will auto use next available port
```

### Issue 4: "Cannot find module"

**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Available Scripts

```bash
npm run dev       # Start development server (hot reload)
npm run build     # Build for production
npm run preview   # Preview production build
```

## Development Tips 💡

### Hot Reload
Setiap perubahan di code akan otomatis reload di browser. Tidak perlu refresh manual!

### Browser DevTools
- Open: F12 atau Cmd+Option+I (Mac)
- Tab "Console" untuk lihat errors
- Tab "Network" untuk monitoring API calls
- Tab "Vue" (install Vue DevTools extension)

### VS Code Extensions (Recommended)
- Volar (Vue Language Features)
- TypeScript Vue Plugin
- Tailwind CSS IntelliSense
- ESLint
- Prettier

## File Structure (Simple View)

```
src/
├── components/          # UI Components
│   ├── Sidebar.vue           # ← Folder navigation
│   ├── FileList.vue          # ← List view
│   └── FileGrid.vue          # ← Grid view
├── services/            # API Calls
│   ├── folders.service.ts    # ← Folder APIs
│   └── files.service.ts      # ← File APIs
├── stores/              # State Management
│   └── explorer.ts           # ← App state
└── App.vue              # ← Main component
```

## Next Steps 🎯

### 1. Explore UI
- [x] Navigate through folders
- [x] Create folders and files
- [x] Try search functionality
- [x] Switch between list and grid view

### 2. Check Code
- [ ] Open `src/App.vue` - main logic
- [ ] Look at `src/components/` - UI components
- [ ] Read `src/services/` - API integration
- [ ] Check `src/stores/explorer.ts` - state management

### 3. Customize
- [ ] Change colors in `tailwind.config.js`
- [ ] Modify components styling
- [ ] Add new features (see README.md)

## Testing Workflow

### Basic Workflow Test:

1. **Create Folder**
   - Click "New Folder" button
   - Enter name: "Test Folder"
   - Click "Create Folder"
   - ✅ New folder appears in list

2. **Navigate to Folder**
   - Double-click "Test Folder"
   - ✅ Breadcrumb updates
   - ✅ Empty state shows

3. **Create File**
   - Click "New File" button
   - Enter name: "test"
   - Select type: ".txt"
   - Click "Create File"
   - ✅ File appears in list

4. **Search**
   - Type "test" in search box
   - ✅ Only matching items show

5. **Delete**
   - Select file (single click)
   - Click "Delete" button
   - Confirm
   - ✅ File removed

6. **Navigate Back**
   - Click "Home" in breadcrumb
   - ✅ Back to root folder

## API Endpoints Used

Frontend memanggil endpoints berikut:

```
GET    /api/folders/tree/all       → Sidebar tree
GET    /api/folders/:id/contents   → Folder contents
POST   /api/folders                → Create folder
POST   /api/files                  → Create file
DELETE /api/folders/:id            → Delete folder
DELETE /api/files/:id              → Delete file
```

## Monitoring

### Check API Calls:
1. Open Browser DevTools (F12)
2. Go to "Network" tab
3. Filter: XHR
4. Interact with UI
5. See API requests & responses

### Check Console Logs:
```javascript
// Errors akan muncul di console
console.error('API Error:', error)
```

## Performance

### Development Mode:
- ⚡ Hot Module Replacement (instant updates)
- 📦 No bundling (fast startup)

### Production Build:
```bash
npm run build
# Output: dist/ folder (optimized, minified)
```

## Ready to Code! 🎉

Sekarang Anda siap untuk:
- ✅ Explore aplikasi
- ✅ Modify components
- ✅ Add features
- ✅ Customize styling

**Need Help?**
- 📖 Read: `README.md`
- 🔍 Check: Vue DevTools
- 🐛 Debug: Browser Console

---

**Happy Coding! 🚀**

Next: Baca `README.md` untuk detailed documentation.
