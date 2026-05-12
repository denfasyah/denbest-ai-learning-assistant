# Task 07 — Flashcard System

**Phase:** Learning Tools  
**Priority:** MEDIUM  
**Depends On:** Task-01, Task-02, Task-03, Task-05 (aiService), Task-06 (promptBuilder pattern)  
**Agent:** alop  

---

## Objective
Mengimplementasikan **Flashcard System** end-to-end: AI generate flashcard dari dokumen, user berlatih dengan mekanisme flip card, dan progress di-track dengan sistem rating sederhana.

---

## Scope

### Backend
- `flashcardController.js` — generate, list, review
- `flashcardService.js` — prompt building untuk flashcard, SRS logic sederhana
- Route flashcard terimplementasi penuh

### Frontend
- Refactor `FlashcardTab.jsx` — connect ke API nyata
- Buat `features/workspace/hooks/useFlashcard.js`
- Buat `features/workspace/services/flashcardApi.js`
- Implement card flip animation
- Implement progress tracking UI

---

## Dependencies
- ✅ Task-05 (aiService.js), Task-06 (promptBuilder pattern)
- ✅ Flashcard model sudah ada (task-01): `frontText`, `backText`, `difficulty`, `nextReviewDate`, `reviewCount`
- ✅ `useWorkspace()` tersedia

---

## Files / Folder ALLOWED to Edit

**Backend:**
```
backend/src/controllers/flashcardController.js  ← BUAT BARU
backend/src/services/flashcardService.js        ← BUAT BARU
backend/src/routes/flashcardRoutes.js           ← ISI implementasi
backend/src/utils/promptBuilder.js              ← TAMBAH flashcard prompt
```

**Frontend:**
```
frontend/src/features/workspace/components/FlashcardTab.jsx    ← REFACTOR
frontend/src/features/workspace/hooks/useFlashcard.js          ← BUAT BARU
frontend/src/features/workspace/services/flashcardApi.js       ← BUAT BARU
```

## Files / Folder FORBIDDEN to Edit
```
frontend/src/features/workspace/components/ChatTab.jsx
frontend/src/features/workspace/components/ActionTab.jsx
backend/src/services/aiService.js
backend/src/services/chatService.js
backend/src/services/summaryService.js
backend/src/models/
```

---

## Backend Requirements

### `promptBuilder.js` — Flashcard Prompt
```javascript
buildFlashcardPrompt(extractedText, count = 10):
// """
// Buat {count} flashcard dari dokumen berikut.
//
// ATURAN:
// - Fokus pada konsep penting, definisi, rumus, dan fakta kunci
// - frontText: pertanyaan singkat dan jelas (maks 100 karakter)
// - backText: jawaban lengkap namun ringkas (maks 300 karakter)
// - Variasikan kesulitan: campuran easy/medium/hard
//
// RETURN FORMAT (JSON array murni, tanpa penjelasan tambahan):
// [
//   { "front": "Apa itu supervised learning?", "back": "...", "difficulty": "easy" },
//   { "front": "...", "back": "...", "difficulty": "medium" }
// ]
//
// === DOKUMEN ===
// {extractedText}
// """
```

### `flashcardService.js`
```javascript
// generateFlashcards(workspaceId, userId, count=10):
//   1. Cek: apakah flashcard sudah ada (jumlah > 0) → return existing
//   2. Ambil extractedText dari Document
//   3. Build prompt dengan count parameter
//   4. Call aiService.generateResponse(prompt)
//   5. PARSE JSON dari response AI:
//      - Gunakan JSON.parse(response) dalam try-catch
//      - Jika parse gagal → retry 1x dengan cleaner prompt
//      - Jika gagal lagi → throw error
//   6. Simpan semua flashcard ke DB (bulk insert)
//   7. Log History: 'flashcard_generated'
//   8. Return flashcards array

// getFlashcards(workspaceId, userId):
//   Return all flashcards for this workspace, sorted by nextReviewDate

// reviewFlashcard(flashcardId, userId, rating):
//   rating: 'easy' | 'medium' | 'hard'
//   SRS Logic (sederhana):
//     - easy   → nextReviewDate = +7 hari, reviewCount++
//     - medium → nextReviewDate = +3 hari, reviewCount++
//     - hard   → nextReviewDate = +1 hari, reviewCount++
//   Update flashcard di DB

// regenerateFlashcards(workspaceId, userId, count):
//   1. Delete existing flashcards for workspace
//   2. Call generateFlashcards()
```

### `flashcardController.js`
```javascript
// generateFlashcards  → flashcardService.generateFlashcards
// getFlashcards       → flashcardService.getFlashcards
// reviewFlashcard     → flashcardService.reviewFlashcard
// regenerateFlashcards → flashcardService.regenerateFlashcards
```

### Route Implementation
```javascript
GET  /:workspaceId/flashcards                              → getFlashcards
POST /:workspaceId/flashcards/generate                     → generateFlashcards
POST /:workspaceId/flashcards/regenerate                   → regenerateFlashcards
PATCH /:workspaceId/flashcards/:flashcardId/review         → reviewFlashcard
```

---

## Frontend Requirements

### `flashcardApi.js`
```javascript
getFlashcards(workspaceId)
generateFlashcards(workspaceId, count)
regenerateFlashcards(workspaceId, count)
reviewFlashcard(workspaceId, flashcardId, rating)  // rating: 'easy'|'medium'|'hard'
```

### `useFlashcard.js`
```javascript
// State:
//   flashcards: []             // All flashcards
//   currentIndex: number       // Index kartu yang sedang ditampilkan
//   isFlipped: boolean         // Apakah kartu sedang flipped (tampilkan jawaban)
//   isLoading: boolean
//   isGenerating: boolean
//   progress: { reviewed, total, easy, medium, hard }

// Actions:
//   loadFlashcards()           // Fetch dari API on mount
//   generateFlashcards(count)  // Generate via AI
//   flipCard()                 // Toggle isFlipped
//   nextCard()                 // isFlipped=false, currentIndex++
//   prevCard()                 // isFlipped=false, currentIndex--
//   rateCard(rating)           // Call reviewFlashcard API, nextCard()
//   shuffleCards()             // Acak urutan flashcards
```

### `FlashcardTab.jsx` Refactor

**State: Belum Ada Flashcard**
```
┌─────────────────────────────────────────────┐
│  🃏 Flashcard                               │
│─────────────────────────────────────────────│
│                                             │
│     [Card Stack icon]                       │
│     Belum ada flashcard untuk dokumen ini   │
│                                             │
│     Jumlah kartu: [10 ▼]                   │
│         [✨ Generate Flashcards]            │
└─────────────────────────────────────────────┘
```

**State: Flashcard Mode**
```
┌─────────────────────────────────────────────┐
│  Kartu 3 / 10    [🔀 Shuffle] [🔄 Regen]   │
│  Progress: ████████░░ 80%                  │
│─────────────────────────────────────────────│
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │  Apa itu supervised learning?       │   │ ← FRONT
│  │                                     │   │
│  │  [Tap to flip / Click to reveal]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│         [👁 Lihat Jawaban]                  │
│─────────────────────────────────────────────│
│  [← Prev]          [Next →]                │
└─────────────────────────────────────────────┘
```

**State: Flipped (Jawaban Tampil)**
```
│  ┌─────────────────────────────────────┐   │
│  │  ✅ Jawaban:                        │   │
│  │                                     │   │
│  │  Supervised learning adalah metode  │   │ ← BACK
│  │  machine learning yang...           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Seberapa mudah kamu mengingat ini?        │
│  [😰 Hard]  [😊 Good]  [😎 Easy]          │
```

### Card Flip Animation (CSS)
```css
/* Gunakan CSS 3D transform perspective */
.card-container { perspective: 1000px; }
.card {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.card.flipped { transform: rotateY(180deg); }
.card-front, .card-back { backface-visibility: hidden; }
.card-back { transform: rotateY(180deg); }
```

---

## API Requirements

### Generate Flashcards
```json
POST /api/v1/workspaces/:id/flashcards/generate
Body: { "count": 10 }

Response:
{
  "success": true,
  "data": [
    { "_id": "...", "frontText": "...", "backText": "...", "difficulty": "easy" }
  ],
  "message": "10 flashcards generated successfully"
}
```

### Review Flashcard
```json
PATCH /api/v1/workspaces/:id/flashcards/:flashcardId/review
Body: { "rating": "easy" }

Response:
{
  "success": true,
  "data": { "_id": "...", "nextReviewDate": "...", "reviewCount": 3 }
}
```

---

## State Management Requirements
- `useFlashcard` = local state (hanya FlashcardTab yang consume)
- Setelah `rateCard()` → otomatis `nextCard()` tanpa re-fetch semua
- `shuffle` → gunakan Fisher-Yates algorithm di frontend (bukan re-fetch)
- Track review progress di local state

---

## Error Handling

### Backend
- AI return JSON tidak valid → retry 1x → jika gagal throw error 500
- extractedText kosong → 422
- Timeout → 504

### Frontend
- Generate error → toast error + reset isGenerating
- Review error → toast (non-blocking, continue to next card)
- Kartu sudah habis (currentIndex >= total) → tampilkan "Sesi selesai!" screen dengan summary:
  ```
  Sesi Selesai! 🎉
  Total: 10 kartu
  Easy: 5 | Good: 3 | Hard: 2
  [Ulangi Lagi] [Lihat Semua Kartu]
  ```

---

## Routing Requirements
- `FlashcardTab` di-render oleh Outlet di path `/learning/workspace/:id/flashcards`

---

## Acceptance Criteria
- [ ] Generate flashcard → AI membuat 10 kartu (atau sesuai pilihan) dari dokumen
- [ ] Kartu tersimpan di MongoDB
- [ ] Refresh halaman → kartu masih ada (dari API)
- [ ] Flip animation berfungsi (CSS 3D transform)
- [ ] Klik "Hard/Good/Easy" → kartu berikutnya muncul
- [ ] Rating tersimpan ke backend (nextReviewDate ter-update)
- [ ] Progress bar update sesuai jumlah kartu yang sudah di-review
- [ ] Shuffle button mengacak urutan kartu
- [ ] Sesi selesai screen tampil setelah semua kartu di-review

---

## Manual Testing Checklist
- [ ] Upload dokumen → buka Flashcard tab → klik Generate (count: 10)
- [ ] 10 kartu muncul, konten relevan dengan dokumen
- [ ] Klik kartu / "Lihat Jawaban" → flip animation smooth
- [ ] Klik "Easy" → kartu berikutnya, progress bar update
- [ ] Klik "Prev" → kembali ke kartu sebelumnya
- [ ] Klik "Shuffle" → urutan kartu berubah
- [ ] MongoDB: collection `flashcards` terisi
- [ ] `nextReviewDate` ter-update setelah review
- [ ] Refresh halaman → flashcard masih ada

---

## Expected Final Result
Flashcard system berfungsi penuh end-to-end. AI menghasilkan flashcard dari konten dokumen. User bisa berlatih dengan flip animation yang smooth. Progress di-track dan tersimpan ke database. SRS foundation terpasang untuk future enhancement.
