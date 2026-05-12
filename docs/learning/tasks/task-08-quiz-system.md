# Task 08 — Quiz System

**Phase:** Advanced Testing  
**Priority:** MEDIUM  
**Depends On:** Task-01, Task-02, Task-03, Task-05 (aiService), Task-07 (flashcard JSON pattern)  
**Agent:** alop  

---

## Objective
Mengimplementasikan **Quiz System** end-to-end: AI generate soal pilihan ganda dari dokumen, user mengerjakan, submit jawaban, dan melihat hasil skor + penjelasan AI untuk setiap soal.

---

## Scope

### Backend
- `quizController.js` — generate, submit, get result
- `quizService.js` — prompt building (structured JSON output), scoring logic
- Route quiz terimplementasi penuh

### Frontend
- Refactor `QuizTab.jsx` — connect ke API nyata
- Buat `QuizResultTab.jsx` — halaman hasil detail
- Buat `features/workspace/hooks/useQuiz.js`
- Buat `features/workspace/services/quizApi.js`
- Tambah nested route untuk quiz result

---

## Dependencies
- ✅ Task-05 (aiService.js), Task-07 (JSON parsing pattern dari AI)
- ✅ Quiz model sudah ada (task-01): questions[], answers{}, score, status
- ✅ `useWorkspace()` tersedia
- ✅ QuizTab.jsx UI dasar sudah ada

---

## Files / Folder ALLOWED to Edit

**Backend:**
```
backend/src/controllers/quizController.js    ← BUAT BARU
backend/src/services/quizService.js          ← BUAT BARU
backend/src/routes/quizRoutes.js             ← ISI implementasi
backend/src/utils/promptBuilder.js           ← TAMBAH quiz prompt
```

**Frontend:**
```
frontend/src/features/workspace/components/QuizTab.jsx         ← REFACTOR
frontend/src/features/workspace/components/QuizResultTab.jsx   ← BUAT BARU
frontend/src/features/workspace/hooks/useQuiz.js               ← BUAT BARU
frontend/src/features/workspace/services/quizApi.js            ← BUAT BARU
frontend/src/App.jsx                                           ← Tambah quiz/:quizId route
```

## Files / Folder FORBIDDEN to Edit
```
frontend/src/features/workspace/components/FlashcardTab.jsx
frontend/src/features/workspace/components/ChatTab.jsx
frontend/src/features/workspace/components/ActionTab.jsx
backend/src/services/aiService.js
backend/src/models/
```

---

## Backend Requirements

### `promptBuilder.js` — Quiz Prompt (Strict JSON)
```javascript
buildQuizPrompt(extractedText, count = 5):
// """
// Buat {count} soal pilihan ganda dari dokumen berikut.
//
// ATURAN KETAT:
// - Setiap soal punya TEPAT 4 pilihan jawaban
// - Hanya 1 jawaban benar
// - correctAnswer harus IDENTIK dengan salah satu option
// - Sertakan penjelasan singkat untuk setiap jawaban benar
// - Variasikan tingkat kesulitan
//
// RETURN FORMAT (JSON array murni, TANPA teks lain apapun):
// [
//   {
//     "question": "Apa yang dimaksud dengan supervised learning?",
//     "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
//     "correctAnswer": "Opsi A",
//     "explanation": "Penjelasan mengapa Opsi A benar..."
//   }
// ]
//
// === DOKUMEN ===
// {extractedText}
// """
```

### `quizService.js`
```javascript
// generateQuiz(workspaceId, userId, count=5):
//   1. Ambil extractedText dari Document via workspaceId
//   2. Build prompt
//   3. Call aiService.generateResponse(prompt)
//   4. Parse JSON dari response:
//      - Coba JSON.parse(response) langsung
//      - Jika gagal: cari substring "[...]" dengan regex, lalu parse
//      - Jika gagal lagi: retry 1x
//      - Jika tetap gagal: throw Error('AI failed to generate valid quiz format')
//   5. Validasi setiap soal: correctAnswer harus ada di options[]
//   6. Simpan ke DB dengan status 'active'
//   7. Return { quizId, questions (tanpa correctAnswer!) }
//   ⚠️ PENTING: Jangan kirim correctAnswer ke frontend saat generate!

// submitQuiz(quizId, userId, answers):
//   answers: { "0": "Opsi A", "1": "Opsi C", ... }
//   1. Fetch quiz dari DB (status harus 'active', userId match)
//   2. Hitung score: bandingkan answers[i] dengan questions[i].correctAnswer
//   3. Update quiz: answers, score, status='completed', completedAt
//   4. Log History: 'quiz_completed' dengan metadata { score, totalQuestions }
//   5. Return { score, totalQuestions, questions dengan correctAnswer + explanation }

// getQuizzes(workspaceId, userId):
//   Return list quiz history (latest first)

// getQuizResult(quizId, userId):
//   Return quiz detail dengan questions + correctAnswer + explanation
//   Hanya bisa diakses jika status 'completed' DAN userId match
```

### `quizController.js`
```javascript
// generateQuiz  → quizService.generateQuiz
// getQuizzes    → quizService.getQuizzes
// submitQuiz    → quizService.submitQuiz
// getQuizResult → quizService.getQuizResult
```

### Route Implementation
```javascript
GET  /:workspaceId/quizzes                           → getQuizzes
POST /:workspaceId/quizzes/generate                  → generateQuiz
GET  /:workspaceId/quizzes/:quizId                   → getQuizResult
POST /:workspaceId/quizzes/:quizId/submit            → submitQuiz
```

---

## Frontend Requirements

### `quizApi.js`
```javascript
generateQuiz(workspaceId, count)          // POST /quizzes/generate
getQuizzes(workspaceId)                   // GET /quizzes
getQuizResult(workspaceId, quizId)        // GET /quizzes/:quizId
submitQuiz(workspaceId, quizId, answers)  // POST /quizzes/:quizId/submit
```

### `useQuiz.js`
```javascript
// State:
//   quizzes: []              // List quiz history
//   activeQuiz: null         // Quiz sedang dikerjakan { quizId, questions[] }
//   selectedAnswers: {}      // { questionIndex: selectedOption }
//   isGenerating: boolean
//   isSubmitting: boolean
//   isLoading: boolean
//   error: string | null

// Actions:
//   loadQuizzes()            // Fetch quiz history on mount
//   generateNewQuiz(count)   // Generate quiz baru
//   selectAnswer(idx, opt)   // Update selectedAnswers
//   submitQuiz()             // Validate all answered, submit, navigate ke result
//   retryQuiz()              // Reset state, generate baru
```

### `QuizTab.jsx` Refactor

**State: Quiz History (Default View)**
```
┌─────────────────────────────────────────────┐
│  🧠 Intelligence Quiz                       │
│─────────────────────────────────────────────│
│  Jumlah soal: [5 ▼] [10 ▼]  [✨ Generate] │
│─────────────────────────────────────────────│
│  Riwayat Quiz:                              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Quiz #1  Score: 8/10  12 Mei 2026  │   │
│  │                      [Lihat Detail] │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ Quiz #2  Score: 5/10  13 Mei 2026  │   │
│  │                      [Lihat Detail] │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Belum ada quiz - generate yang pertama]  │
└─────────────────────────────────────────────┘
```

**State: Active Quiz (Soal)**
```
┌─────────────────────────────────────────────┐
│  Soal 1 / 5                   [Batalkan]   │
│─────────────────────────────────────────────│
│  Apa fungsi label pada supervised learning? │
│                                             │
│  ○ Sebagai output jawaban                  │
│  ○ Sebagai warna dataset                   │
│  ● Sebagai animasi             ← selected  │
│  ○ Sebagai database                        │
│─────────────────────────────────────────────│
│  [← Prev]    1●2●3○4○5○    [Next →]        │
│                                             │
│              [Submit Quiz]                  │
└─────────────────────────────────────────────┘
```

**State: Generating**
```
│  ✨ AI sedang membuat soal...               │
│  Ini memakan waktu 10-20 detik             │
│  [progress dots animation]                  │
```

### `QuizResultTab.jsx` (Baru)
```
┌─────────────────────────────────────────────┐
│  📊 Hasil Quiz           [← Kembali]        │
│─────────────────────────────────────────────│
│  ┌───────────────────────────────────────┐ │
│  │        8                              │ │
│  │       ───  SKOR KAMU                  │ │
│  │       10                              │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Q1. ✅ Benar                               │
│  Apa fungsi label pada supervised learning? │
│  Jawabanmu: Sebagai output jawaban          │
│  💡 Penjelasan: Label berfungsi sebagai...  │
│                                             │
│  Q2. ❌ Salah                               │
│  Apa itu dataset?                           │
│  Jawabanmu: Sebagai animasi                 │
│  ✅ Jawaban benar: Kumpulan data training   │
│  💡 Penjelasan: Dataset adalah...           │
│                                             │
│         [🔄 Coba Quiz Baru]                 │
└─────────────────────────────────────────────┘
```

---

## Routing Requirements

### App.jsx — Tambah Quiz Result Route
```javascript
// Di dalam nested workspace routes:
<Route path="quiz" element={<QuizTab />} />
<Route path="quiz/:quizId" element={<QuizResultTab />} />
```

### Navigation Flow
```
/workspace/:id/quiz           → QuizTab (list history + generate baru)
  → Generate → Active quiz UI (masih di QuizTab, state berbeda)
  → Submit → navigate('/workspace/:id/quiz/:quizId')
/workspace/:id/quiz/:quizId   → QuizResultTab
  → "Coba Quiz Baru" → navigate('/workspace/:id/quiz') + generateNewQuiz()
```

---

## API Requirements

### Generate Quiz Response (Questions Only — NO correctAnswer)
```json
POST /api/v1/workspaces/:id/quizzes/generate
Body: { "count": 5 }

Response:
{
  "success": true,
  "data": {
    "quizId": "quiz_id",
    "questions": [
      {
        "index": 0,
        "question": "Apa fungsi label?",
        "options": ["A", "B", "C", "D"]
        // NO correctAnswer field!
      }
    ]
  }
}
```

### Submit Quiz Response (WITH correctAnswer + explanation)
```json
POST /api/v1/workspaces/:id/quizzes/:quizId/submit
Body: { "answers": { "0": "A", "1": "C" } }

Response:
{
  "success": true,
  "data": {
    "score": 4,
    "totalQuestions": 5,
    "percentage": 80,
    "questions": [
      {
        "index": 0,
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A",
        "userAnswer": "A",
        "isCorrect": true,
        "explanation": "..."
      }
    ]
  }
}
```

---

## State Management Requirements
- `useQuiz` = local state
- `activeQuiz` state → switch antara list view dan active quiz
- Navigate ke `/quiz/:quizId` hanya setelah submit berhasil
- `QuizResultTab` fetch result dari API menggunakan `quizId` dari URL params

---

## Error Handling

### Backend
- AI JSON parse gagal setelah retry → 500 dengan pesan yang jelas
- Quiz sudah di-submit (status !== 'active') → 400: "Quiz already submitted"
- `quizId` tidak milik user → 403
- Submit dengan soal belum semua dijawab → validasi di FRONTEND dulu

### Frontend
- Generate error → toast + tombol retry
- Submit jika ada soal belum dijawab → alert: "Jawab semua soal dulu (X soal belum dijawab)"
- Submit error → toast error, jangan navigate
- QuizResult fetch error → "Hasil tidak ditemukan" + link kembali ke quiz list

---

## Acceptance Criteria
- [ ] Generate 5 soal quiz dari dokumen, disimpan di MongoDB
- [ ] Soal tampil satu per satu dengan 4 pilihan jawaban
- [ ] Submit quiz → navigate ke `/quiz/:quizId` dengan hasil
- [ ] QuizResultTab menampilkan skor, jawaban benar/salah, dan penjelasan AI
- [ ] Quiz history tampil di QuizTab (dari API)
- [ ] "Lihat Detail" pada quiz history → navigate ke QuizResultTab
- [ ] Submit dengan soal belum dijawab → validasi + alert
- [ ] correctAnswer tidak pernah ter-expose sebelum submit
- [ ] History record tercatat setelah quiz selesai

---

## Manual Testing Checklist
- [ ] Upload dokumen → buka Quiz tab → generate 5 soal
- [ ] Soal muncul dengan 4 pilihan yang relevan
- [ ] Pilih semua jawaban → submit → navigate ke result
- [ ] Result tampilkan skor, benar/salah per soal + penjelasan
- [ ] Kembali ke Quiz tab → history quiz tampil
- [ ] Klik "Lihat Detail" di history → result tampil kembali
- [ ] Coba submit soal yang belum dijawab → alert muncul
- [ ] MongoDB: `quizzes` terisi dengan questions, answers, score
- [ ] MongoDB: `histories` punya record 'quiz_completed'
- [ ] URL `/quiz/:quizId` bisa di-copy-paste → tetap tampilkan result

---

## Expected Final Result
Quiz system berfungsi penuh: generate → kerjakan → submit → lihat hasil. Correctness dijaga (jawaban benar tidak bocor sebelum submit). History quiz tersimpan dan bisa diakses kembali. Deep-link ke quiz result berfungsi.
