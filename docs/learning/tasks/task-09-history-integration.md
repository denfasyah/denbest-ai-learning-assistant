# Task 09 — History Integration

**Phase:** History & Tracking  
**Priority:** MEDIUM  
**Depends On:** Task-01 (History model), Task-02 (historyService), Task-05 to Task-08  
**Agent:** alop  

---

## Objective
Mengimplementasikan **History Page** yang menampilkan seluruh riwayat aktivitas user secara real dari database — menggantikan hardcoded data. History bersifat "soft" (tetap ada meski dokumen/workspace dihapus).

---

## Scope

### Backend
- `historyController.js` — GET history dengan filter & pagination
- Pastikan semua service (upload, summary, flashcard, quiz) sudah call `historyService.logActivity()`

### Frontend
- Refactor `HistoryPage.jsx` dan `HistoryCard.jsx` — consume API nyata
- Buat `features/history/services/historyApi.js`
- Buat `features/history/store/historyStore.js` (Zustand)
- Implement filter by action type dan pagination

---

## Dependencies
- ✅ Task-02 (historyService.logActivity ada dan dipanggil di upload)
- ✅ Task-05 (chat log), Task-06 (summary log), Task-07 (flashcard log), Task-08 (quiz log)
- ✅ History model sudah ada (task-01)

---

## Files / Folder ALLOWED to Edit

**Backend:**
```
backend/src/controllers/historyController.js    ← BUAT BARU
backend/src/routes/historyRoutes.js             ← ISI implementasi
backend/src/services/historyService.js          ← VERIFIKASI semua log calls ada
```

**Frontend:**
```
frontend/src/pages/history/HistoryPage.jsx                  ← REFACTOR
frontend/src/features/history/components/HistoryCard.jsx    ← REFACTOR
frontend/src/features/history/constants/historyData.js      ← DELETE atau kosongkan
frontend/src/features/history/services/historyApi.js        ← BUAT BARU
frontend/src/features/history/store/historyStore.js         ← BUAT BARU
```

## Files / Folder FORBIDDEN to Edit
```
frontend/src/features/workspace/       ← Semua workspace features selesai di task sebelumnya
backend/src/services/chatService.js    ← Hanya verifikasi, jangan ubah logic
backend/src/services/quizService.js    ← Sama
backend/src/models/History.js          ← Jangan ubah schema
```

---

## Backend Requirements

### Verifikasi `historyService.js`
Pastikan semua action types sudah ter-log di service masing-masing:
```
✅ workspace_created   → workspaceController.createWorkspace
✅ document_uploaded   → documentController.uploadDocument
⚠️ chat_sent          → chatService.sendMessage (verifikasi sudah ada)
⚠️ summary_generated  → summaryService.generateSummary (verifikasi)
⚠️ flashcard_generated → flashcardService.generateFlashcards (verifikasi)
⚠️ quiz_completed      → quizService.submitQuiz (verifikasi)
```

Jika ada yang belum, tambahkan `historyService.logActivity()` call di service yang bersangkutan.

### `historyController.js`
```javascript
// getHistory(req, res):
//   Query params:
//     - page (default: 1)
//     - limit (default: 20)
//     - type (optional: filter by actionType)
//     - workspaceId (optional: filter by workspace)
//
//   Logic:
//   1. Build query: { userId: req.user.id, ...filters }
//   2. Count total matching documents
//   3. Find with pagination: .sort({ createdAt: -1 }).skip().limit()
//   4. Return paginated response
//
//   Response shape:
//   {
//     success: true,
//     data: [
//       {
//         id, actionType, workspaceTitle,
//         workspaceId (nullable),         ← untuk deep link ke workspace
//         metadata, createdAt
//       }
//     ],
//     pagination: { page, limit, total, totalPages }
//   }
```

### Route Implementation
```javascript
// historyRoutes.js:
GET /api/v1/history          → historyController.getHistory
```

---

## Frontend Requirements

### `historyApi.js`
```javascript
getHistory({ page, limit, type, workspaceId })  // GET /history
```

### `historyStore.js` (Zustand)
```javascript
// State:
//   histories: []
//   isLoading: boolean
//   error: string | null
//   currentPage: number
//   totalPages: number
//   activeFilter: string  // 'all' | 'workspace_created' | 'quiz_completed' | ...

// Actions:
//   fetchHistory(page, filter)
//   setFilter(type)        // Reset ke page 1 + refetch
//   setPage(page)
```

### `HistoryPage.jsx` Refactor

**Layout:**
```
┌─────────────────────────────────────────────┐
│  📋 Activity History                        │
│─────────────────────────────────────────────│
│  Filter: [Semua▼] [Upload] [Quiz] [Summary] │
│─────────────────────────────────────────────│
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📂 Workspace Created                │   │
│  │ Machine Learning Fundamentals.pdf   │   │
│  │ 12 Mei 2026 • 14:30               │   │
│  │                   [Buka Workspace]  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🧠 Quiz Completed                   │   │
│  │ Machine Learning Fundamentals.pdf   │   │
│  │ Score: 8/10                        │   │
│  │ 12 Mei 2026 • 15:00               │   │
│  │                   [Lihat Hasil]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ⚠️ Fisika Bab 1.pdf (Deleted)      │   │ ← Soft history
│  │ ✨ Summary Generated                │   │
│  │ 10 Mei 2026 • 09:15               │   │
│  │            [Workspace Unavailable] │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [← Prev]   Page 1 / 5   [Next →]          │
└─────────────────────────────────────────────┘
```

### `HistoryCard.jsx` Refactor

**Props:**
```javascript
{
  actionType,       // untuk icon & label
  workspaceTitle,   // nama workspace (snapshot)
  workspaceId,      // nullable (null jika workspace deleted)
  metadata,         // { score, totalQuestions, quizId, ... }
  createdAt
}
```

**Conditional CTA Button:**
```javascript
// workspace_created → [Buka Workspace] → navigate ke /learning/workspace/:id
// document_uploaded → [Buka Workspace]
// quiz_completed    → [Lihat Hasil] → navigate ke /learning/workspace/:id/quiz/:quizId (dari metadata.quizId)
// summary_generated → [Lihat Summary] → navigate ke /learning/workspace/:id/action
// flashcard_generated → [Latihan Flashcard] → navigate ke /learning/workspace/:id/flashcards
// chat_sent        → [Lanjutkan Chat] → navigate ke /learning/workspace/:id/chat
//
// Jika workspaceId === null → tampilkan badge "Workspace Deleted" + disable button
```

**Action Type → Icon & Label Mapping:**
```javascript
const ACTION_CONFIG = {
  workspace_created:   { icon: FolderPlus,  label: 'Workspace Dibuat',       color: 'indigo' },
  document_uploaded:   { icon: Upload,      label: 'Dokumen Diupload',       color: 'blue' },
  chat_sent:           { icon: MessageCircle, label: 'Chat AI',              color: 'violet' },
  summary_generated:   { icon: Sparkles,    label: 'Summary Dibuat',         color: 'amber' },
  flashcard_generated: { icon: Layers3,     label: 'Flashcard Dibuat',       color: 'emerald' },
  quiz_completed:      { icon: BrainCircuit, label: 'Quiz Selesai',          color: 'rose' },
};
```

---

## Soft History Design

### Saat Workspace Deleted
Ketika `workspaceController.deleteWorkspace()` dipanggil:
1. Simpan `workspaceTitle` sebagai string sebelum delete (sudah ada di historyService)
2. Set `workspaceId` field di history yang akan datang: JANGAN null-kan existing records
3. Setelah workspace dihapus, query history masih mereturn record dengan `workspaceTitle` string, tapi `workspaceId` reference akan gagal populate → handle di controller: jika workspace tidak exist, set `workspaceId: null` di response

**Controller Logic:**
```javascript
// Setelah fetch histories, untuk setiap item:
// Coba populate workspace → jika gagal (workspace deleted):
//   { ...history, workspaceId: null, workspaceTitle: history.workspaceTitle }
// Jika sukses:
//   { ...history, workspaceId: history.workspaceId }
```

---

## API Requirements

```json
GET /api/v1/history?page=1&limit=20&type=quiz_completed

Response:
{
  "success": true,
  "data": [
    {
      "id": "...",
      "actionType": "quiz_completed",
      "workspaceTitle": "Machine Learning Fundamentals.pdf",
      "workspaceId": "ws_id_or_null",
      "metadata": { "score": 8, "totalQuestions": 10, "quizId": "quiz_id" },
      "createdAt": "2026-05-12T..."
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
}
```

---

## State Management Requirements
- Zustand store untuk history (di-share dengan future Dashboard widget)
- Filter change → reset page ke 1 → refetch
- Infinite scroll ATAU traditional pagination (pilih pagination untuk MVP)
- Data di-cache di store — tidak perlu re-fetch jika sudah ada

---

## Error Handling
- API error → toast + retry button di tengah halaman
- Empty state (belum ada aktivitas) → empty state UI yang friendly:
  ```
  📭 Belum ada aktivitas
  Mulai dengan upload dokumen dan berlatih!
  [Upload Dokumen →]
  ```
- Workspace deleted → disabled button + tooltip "Workspace telah dihapus"

---

## Routing Requirements
- Tidak ada perubahan routing
- Navigasi dari HistoryCard menggunakan `navigate()` ke URL yang sesuai

---

## Acceptance Criteria
- [ ] HistoryPage menampilkan aktivitas real dari API (bukan hardcoded)
- [ ] Setiap action type tampil dengan icon dan label yang tepat
- [ ] Filter by type berfungsi (quiz_completed, summary_generated, dll)
- [ ] Pagination berfungsi
- [ ] "Buka Workspace" navigate ke workspace yang benar
- [ ] "Lihat Hasil" navigate ke quiz result yang benar
- [ ] Workspace yang sudah dihapus → badge "Deleted" + button disabled
- [ ] `workspaceTitle` tetap tampil meski workspace dihapus (soft history)
- [ ] Empty state tampil jika belum ada aktivitas

---

## Manual Testing Checklist
- [ ] Login → `/history` → list aktivitas dari semua task sebelumnya
- [ ] Upload dokumen → history record 'document_uploaded' muncul
- [ ] Generate quiz → submit → history record 'quiz_completed' muncul
- [ ] Filter "Quiz" → hanya tampil quiz records
- [ ] Klik "Lihat Hasil" pada quiz history → navigate ke quiz result
- [ ] Delete workspace → kembali ke history → record masih ada dengan "(Deleted)" badge
- [ ] Pagination: jika ada > 20 records → next button berfungsi

---

## Expected Final Result
HistoryPage menjadi audit trail yang lengkap dan bisa diandalkan. Soft history berfungsi — data historis tidak hilang meski workspace dihapus. Semua CTA button di history card mengarah ke lokasi yang tepat. Siap untuk integrasi dashboard widget di masa depan.
