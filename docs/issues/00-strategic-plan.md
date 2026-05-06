# Strategic Planning: AI Learning Assistant

## 1. System Architecture Detail

### Backend (Node.js + Express)
- **API Gateway/Routes**: Entry point for all frontend requests, secured by JWT payload checking.
- **Auth Service**: Handles registration, login, JWT issuance, and password hashing using bcrypt.
- **Document Service**: Manages PDF upload (Multer middleware), metadata storage on MongoDB, and interacts with the Parser Service.
- **Parser Service**: Extracts raw text from PDF files stored on the local disk.
- **AI Service**: Core wrapper around the Google Gemini API. Handles prompt structuring, context injection (extracted text + chat history), and response parsing.
- **Database (MongoDB)**: Mongoose schemas `User`, `Document`, `Chat`, `Flashcard`, `Quiz`, `Progress`.

### Frontend (React + Vite)
- **UI Architecture**: DaisyUI and Tailwind CSS for rapid atomic design development.
- **State Management**: React Context (`AuthContext`) for global states, and custom React Hooks (`useDocument`, `useChat`) for local business state handling.
- **API Caller**: Axios interceptor setup to automatically attach JWT tokens to backend requests.
- **Protected Routing**: React Router DOM wrapper to limit Workspace/Dashboard access to authenticated users only.

### Hubungan Antar Sistem & Data Flow Antar Service
1. **Authentication Flow:** Frontend requests `/auth/login` -> Auth Service validates MongoDB -> Returns JWT to Frontend localStorage.
2. **Upload Flow:** Frontend sends `FormData` -> Document Service (`multer`) saves PDF to `/uploads`, creates MongoDB Document record -> Triggers Parser Service.
3. **AI Action Flow:** Frontend sends query (`/api/chats`) -> Backend reads Document text + recent Chats -> AI Service prompts Gemini -> Returns response to Frontend.

## 2. Feature Roadmap (Urut Prioritas)

### Phase 1: Minimum Viable Product (MVP) - *Wajib Pertama*
- **01-auth-system**: Registrasi, Login, dan Keamanan JWT.
- **02-upload-pdf-system**: Penyimpanan file PDF dan metadata dokumen.
- **03-document-parsing**: Ekstraksi string/text utuh dari file PDF.

### Phase 2: Core AI Features
- **04-ai-summary-gemini**: Generator ringkasan materi secara otomatis.
- **05-ai-chat-context-aware**: AI Assistant interaktif berbasis teks PDF dengan short-term history memory.

### Phase 3: Advanced AI Features & Engagement
- **06-flashcard-generator**: Auto-generate flashcard definisi/istilah dari konten materi.
- **07-quiz-generator**: Generator kuis evaluasi berbasis konten (Multiple Choice Mode).
- **08-progress-tracking**: Sistem statistik basic (skor kuis dan progres penyelesaian).

## 4. AI Integration Strategy (Google Gemini)

### Context Injection
- Untuk menyiasati token windows awal (MVP), teks hasil parsifikasi PDF secara utuh akan disuntikkan (*injected*) di awal *system prompt* atau disamarkan dalam array parts messages. Karena file akademik seringkali besar, sistem akan memanfaatkan long-context window Gemini API hingga batasan wajar.
- **Future improvement:** Menerapkan teknik *chunking text* + *selective context injection* (opsional: RAG). Jika performa atau token cost mulai bermasalah, teks tidak lagi dikirim full melainkan hanya chunk paragraf yang relevan dengan pertanyaan saja yang disuntikkan.
### Prompt Strategy
- Gemini akan dikendalikan ketat melalui format JSON response schema *explicit prompt*. Contoh Prompt untuk Flashcard:
`"Baca materi berikut: [TEXT_PDF]. Buat 10 flashcard penting format JSON persis seperti berikut: [{"question": "...", "answer": "..."}]"`

### Handling PDF Long Text
- Extracted text akan dibersihkan dari double whitespaces dan baris patah untuk menghemat pengeluaran tokens dan menjaga efektivitas model processing. 

### Memory/Chat History Design
- Riwayat obrolan Q&A akan disimpan pada Document `Chat`. Setiap user memancing pertanyaan, backend akan query limit histori terbaru untuk dikirimkan kembali ke Gemini sebagai `history_array`.
- **Problem:** Menyimpan semua chat di array MongoDB beresiko membuat dokumen *bengkak* (ukuran JSON membengkak dan performa fetch turun drastis).
- **Solusi:** Tambahkan rule di level backend untuk **membatasi chat history** (misal max 20 message terakhir) yang diambil untuk context Gemini, dan gunakan **pagination** pada sisi API saat frontend memuat ulang halaman chat.
## 5. End-to-End User Flow (AI Learning Assistant)

### 1. Authentication
User membuka aplikasi → Login/Register → Backend validasi → JWT dikirim ke client → User masuk ke Dashboard

---

### 2. Document Management
User klik sidebar "Documents" → Masuk halaman Documents → 
User klik tombol "Upload PDF" → 
Frontend kirim file (multipart/form-data) → 
Backend (Multer) validasi file (.pdf, max 10MB) → 
File disimpan ke `/uploads` → 
Metadata disimpan ke MongoDB (Document Schema, userId)

---

### 3. Document Processing (Parsing)
Setelah upload berhasil:
Backend menjalankan Parser Service (pdf-parse) →
Extract text dari PDF →
Clean text (remove extra whitespace, normalize) →
Simpan ke field `extractedText` di Document

Status document:
- processing
- ready

---

### 4. Open Workspace (Core Feature)
User klik salah satu document →
Masuk halaman Workspace `/workspace/:id`

UI Split Layout:
- Kiri: PDF Viewer
- Kanan: AI Panel (Tab-based)

---

### 5. AI Panel (Tab System)

#### 🟢 Tab 1: Summary
- Saat pertama kali dibuka:
  IF summary belum ada:
    → Frontend trigger `POST /api/documents/:id/summarize`
    → Backend kirim extractedText ke Gemini
    → Response disimpan ke DB (cache)
  ELSE:
    → ambil dari DB

- Ditampilkan dalam format ringkasan (bullet / markdown)

---

#### 🔵 Tab 2: Chat (Context-Aware AI)
User input pertanyaan →
Frontend kirim ke `/api/chats/:documentId`

Backend:
- Ambil extractedText
- Ambil last 10 chat history
- Construct prompt (context + history + question)
- Kirim ke Gemini

Response:
- Disimpan ke Chat Schema
- Dikirim ke frontend

UI:
- Chat bubble (user vs AI)
- Auto scroll

---

#### 🟡 Tab 3: AI Actions
Berisi quick actions:

1. Generate Summary (manual trigger)
2. Explain Concept (user highlight text atau input topic)

Flow:
Frontend kirim request →
Backend inject context + instruction →
Gemini generate response →
Tampilkan di UI

---

#### 🟣 Tab 4: Flashcards
User klik "Generate Flashcards" →
Frontend kirim ke `/api/documents/:id/flashcards`

Backend:
- Prompt Gemini (JSON strict)
- Parse response
- Simpan ke DB

Frontend:
- Render card (flip animation)

---

#### 🔴 Tab 5: Quiz
User pilih jumlah soal (misal: 5 / 10 / 15) →
Klik Generate Quiz →

Backend:
- Prompt Gemini (MCQ JSON format)
- Simpan ke DB

Frontend:
- Render soal (radio button)
- Submit jawaban

---

### 6. Quiz Evaluation
User klik submit →
Frontend kirim jawaban ke backend →
Backend hitung score →
Simpan hasil ke DB →
Kirim result ke frontend

UI:
- tampilkan score
- highlight benar/salah
- tampilkan penjelasan

---

### 7. Progress Tracking
Setiap aktivitas:
- upload document
- generate quiz
- hasil quiz

Backend update statistik user →

Frontend Dashboard:
- total document
- quiz score
- activity history

---

## Notes (Best Practice)
- AI request tidak dijalankan otomatis semua (hindari overuse API)
- Gunakan caching (summary, flashcard, quiz)
- Batasi chat history (max 10 message)
- Validasi ownership: `Document.userId === req.user.id`
- Gunakan loading state di setiap AI action
## 6. Global Rules & Error Handling Strategy

### Centralized Error Handling
Penting untuk mengantisipasi skenario _AI gagal response, PDF corrupt, atau upload gagal_ agar sistem tetap stabil (tidak ada _silent crash_).
- **Solusi:** Terapkan **Centralized error handling middleware** di level App Express.
- Semua *throw error* dari controller maupun service ditangkap di satu gerbang.
- **Standard Response Format** yang wajid dipatuhi setiap balasan API (terutama jika gagal):
  ```json
  { "success": false, "message": "Pesan ramah pengguna", "error": "Detail log teknis" }
  ```

### Authorization Check (Security Strict)
- **Problem:** Adanya resiko kebobolan privasi, contoh: _user A bisa iseng nebak URL `/api/documents/<id-user-B>` dan mengakses materi/chat milik orang lain_.
- **Solusi Tambahan Rule:** Setiap endpoint yang memanipulasi atau mengambil document/chat harus melakukan validasi ketat identitas token JWT JWT vs Pemilik Document.
- **Wajib Validasi:** `if (Document.userId.toString() !== req.user.id) { throw new ForbiddenError() }`
