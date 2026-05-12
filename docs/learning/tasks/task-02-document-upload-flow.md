# Task 02 — Document Upload Flow

**Phase:** Foundation  
**Priority:** CRITICAL  
**Depends On:** Task-01  
**Agent:** alop  

---

## Objective
Implementasi full upload pipeline: upload file dari frontend → backend parse PDF → simpan ke DB → buat workspace otomatis → frontend navigate ke workspace page menggunakan `workspaceId` nyata dari MongoDB.

---

## Scope

### Backend
- `workspaceController.js` — CRUD workspace
- `documentController.js` — upload, parse, simpan
- `documentService.js` — PDF parsing logic
- `historyService.js` — log upload activity
- Isi route handlers di `workspaceRoutes.js`

### Frontend
- Refactor `useLearningDocuments.js` → konsumsi API nyata
- Buat `features/learning/services/learningApi.js`
- Buat `features/learning/store/learningStore.js` (Zustand)
- Buat `services/axiosInstance.js` (shared)
- Update `LearningPage` untuk loading/error states

---

## Dependencies
- ✅ Task-01 selesai
- ✅ `authMiddleware` berfungsi
- ❌ `pdf-parse` belum diinstall → `npm install pdf-parse`
- ❌ `zustand` belum diinstall di frontend → `npm install zustand`

---

## Files / Folder ALLOWED to Edit

**Backend:**
```
backend/src/controllers/workspaceController.js  ← BUAT BARU
backend/src/controllers/documentController.js   ← BUAT BARU
backend/src/services/documentService.js         ← BUAT BARU
backend/src/services/historyService.js          ← BUAT BARU
backend/src/routes/workspaceRoutes.js           ← ISI implementasi
backend/package.json
```

**Frontend:**
```
frontend/src/features/learning/hooks/useLearningDocuments.js  ← REFACTOR
frontend/src/features/learning/services/learningApi.js        ← BUAT BARU
frontend/src/features/learning/store/learningStore.js         ← BUAT BARU
frontend/src/services/axiosInstance.js                        ← BUAT BARU
frontend/src/pages/learning/LearningPage.jsx                  ← Update states
```

## Files / Folder FORBIDDEN to Edit
```
frontend/src/features/learning/components/   ← UI components jangan diubah
frontend/src/features/workspace/             ← Belum waktunya
backend/src/models/                          ← Models dari task-01 tidak diubah
backend/src/routes/authRoutes.js
```

---

## Backend Requirements

### Upload Flow (End-to-End)
```
User pilih file → POST /api/v1/workspaces (buat workspace) → dapat workspaceId
  → POST /api/v1/workspaces/:id/documents (upload file) → multer save
  → documentService.parseAndExtractText() → simpan ke DB
  → historyService.logActivity('document_uploaded')
  → return { workspaceId, documentId }
  → Frontend navigate('/learning/workspace/' + workspaceId)
```

### `documentService.js`
- `parseAndExtractText(filePath, fileType)` — gunakan `pdf-parse` untuk PDF, `fs.readFileSync` untuk txt/md
- `chunkText(text, chunkSize=1000, overlap=100)` — siapkan untuk future RAG

### `workspaceController.js`
- `createWorkspace` — buat workspace baru, return `workspaceId`
- `getWorkspaces` — list workspace user (paginated, page/limit query params)
- `getWorkspace` — detail + verify ownership (user hanya bisa akses miliknya)
- `updateWorkspace` — rename title
- `deleteWorkspace` — hapus workspace + cascade delete dokumen/chat/flashcard/quiz + log history

### `documentController.js`
- `uploadDocument` — terima file multer, set status `processing`, parse text, update status `completed`/`failed`
- Jangan return `extractedText` di response (terlalu besar) — hanya return metadata

### `historyService.js`
- `logActivity(userId, workspaceId, workspaceTitle, actionType, metadata)`
- **PENTING:** Simpan `workspaceTitle` sebagai string snapshot (survive deletion)

---

## API Endpoints (Implemented)

```
POST   /api/v1/workspaces                        → createWorkspace
GET    /api/v1/workspaces?page=1&limit=10        → getWorkspaces
GET    /api/v1/workspaces/:id                    → getWorkspace
PATCH  /api/v1/workspaces/:id                    → updateWorkspace
DELETE /api/v1/workspaces/:id                    → deleteWorkspace
POST   /api/v1/workspaces/:id/documents          → uploadDocument (multer)
GET    /api/v1/workspaces/:id/documents          → getDocuments
```

---

## Frontend Requirements

### `axiosInstance.js` (Shared)
```javascript
// baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
// Request interceptor: attach Bearer token dari AuthContext
// Response interceptor: 401 → redirect /login
```

### `learningApi.js`
```javascript
getWorkspaces(page, limit)
createWorkspace(title)
deleteWorkspace(id)
renameWorkspace(id, title)
uploadDocument(workspaceId, file, onProgress)
```

### `learningStore.js` (Zustand)
```javascript
// State: workspaces[], isLoading, isUploading, uploadProgress, error, currentPage, totalPages
// Actions: fetchWorkspaces, uploadAndCreateWorkspace(file), deleteWorkspace(id), renameWorkspace(id,title), setPage
```

### `useLearningDocuments.js` Refactor
- Hapus semua hardcoded `useState([])` untuk documents
- Consume `learningStore` via Zustand
- `handleUpload` → `store.uploadAndCreateWorkspace(file)` → navigate ke workspace
- Pertahankan interface return values yang sama (backward compatible)
- Tambah `isUploading`, `isLoading`, `error` ke return value

---

## State Management Requirements
- `isUploading: true` selama proses upload + parsing
- `uploadProgress` via `onUploadProgress` axios callback
- Progress bar visible di LearningPage
- Setelah upload sukses: `fetchWorkspaces()` untuk refresh list
- Error → toast notification

---

## Error Handling

### Backend
- File bukan PDF/TXT/MD → 400: `"File type not supported"`
- File > 10MB → 400: `"File size exceeds 10MB limit"`
- PDF image-only (parse fail) → status `failed`, response error dengan suggestion
- Workspace bukan milik user → 403 Forbidden

### Frontend
- Network error → Toast: "Upload gagal. Periksa koneksi internet."
- Server error → Toast: "Upload gagal. Coba beberapa saat lagi."
- PDF tidak bisa diparse → Toast: "Dokumen tidak bisa dibaca..."
- Tampilkan tombol "Retry"

---

## Routing Requirements
- Tidak ada perubahan routing
- `DocumentCard` navigate ke `/learning/workspace/${workspaceId}` — workspaceId sekarang real MongoDB ID

---

## Acceptance Criteria
- [ ] Upload PDF dari LearningPage tersimpan di `backend/uploads/`
- [ ] Document record tersimpan di MongoDB dengan `extractedText` terisi
- [ ] Workspace dibuat otomatis saat upload
- [ ] Navigate ke `/learning/workspace/:workspaceId` setelah sukses
- [ ] List workspace di LearningPage dari API (bukan hardcoded)
- [ ] Delete workspace berfungsi (confirm + API)
- [ ] Rename berfungsi
- [ ] History record tercatat di DB
- [ ] Upload non-PDF/TXT/MD ditolak dengan error jelas
- [ ] Upload > 10MB ditolak
- [ ] Loading state visible

---

## Manual Testing Checklist
- [ ] Login → `/learning` → list kosong (bukan dummy)
- [ ] Upload PDF kecil → loading → navigate ke workspace
- [ ] Upload TXT → berhasil
- [ ] Upload DOCX → error toast
- [ ] Upload > 10MB → error toast
- [ ] Refresh `/learning` → list tetap ada
- [ ] Delete workspace → konfirmasi → hapus
- [ ] Rename → nama berubah
- [ ] MongoDB: `workspaces`, `documents`, `histories` terisi

---

## Expected Final Result
Upload pipeline berfungsi end-to-end. Data tersimpan di backend. Frontend tidak lagi pakai memory state. Workspace ID nyata dari MongoDB siap digunakan oleh task-03 dan seterusnya.
