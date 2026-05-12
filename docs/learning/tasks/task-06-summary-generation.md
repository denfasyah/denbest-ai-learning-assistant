# Task 06 — Summary Generation

**Phase:** Core AI  
**Priority:** MEDIUM-HIGH  
**Depends On:** Task-01, Task-02, Task-03, Task-05 (aiService.js harus sudah ada)  
**Agent:** alop  

---

## Objective
Mengimplementasikan fitur **AI Summary Generation** — user bisa generate ringkasan komprehensif dari dokumen dengan sekali klik. Summary disimpan ke database dan bisa di-regenerate.

---

## Scope

### Backend
- `summaryController.js` — handle generate & get summary
- `summaryService.js` — logic prompt building untuk summary
- Route summary terimplementasi penuh

### Frontend
- Refactor `ActionTab.jsx` — connect ke API nyata
- Buat `features/workspace/hooks/useSummary.js`
- Buat `features/workspace/services/summaryApi.js`
- Render markdown summary result

---

## Dependencies
- ✅ Task-05 selesai — `aiService.js` sudah ada dan berfungsi
- ✅ `useWorkspace()` tersedia (workspaceId, extractedText)
- ✅ `react-markdown` sudah terinstall (dari task-05)
- ✅ Summary model sudah ada (dari task-01)

---

## Files / Folder ALLOWED to Edit

**Backend:**
```
backend/src/controllers/summaryController.js    ← BUAT BARU
backend/src/services/summaryService.js          ← BUAT BARU
backend/src/routes/summaryRoutes.js             ← ISI implementasi
backend/src/utils/promptBuilder.js              ← TAMBAH summary prompt builder
```

**Frontend:**
```
frontend/src/features/workspace/components/ActionTab.jsx    ← REFACTOR
frontend/src/features/workspace/hooks/useSummary.js         ← BUAT BARU
frontend/src/features/workspace/services/summaryApi.js      ← BUAT BARU
```

## Files / Folder FORBIDDEN to Edit
```
frontend/src/features/workspace/hooks/useChat.js            ← Jangan ubah
frontend/src/features/workspace/components/ChatTab.jsx      ← Jangan ubah
backend/src/services/aiService.js                           ← Jangan ubah (hanya consume)
backend/src/services/chatService.js                         ← Jangan ubah
backend/src/models/
```

---

## Backend Requirements

### `promptBuilder.js` — Tambah Summary Prompt
```javascript
buildSummaryPrompt(extractedText):
// """
// Kamu adalah AI Learning Assistant. Buat ringkasan komprehensif dari dokumen berikut.
//
// FORMAT OUTPUT (gunakan Markdown):
// ## 📌 Ringkasan Utama
// [1-2 paragraf ringkasan keseluruhan]
//
// ## 🎯 Poin-Poin Kunci
// - [poin 1]
// - [poin 2]
// - [dst, minimal 5 poin]
//
// ## 💡 Konsep Penting
// **[Konsep 1]:** [penjelasan singkat]
// **[Konsep 2]:** [penjelasan singkat]
//
// ## 📖 Kesimpulan
// [1 paragraf kesimpulan]
//
// === DOKUMEN ===
// {extractedText}
// """
```

### `summaryService.js`
```javascript
// generateSummary(workspaceId, userId):
//   1. Cek apakah Summary sudah ada di DB (jangan regenerate jika sudah ada)
//      → Return existing jika ada (user harus explicitly klik "Regenerate")
//   2. Ambil Document.extractedText dari DB via workspaceId
//   3. Validasi extractedText tidak kosong
//   4. Build summary prompt
//   5. Call aiService.generateResponse(prompt)
//   6. Simpan ke Summary collection (upsert by workspaceId)
//   7. Log ke History: 'summary_generated'
//   8. Return summary content (Markdown string)

// getSummary(workspaceId, userId):
//   1. Find Summary by workspaceId
//   2. Return null jika belum ada (frontend handle state "belum generate")

// regenerateSummary(workspaceId, userId):
//   1. Delete existing summary
//   2. Call generateSummary()
```

### `summaryController.js`
```javascript
// generateSummary  → summaryService.generateSummary (atau regenerate)
// getSummary       → summaryService.getSummary
```

### Route Implementation
```javascript
// summaryRoutes.js (nested di workspaceRoutes):
GET  /:workspaceId/summary           → summaryController.getSummary
POST /:workspaceId/summary/generate  → summaryController.generateSummary
POST /:workspaceId/summary/regenerate → summaryController.regenerateSummary
```

---

## Frontend Requirements

### `summaryApi.js`
```javascript
getSummary(workspaceId)            // GET /workspaces/:id/summary
generateSummary(workspaceId)       // POST /workspaces/:id/summary/generate
regenerateSummary(workspaceId)     // POST /workspaces/:id/summary/regenerate
```

### `useSummary.js`
```javascript
// State:
//   summary: string | null    // Markdown content
//   isLoading: boolean         // fetch existing summary
//   isGenerating: boolean      // AI generating response
//   error: string | null
//   hasExisting: boolean       // apakah summary sudah ada di DB

// Actions:
//   loadSummary()              // Fetch existing summary on mount
//   generateSummary()          // Generate jika belum ada
//   regenerateSummary()        // Force regenerate

// Mount behavior:
//   useEffect → loadSummary() → jika ada, tampilkan; jika null, tampilkan "Generate" CTA
```

### `ActionTab.jsx` Refactor

**State Awal (Belum Generate):**
```
┌─────────────────────────────────────────────┐
│  ✨ AI Action                               │
│─────────────────────────────────────────────│
│                                             │
│     [Sparkles icon]                         │
│     Belum ada ringkasan untuk dokumen ini   │
│     Klik tombol untuk generate summary      │
│                                             │
│         [✨ Generate Summary]               │
└─────────────────────────────────────────────┘
```

**State Generating:**
```
┌─────────────────────────────────────────────┐
│  ✨ AI sedang membaca dokumen...            │
│  [animated progress bar]                    │
│  Estimasi: 10-30 detik                      │
└─────────────────────────────────────────────┘
```

**State Summary Ready:**
```
┌─────────────────────────────────────────────┐
│  📋 Ringkasan Dokumen    [🔄 Regenerate]    │
│  Generated: 12 Mei 2026                     │
│─────────────────────────────────────────────│
│  ## 📌 Ringkasan Utama                      │
│  Dokumen ini membahas...                    │
│                                             │
│  ## 🎯 Poin-Poin Kunci                      │
│  - Poin 1...                                │
│  - Poin 2...                                │
│                                             │
│  [📋 Copy to Clipboard]  [💾 Save to Notes] │
└─────────────────────────────────────────────┘
```

### Action Buttons
- **Copy to Clipboard** — copy summary text (plain text, strip markdown symbols)
- **Save to Notes** — placeholder untuk task-09 (tampilkan disabled dengan tooltip "Coming soon")
- **Regenerate** — konfirmasi dialog sebelum regenerate (mahal secara API)

---

## API Requirements

### GET Summary Response
```json
GET /api/v1/workspaces/:id/summary

// Jika sudah ada:
{ "success": true, "data": { "content": "## Ringkasan...", "generatedAt": "..." } }

// Jika belum ada:
{ "success": true, "data": null }
```

### POST Generate Response
```json
POST /api/v1/workspaces/:id/summary/generate

Response (success):
{ "success": true, "data": { "content": "## Ringkasan...", "generatedAt": "..." } }

Response (extractedText kosong):
{ "success": false, "message": "Document has no readable text to summarize." }
```

---

## State Management Requirements
- `useSummary` = local state (hanya di-consume ActionTab)
- Load existing summary saat mount (jangan auto-generate)
- `isGenerating` mencegah double-click "Generate"
- Summary di-cache di local state (tidak re-fetch setiap tab switch)

---

## Error Handling

### Backend
- `extractedText` kosong → 422: `"Document has no readable text to summarize"`
- AI timeout → 504: `"Summary generation timed out. Please try again."`
- Summary sudah ada → `generateSummary` return existing (jangan overwrite)
- Unauthorized workspace → 403

### Frontend
- Generate error → toast error + tombol Generate kembali enabled
- Regenerate → konfirmasi dialog dulu: "Regenerate akan menghapus summary lama. Lanjutkan?"
- Copy to clipboard → toast success: "Summary berhasil di-copy!"
- Error saat load → tampilkan retry button

---

## Routing Requirements
- `ActionTab` di-render oleh Outlet di path `/learning/workspace/:id/action`
- Tidak ada perubahan routing

---

## Acceptance Criteria
- [ ] Klik "Generate Summary" → AI generate berdasarkan isi dokumen
- [ ] Summary di-render sebagai Markdown (heading, list, bold)
- [ ] Summary tersimpan di MongoDB collection `summaries`
- [ ] Kembali ke ActionTab setelah pindah tab → summary masih ada (tidak di-generate ulang)
- [ ] Refresh halaman → summary masih ada (dari API)
- [ ] Klik "Regenerate" → konfirmasi → summary baru di-generate
- [ ] "Copy to Clipboard" berfungsi
- [ ] Dokumen tanpa teks (extractedText kosong) → error message jelas
- [ ] Loading state visible saat generating

---

## Manual Testing Checklist
- [ ] Upload PDF → buka ActionTab → klik "Generate Summary"
- [ ] Summary muncul dalam format Markdown yang proper
- [ ] Pindah ke ChatTab → kembali ke ActionTab → summary masih ada
- [ ] Refresh halaman → summary masih ada
- [ ] Klik "Regenerate" → dialog konfirmasi muncul → klik OK → summary baru
- [ ] Klik "Copy to Clipboard" → paste di text editor → teks ter-copy
- [ ] MongoDB: collection `summaries` terisi dengan content dan generatedAt
- [ ] MongoDB: collection `histories` punya record 'summary_generated'

---

## Expected Final Result
User bisa generate ringkasan komprehensif dari dokumen mereka dengan sekali klik. Summary disimpan di database, tidak perlu di-generate ulang setiap visit. ActionTab tidak lagi menggunakan data dummy. Fondasi prompt building yang solid siap digunakan untuk flashcard dan quiz generation.
