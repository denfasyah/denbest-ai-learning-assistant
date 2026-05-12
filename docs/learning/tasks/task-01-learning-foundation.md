# Task 01 — Learning Foundation (Backend Models, DB Schema & API Skeleton)

**Phase:** Foundation  
**Priority:** CRITICAL — Semua task lain bergantung pada task ini  
**Estimated Effort:** Medium  
**Agent:** alop  

---

## 🚨 Architecture Review & Flaw Analysis

Sebelum implementasi, ada beberapa **architecture flaw** dari planning yang wajib dipahami dan dikoreksi:

### Flaw 1: Inkonsistensi Database Strategy
- `planning.md` menggunakan **MongoDB** (Mongoose)
- `learning-workspace.md` menggunakan **PostgreSQL** (relational schema)
- `architecture.md` menyebut **MongoDB**
- **Keputusan:** Gunakan **MongoDB** sesuai dengan stack yang sudah exist (`backend/src/models/User.js` menggunakan Mongoose, `app.js` sudah connect Mongoose).

### Flaw 2: DocumentId ≠ WorkspaceId
- `DocumentCard.jsx` (line 86) navigate ke `/learning/workspace/${document.id}` — menggunakan `document.id` sebagai `workspaceId`.
- Ini **salah secara arsitektur**. `Workspace` dan `Document` adalah entitas berbeda. 1 workspace = 1+ documents di masa depan.
- **Keputusan:** Saat user upload dokumen, backend **otomatis membuat workspace** dan mereturn `workspaceId`. Frontend navigate menggunakan `workspaceId` tersebut.

### Flaw 3: Routing Workspace (Flat vs Nested)
- `App.jsx` menggunakan flat routes: `/learning/workspace/:id` dan `/learning/workspace/:id/:tab`
- `WorkspacePage.jsx` menggunakan `useParams().tab` dan `useState` untuk manage active tab — ini **anti-pattern**.
- **Keputusan:** Task-03 akan refactor ke **nested routes** (`<Outlet />`). Task ini cukup menyiapkan fondasi data.

### Flaw 4: State Hanya di Memory (No Persistence)
- `useLearningDocuments.js` menyimpan dokumen di `useState` — hilang saat refresh.
- **Keputusan:** Task ini membangun backend real, lalu task-02 menghubungkan frontend ke backend.

---

## Objective
Membangun **fondasi data layer** yang menjadi tulang punggung seluruh fitur Learning Workspace:
1. MongoDB schemas untuk semua entitas utama
2. Backend route skeleton (tanpa AI logic)
3. Middleware dasar (auth, upload, error)
4. Backend terhubung ke MongoDB Atlas/Local

---

## Scope
- Backend **ONLY** — tidak ada perubahan frontend
- Buat Mongoose models: `Workspace`, `Document`, `AiConversation`, `Message`, `Summary`, `Flashcard`, `Quiz`, `History`
- Buat route files skeleton dengan placeholder controllers
- Pastikan semua route ter-register di `app.js`
- Setup Multer untuk file upload middleware
- Verifikasi koneksi MongoDB

---

## Dependencies
- ✅ Node.js & Express sudah berjalan (`backend/src/app.js`)
- ✅ Auth route sudah ada (`authRoutes.js`)
- ✅ User model sudah ada (`User.js`)
- ❌ Belum ada model Workspace, Document, dll.
- ❌ Belum ada Multer setup
- ❌ Belum ada workspace/document routes

---

## Files / Folder ALLOWED to Edit
```
backend/src/models/          ← Buat semua model baru di sini
backend/src/routes/          ← Buat skeleton route files
backend/src/controllers/     ← Buat placeholder controller files
backend/src/middlewares/     ← Buat uploadMiddleware.js
backend/src/config/          ← Pastikan db.js ada dan benar
backend/src/app.js           ← Register routes baru
backend/.env                 ← Tambah MONGODB_URI jika belum
backend/package.json         ← Tambah dependencies baru jika perlu
```

## Files / Folder FORBIDDEN to Edit
```
frontend/                    ← JANGAN SENTUH
backend/src/models/User.js   ← Jangan ubah schema user yang existing
backend/src/routes/authRoutes.js ← Jangan ubah auth routes
```

---

## Backend Requirements

### 1. Mongoose Models

#### `Workspace.js`
```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### `Document.js`
```javascript
{
  _id: ObjectId,
  workspaceId: { type: ObjectId, ref: 'Workspace', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  originalName: String,       // nama file asli dari user
  fileName: String,           // nama file di storage (uuid-based)
  fileUrl: String,            // path/URL untuk akses file
  fileType: String,           // 'pdf' | 'txt' | 'md'
  sizeBytes: Number,
  extractedText: String,      // hasil parse PDF
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### `AiConversation.js`
```javascript
{
  _id: ObjectId,
  workspaceId: { type: ObjectId, ref: 'Workspace', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Conversation' },
  createdAt: Date
}
```

#### `Message.js`
```javascript
{
  _id: ObjectId,
  conversationId: { type: ObjectId, ref: 'AiConversation', required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  tokensUsed: Number,
  createdAt: Date
}
```

#### `Summary.js`
```javascript
{
  _id: ObjectId,
  workspaceId: { type: ObjectId, ref: 'Workspace', required: true },
  content: String,            // Markdown format
  generatedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### `Flashcard.js`
```javascript
{
  _id: ObjectId,
  workspaceId: { type: ObjectId, ref: 'Workspace', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  frontText: { type: String, required: true },
  backText: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  nextReviewDate: Date,
  reviewCount: { type: Number, default: 0 },
  createdAt: Date
}
```

#### `Quiz.js`
```javascript
{
  _id: ObjectId,
  workspaceId: { type: ObjectId, ref: 'Workspace', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String       // AI explanation for answer
  }],
  answers: Object,            // { questionIndex: selectedAnswer }
  score: Number,
  totalQuestions: Number,
  status: { type: String, enum: ['draft', 'active', 'completed'], default: 'draft' },
  completedAt: Date,
  createdAt: Date
}
```

#### `History.js`
```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  workspaceId: { type: ObjectId, ref: 'Workspace' },  // nullable (soft delete)
  workspaceTitle: String,     // snapshot title (survive deletion)
  actionType: {
    type: String,
    enum: ['workspace_created', 'document_uploaded', 'chat_sent', 'summary_generated', 'flashcard_generated', 'quiz_completed'],
    required: true
  },
  metadata: Object,           // flexible JSON untuk data tambahan
  createdAt: Date
}
```

### 2. Route Skeletons

Buat file route dengan handler placeholder (`res.status(501).json({ message: 'Not implemented' })`):

```
backend/src/routes/
  workspaceRoutes.js    → /api/v1/workspaces
  documentRoutes.js     → /api/v1/documents  
  chatRoutes.js         → /api/v1/workspaces/:workspaceId/chat
  summaryRoutes.js      → /api/v1/workspaces/:workspaceId/summary
  flashcardRoutes.js    → /api/v1/workspaces/:workspaceId/flashcards
  quizRoutes.js         → /api/v1/workspaces/:workspaceId/quizzes
  historyRoutes.js      → /api/v1/history
```

### 3. API Endpoints (Skeleton)

**Workspaces:**
- `POST   /api/v1/workspaces`                  — Create workspace
- `GET    /api/v1/workspaces`                  — List user's workspaces (paginated)
- `GET    /api/v1/workspaces/:workspaceId`     — Get workspace detail
- `PATCH  /api/v1/workspaces/:workspaceId`     — Update workspace title
- `DELETE /api/v1/workspaces/:workspaceId`     — Delete workspace

**Documents:**
- `POST   /api/v1/workspaces/:workspaceId/documents`   — Upload document
- `GET    /api/v1/workspaces/:workspaceId/documents`   — List documents in workspace

**Chat:**
- `POST   /api/v1/workspaces/:workspaceId/chat`        — Send message
- `GET    /api/v1/workspaces/:workspaceId/chat/history`— Get chat history

**Summary:**
- `POST   /api/v1/workspaces/:workspaceId/summary/generate`
- `GET    /api/v1/workspaces/:workspaceId/summary`

**Flashcards:**
- `POST   /api/v1/workspaces/:workspaceId/flashcards/generate`
- `GET    /api/v1/workspaces/:workspaceId/flashcards`
- `PATCH  /api/v1/workspaces/:workspaceId/flashcards/:flashcardId/review`

**Quizzes:**
- `POST   /api/v1/workspaces/:workspaceId/quizzes/generate`
- `GET    /api/v1/workspaces/:workspaceId/quizzes`
- `GET    /api/v1/workspaces/:workspaceId/quizzes/:quizId`
- `POST   /api/v1/workspaces/:workspaceId/quizzes/:quizId/submit`

**History:**
- `GET    /api/v1/history`                    — List user activity history

### 4. Upload Middleware (`uploadMiddleware.js`)
```javascript
// Gunakan multer dengan config:
// - dest: 'uploads/'
// - fileFilter: hanya pdf, txt, md
// - limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
```

### 5. `app.js` Update
Register semua route baru dengan prefix `/api/v1/`:
```javascript
app.use('/api/v1/workspaces', authMiddleware, workspaceRoutes);
app.use('/api/v1/documents', authMiddleware, documentRoutes);
// ...dst
```

---

## API Requirements

### Standard Response Format
Semua endpoint WAJIB menggunakan format ini:
```json
// Success
{ "success": true, "data": {}, "message": "Operation successful" }

// Error
{ "success": false, "message": "Error description", "error": "detail" }

// Paginated List
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 } }
```

---

## Error Handling
- Semua route handler dibungkus `asyncWrapper` / `try-catch`
- Global error handler di `app.js` sudah ada — **jangan ubah**
- Validasi `req.user` di setiap protected route menggunakan `authMiddleware`

---

## Acceptance Criteria
- [ ] Semua 8 model terdefinisi dengan benar di `backend/src/models/`
- [ ] Semua route file terdaftar di `app.js` dengan prefix `/api/v1/`
- [ ] `GET /api` health check masih berjalan
- [ ] Semua endpoint skeleton mereturn `501 Not Implemented`
- [ ] `POST /api/v1/workspaces` belum harus berfungsi — cukup 501
- [ ] Multer middleware terkonfigurasi dengan benar
- [ ] Tidak ada import error saat `node src/server.js`

---

## Manual Testing Checklist
- [ ] `node src/server.js` — server start tanpa error
- [ ] `GET http://localhost:5000/api` — returns health message
- [ ] `GET http://localhost:5000/api/v1/workspaces` — returns 401 (no token)
- [ ] `GET http://localhost:5000/api/v1/workspaces` dengan valid token — returns 501
- [ ] Semua 7 route file ada di `backend/src/routes/`
- [ ] Semua 8 model ada di `backend/src/models/`

---

## Expected Final Result
Backend memiliki arsitektur lengkap dengan semua model dan route skeleton. Fondasi ini memastikan task-task selanjutnya bisa diimplementasikan satu per satu tanpa perlu mengubah struktur core. Server berjalan tanpa error, semua route terdaftar, siap untuk diisi implementasi nyata.
