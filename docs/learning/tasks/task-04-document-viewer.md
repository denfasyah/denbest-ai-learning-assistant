# Task 04 — Document Viewer (ContentTab)

**Phase:** Foundation  
**Priority:** HIGH  
**Depends On:** Task-01, Task-02, Task-03  
**Agent:** alop  

---

## Objective
Mengimplementasikan `ContentTab` yang menampilkan dokumen asli (PDF/TXT/MD) dari backend secara real — menggantikan placeholder statis saat ini. User harus bisa membaca konten dokumen di panel kiri workspace.

---

## Scope

### Frontend Only
- Refactor `ContentTab.jsx` — tampilkan PDF dari URL backend
- Buat `DocumentViewer.jsx` — komponen wrapper untuk berbagai tipe file
- Handle PDF rendering menggunakan `react-pdf` atau iframe native
- Handle TXT/MD rendering (raw text atau markdown)
- Consume `useWorkspace()` context untuk mendapat `document.fileUrl` dan `document.fileType`
- Serve file PDF dari backend (static file serving)

### Backend (Minor)
- Pastikan `backend/uploads/` ter-serve sebagai static files
- Tambahkan security: verifikasi dokumen hanya bisa diakses oleh pemilik workspace

---

## Dependencies
- ✅ Task-03 selesai (WorkspaceLayout + WorkspaceContext tersedia)
- ✅ `useWorkspace()` hook tersedia
- ✅ `document.fileUrl` tersedia dari API
- ❌ `react-pdf` belum diinstall → pertimbangkan iframe native dulu (MVP)
- ❌ Static file serving belum dikonfigurasi di backend

---

## Files / Folder ALLOWED to Edit

**Frontend:**
```
frontend/src/features/workspace/components/ContentTab.jsx      ← REFACTOR
frontend/src/features/workspace/components/DocumentViewer.jsx  ← BUAT BARU
```

**Backend:**
```
backend/src/app.js      ← Tambah static file serving untuk /uploads
```

## Files / Folder FORBIDDEN to Edit
```
frontend/src/features/workspace/components/WorkspaceLayout.jsx  ← Sudah selesai di task-03
frontend/src/features/workspace/components/WorkspaceTabs.jsx    ← Sudah selesai di task-03
frontend/src/features/workspace/context/WorkspaceContext.jsx    ← Jangan ubah
frontend/src/features/workspace/services/workspaceApi.js        ← Jangan ubah
frontend/src/features/learning/                                 ← Jangan sentuh
backend/src/models/                                             ← Jangan ubah
backend/src/routes/                                             ← Jangan ubah
```

---

## UI Requirements

### ContentTab Layout
```
┌─────────────────────────────────────────────┐
│  [Document Title]              [File Info]  │
│─────────────────────────────────────────────│
│                                             │
│         DocumentViewer                      │
│   (PDF iframe / TXT display / MD render)    │
│                                             │
│─────────────────────────────────────────────│
│  Page X of Y    [Zoom -] [100%] [Zoom +]   │
└─────────────────────────────────────────────┘
```

### States yang Harus Di-handle
1. **Loading** — Skeleton saat URL belum ready
2. **Processing** — Dokumen masih diproses backend → tampilkan status dengan polling
3. **Failed** — `processingStatus === 'failed'` → pesan error + suggestion
4. **PDF Ready** — render iframe atau react-pdf
5. **TXT/MD Ready** — render plain text atau markdown

---

## DocumentViewer Component

```javascript
// Props:
// - fileUrl: string
// - fileType: 'pdf' | 'txt' | 'md'
// - title: string
// - processingStatus: 'pending' | 'processing' | 'completed' | 'failed'

// Render logic:
// - processingStatus !== 'completed' → ProcessingState
// - fileType === 'pdf' → <iframe> dengan fileUrl
// - fileType === 'txt' → <pre> atau <code> block
// - fileType === 'md' → render markdown (gunakan react-markdown atau simple display)
```

### PDF Rendering Strategy (MVP)
**Gunakan native `<iframe>`** dulu — lebih ringan dari react-pdf:
```html
<iframe
  src={fileUrl}
  title={title}
  className="w-full h-full rounded-2xl border border-white/10"
  style={{ minHeight: '600px' }}
/>
```

**Catatan:** `react-pdf` direkomendasikan untuk future enhancement (Task-10) karena support text selection, annotation, dan page-by-page rendering. Untuk MVP iframe sudah cukup.

### Processing State UI
```
┌─────────────────────────────────────────────┐
│         🔄 Sedang memproses dokumen         │
│    Ini mungkin memakan waktu beberapa saat  │
│                                             │
│         [████████░░] 70%                   │
└─────────────────────────────────────────────┘
```
- Poll `GET /api/v1/workspaces/:id` setiap 3 detik jika status `processing`
- Stop polling jika status berubah ke `completed` atau `failed`

### Failed State UI
```
┌─────────────────────────────────────────────┐
│         ⚠️ Dokumen Tidak Dapat Dibaca       │
│  PDF mungkin hanya berisi gambar/scan       │
│  Coba upload PDF yang berisi teks digital   │
│                                             │
│         [Upload Dokumen Baru]               │
└─────────────────────────────────────────────┘
```

---

## Backend Requirements

### Static File Serving (`app.js`)
```javascript
// Tambah SETELAH middleware setup, SEBELUM routes:
app.use('/uploads', authMiddlewareForStatic, express.static(path.join(__dirname, '../uploads')));

// SECURITY: authMiddlewareForStatic harus verify:
// 1. Token valid
// 2. File path belongs to requesting user's workspace
// MVP: cukup verify token valid saja dulu
```

### File URL Format
```
Backend menyimpan: fileName = 'uuid-original.pdf'
fileUrl di DB: '/uploads/uuid-original.pdf'
Frontend akses: `${VITE_API_BASE_URL}/uploads/uuid-original.pdf` dengan Bearer token
```

**Catatan Security:** Untuk MVP, gunakan signed URL atau Bearer token di header. Iframe tidak bisa attach header → gunakan query param token sebagai workaround MVP:
```
/uploads/file.pdf?token=JWT_TOKEN
```

---

## API Requirements
- Tidak ada endpoint baru di task ini
- Hanya gunakan `document.fileUrl` dari `WorkspaceContext`

---

## Routing Requirements
- Tidak ada perubahan routing
- `ContentTab` di-render oleh Outlet di path `/learning/workspace/:id/content`

---

## State Management Requirements
- Consume `useWorkspace()` untuk mendapat data dokumen
- Local state: `isPolling` (boolean untuk polling status)
- Polling interval: 3 detik, maksimal 10x percobaan (30 detik timeout)
- Cleanup polling di `useEffect` cleanup function

---

## Error Handling
- `processingStatus === 'failed'` → Failed state UI (jangan blank screen)
- Iframe gagal load → fallback text "Tidak dapat menampilkan dokumen. Coba download."
- Network error saat polling → stop polling, tampilkan pesan retry
- Selalu sediakan link download sebagai fallback: `<a href={fileUrl} download>`

---

## Acceptance Criteria
- [ ] PDF dari upload task-02 tampil di ContentTab (via iframe)
- [ ] TXT file tampil sebagai plain text
- [ ] Dokumen yang masih `processing` tampilkan status spinner
- [ ] Setelah processing selesai, viewer otomatis tampil dokumen
- [ ] `processingStatus === 'failed'` tampilkan error state dengan pesan yang jelas
- [ ] File tidak bisa diakses tanpa JWT token (backend protection)
- [ ] `useWorkspace()` context digunakan (bukan prop drilling)
- [ ] Tidak ada hardcoded data

---

## Manual Testing Checklist
- [ ] Upload PDF → masuk workspace → ContentTab menampilkan PDF
- [ ] Upload TXT → ContentTab menampilkan teks
- [ ] Simulate processing delay → spinner tampil → dokumen muncul setelah selesai
- [ ] Buka URL document langsung tanpa token → 401 dari backend
- [ ] Refresh halaman di ContentTab → dokumen masih tampil (dari Context)
- [ ] Console: tidak ada CORS error untuk file loading

---

## Expected Final Result
User bisa membaca dokumen asli yang mereka upload di panel kiri workspace. ContentTab tidak lagi menggunakan data dummy/hardcoded. PDF tampil via iframe, TXT/MD tampil sebagai text. Fondasi viewing layer siap sebelum AI features ditambahkan.
