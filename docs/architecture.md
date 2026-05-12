# Architecture Guidelines

Dokumen ini mendeskripsikan fondasi teknis dan arsitektur untuk project AI Learning Platform. Arsitektur ini dirancang agar *scalable, clean, modular*, dan mudah dipahami oleh *multi-agent development*.

## 1. Tech Stack Overview
*   **Frontend:** React, Vite, TailwindCSS, Zustand (State Management), React Router v6.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose ORM).
*   **AI Service:** Google Gemini API.

---

## 2. Frontend Architecture
Menggunakan pendekatan komponen berbasis fitur (Feature-Driven Architecture). Struktur ini mencegah "folder hell" di mana satu folder memiliki ratusan file.

### Folder Structure (Frontend)
```text
src/
├── assets/         # Static files, images, icons
├── components/     # Global/Reusable UI components (Buttons, Cards, Modals)
├── features/       # Feature-based modules (Core logic)
│   ├── workspace/  # Tab actions, AI chat, PDF viewer
│   ├── dashboard/  # Dashboard widgets, stats
│   └── auth/       # Login, Register, ProtectedRoute
├── layouts/        # Layout wrappers (MainLayout, AuthLayout)
├── pages/          # Route entries (menggabungkan components/features)
├── services/       # API call definitions (Axios instances)
├── store/          # Global state management (Zustand slices)
├── utils/          # Helper functions, formatters
└── App.jsx         # Root component & Routing configuration
```

### State Management Strategy
*   **Local State (`useState`):** Hanya untuk state UI komponen (contoh: toggle dropdown, input form sementara).
*   **Global State (Zustand):** Untuk state yang dibagikan melintasi banyak komponen yang jauh (contoh: User Session, Workspace Context, Theme).
*   *Rule of thumb:* Hindari menggunakan Redux/Zustand jika props drilling hanya terjadi 1-2 level ke bawah.

### Routing & Nested Route Strategy
Menggunakan React Router v6 dengan struktur *Nested Routes* yang ketat.
```javascript
<Route path="/learning/workspace/:id" element={<WorkspaceLayout />}>
    <Route index element={<ContentTab />} />
    <Route path="chat" element={<AIChatTab />} />
    <Route path="aiaction" element={<AIActionTab />} />
    <Route path="flashcard" element={<FlashcardTab />} />
    <Route path="quiz" element={<QuizTab />} />
</Route>
```
*   **Why:** Mencegah rendering ulang dari layout utama (`WorkspaceLayout`) saat user berpindah tab. State dokumen/workspace tetap terjaga.

---

## 3. Backend Architecture
Menggunakan pola **Controller-Service-Repository/Model** untuk memisahkan *business logic* dari *routing layer*.

### Folder Structure (Backend)
```text
src/
├── config/         # Environment, DB connection, Gemini Config
├── controllers/    # Handle HTTP requests & responses
├── middlewares/    # Auth validation, Error handling, Upload (Multer)
├── models/         # Mongoose schemas
├── routes/         # Express router definitions
├── services/       # Business logic & AI interactions
└── utils/          # Helpers, prompt builders, text chunkers
```

### API Structure
RESTful API dengan standardisasi respon:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

---

## 4. AI Architecture & Context-Aware Flow

### Workspace Lifecycle & Context-Aware Flow
1.  **Init Workspace:** Saat user masuk ke `/workspace/:id`, Frontend memanggil `GET /api/v1/workspaces/:id`.
2.  **Load Context:** Backend mengembalikan meta-data dokumen dan status *parsed text*.
3.  **Chat Execution:** Saat user mengirim pesan ke *AI Chat Workspace*:
    *   Frontend mengirim: `{ message: "Jelaskan bab 1", workspaceId: "123" }`
    *   Backend memanggil `DocumentService` untuk menarik *chunk* teks yang relevan dari MongoDB berdasarkan `workspaceId`.
    *   Backend memformat prompt: `System: Anda AI spesifik untuk dokumen berikut: [DOCUMENT_TEXT]. User: Jelaskan bab 1`.
    *   Backend meneruskan prompt tersebut ke **Gemini API**.
    *   Response dari Gemini dikembalikan ke user dan disimpan ke `messages` table.

### Chunking Strategy (AI Scalability)
Mengingat dokumen bisa sangat besar (ratusan halaman), teks tidak bisa dijejalkan semua ke dalam satu prompt Gemini.
*   **Preparation:** Saat file di-upload, teks diekstrak, lalu dipecah menjadi array of string (chunks) per paragraf atau per *N* karakter, kemudian disimpan ke database.
*   *(Future Enhancement)*: Jika data terbukti terlalu masif, siapkan implementasi Vector Database (contoh: Pinecone) untuk implementasi RAG (Retrieval-Augmented Generation) sungguhan.

---

## 5. Core Data Flows

### Upload Flow
*   User upload file (UI) -> `POST /api/v1/documents` -> Middleware (`multer`) menyimpan file (lokal/S3) -> Service membaca PDF/Word menjadi teks -> Teks di-chunk -> Simpan ke `documents` DB -> Kembalikan `documentId` ke Frontend.

### Flashcard & Quiz Flow
*   User klik "Generate" -> Panggil `POST /api/v1/workspaces/:id/generate/flashcards` -> Backend menyatukan context dokumen dengan spesifik **System Prompt** (*"Hasilkan 5 flashcard dalam bentuk JSON murni..."*) -> Parsing response Gemini dari JSON string ke Object -> Simpan ke DB -> Kembalikan ke Frontend.

### History Soft-Delete Flow
*   Semua aksi (*upload*, *generate summary*, *finish quiz*) memicu `HistoryService.logActivity()`.
*   Log ini menyimpan `entity_title` (contoh: "Dokumen Fisika Bab 1").
*   Saat dokumen "Fisika Bab 1" dihapus, data dokumen hilang dari DB, tetapi log activity tetap memiliki `entity_title`. Frontend membaca log tersebut dan me-render status `"Dokumen Fisika Bab 1 (Deleted/Unavailable)"`.

---

## 6. Error Handling Strategy
*   **Backend:** Semua route dibungkus dengan *AsyncWrapper* / *Global Error Middleware*. Error ditangkap dan direturn dengan format standar (contoh: HTTP 400 untuk validasi, HTTP 500 untuk server error).
*   **Frontend:**
    *   Gunakan `try/catch` di dalam Service/Store.
    *   Tampilkan *Toast Notification* yang ramah user saat error terjadi (contoh: "Gagal memuat dokumen").
    *   Gunakan **Error Boundary** pada komponen kritis (seperti PDF viewer atau Workspace layout) agar jika satu komponen *crash*, tidak membuat layar blank total.

## 7. Future Backend Integration Preparation
*   **Decoupled Services:** Jaga agar pemanggilan fungsi *Gemini API* terisolasi di dalam `AiService`. Jika nanti *engine* AI diganti, cukup ubah satu file tersebut.
*   **Pagination:** Semua endpoint yang mereturn *list* (documents, history) HARUS mengimplementasikan pagination sejak hari pertama untuk menjamin *scalability* saat data membesar.
