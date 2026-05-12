# Learning Workspace Technical Planning & Feature Breakdown

**Project:** Denbest AI Learning Platform  
**Feature:** Context-Aware Learning Workspace  
**Status:** Planning & Architecture  

---

## 1. Learning Workspace Vision

### Tujuan Utama Workspace
Workspace dirancang untuk menjadi environment belajar yang **terisolasi (isolated)** dan **fokus (focused)**. Ini adalah pusat kontrol di mana user berinteraksi secara mendalam dengan materi pembelajaran spesifik, didukung penuh oleh kapabilitas AI.

### Kenapa Workspace adalah Core Feature?
Dalam platform e-learning tradisional, user sering kali pasif (hanya membaca atau menonton). Pada platform berbasis AI ini, Workspace adalah jembatan antara **pasif** dan **aktif** learning. Ini bukan sekadar tempat menampilkan PDF, melainkan "otak sekunder" user untuk materi tersebut—memungkinkan tanya jawab, pengujian (kuis), dan retensi (flashcard).

### Hubungan Workspace dengan AI Context-Aware
Workspace bertindak sebagai **Context Boundary** (Batas Konteks) untuk AI. Saat user berada di dalam sebuah workspace:
1. AI difokuskan secara eksklusif pada dokumen yang ada di workspace tersebut (RAG - Retrieval-Augmented Generation).
2. Meminimalisir halusinasi AI dengan memberikan *ground truth* (fakta dasar) yang kuat dari materi yang diunggah.
3. Personalisasi respons berdasarkan riwayat chat dan hasil kuis user di dalam workspace tersebut.

---

## 2. Full User Flow

Berikut adalah flow detail pergerakan user sejak awal hingga menguasai materi:

1. **Upload Document (`/learning`)**
   - User memilih file (PDF, TXT, MD) dari dashboard *My Learning*.
   - Frontend memvalidasi tipe file dan ukuran.
2. **Processing (Backend / Background Job)**
   - Backend menerima file, melakukan OCR/parsing teks.
   - Text dipecah (chunking) dan diubah menjadi vektor (embedding), lalu disimpan ke Vector DB.
3. **Create Workspace**
   - Setelah dokumen selesai diproses, sistem men-generate `workspaceId` dan menghubungkan dokumen tersebut ke workspace baru.
4. **Start Learning (`/learning/workspace/:workspaceId`)**
   - User dialihkan ke halaman Workspace.
   - UI menampilkan PDF viewer/Content viewer di satu sisi, dan AI panel di sisi lain (split-screen).
5. **AI Interaction (Chat Tab)**
   - User bertanya secara spesifik tentang halaman/paragraf tertentu.
   - AI mencari konteks di Vector DB (RAG) dan memberikan jawaban dengan sitasi ke dokumen.
6. **Summary Generation (AI Action Tab)**
   - User meminta ringkasan otomatis dari dokumen. AI men-generate bullet points dari poin-poin utama dokumen.
7. **Flashcard Creation & Practice (Flashcard Tab)**
   - User menekan "Generate Flashcards". AI membuat pasangan Pertanyaan-Jawaban dari dokumen.
   - User berlatih dengan mekanisme Spaced Repetition (SRS) sederhana.
8. **Quiz (Quiz Tab)**
   - User mengambil (Pilihan Ganda) yang di-generate AI berdasarkan materi.
9. **History**
   - Semua aktivitas, skor kuis, dan interaksi chat disimpan sebagai riwayat yang bisa direview kapan saja.

---

## 3. Workspace Architecture

Pendekatan arsitektur untuk Workspace menggunakan **Scalable React Architecture** dengan pattern yang jelas.

* **Module Isolation:** Modul `workspace` harus independen di bawah `src/features/workspace`.
* **Split-Pane Layout:** Menggunakan library seperti `react-split` atau custom flexbox untuk membagi area *Document Viewer* (kiri) dan *Interactive Panel* (kanan).
* **Tabs System:** Interactive Panel menggunakan *Tabbed Interface* agar user bisa berpindah antara Chat, Flashcard, dan Kuis tanpa kehilangan state (menggunakan state management/React Router Outlet).
* **Nested Routes:** Workspace menggunakan nested routing agar URL merefleksikan state aplikasi (e.g., sedang di tab chat atau quiz).
* **Context Provider:** Menggunakan `WorkspaceProvider` pada level root `/workspace/:workspaceId` untuk menyimpan metadata workspace (nama, id, document info) agar tidak terjadi *prop-drilling*.
* **State Management:** Mengkombinasikan Server State (Zustand/TanStack Query untuk data fetch caching) dan Local State (Context API untuk UI state).

---

## 4. Routing Structure Recommendation

URL didesain agar RESTful secara semantic di sisi client (Frontend):

* `/learning`
  Dashboard utama tempat user melihat daftar workspace dan tombol upload, dan jg start learning pada card.
* `/learning/workspace/:workspaceId`
  Root dari workspace. Secara default ketika user klik start learning me-redirect ke `/learning/workspace/:workspaceId`. yg dmn ini tempat tab content aktif.
* `/learning/workspace/:workspaceId/chat`
  Tab AI Chat aktif. Tampilan atas: dokumen, tampilan bawah: Chat interface.
* `/learning/workspace/:workspaceId/action`
  Tab AI Action (Summary, Translate, Explain).
* `/learning/workspace/:workspaceId/flashcards`
  Tab berlatih flashcard.
* `/learning/workspace/:workspaceId/quiz`
  Tab mengambil kuis baru.
* `/learning/workspace/:workspaceId/quiz/:quizId`
  Melihat hasil detail dari kuis tertentu.

**Reasoning:**
Menggunakan URL untuk setiap tab (Nested Routes) sangat penting agar:
1. User dapat me-refresh halaman tanpa kehilangan posisi (tetap di tab kuis, misalnya).
2. Memungkinkan Deep Linking (membagikan URL langsung ke hasil kuis).
3. Membantu code splitting di React (lazy loading komponen per tab).

---

## 5. Workspace Tabs Breakdown

### A. Content (Left Panel)
* **Tujuan:** Menampilkan materi sumber aslinya (PDF Viewer, Markdown Viewer).
* **UI:** PDF rendering engine (misal: `react-pdf`), dengan fitur zoom, pagination, text selection.
* **State:** `currentPage`, `zoomLevel`, `selectedText`.
* **Future Scalability:** Highlight teks dan "Ask AI about this highlight".

### B. AI Chat (Right Panel - Tab 1)
* **Tujuan:** Conversational interface untuk interaksi dinamis.
* **UI:** Message thread (User vs AI), input box dengan attachment/command, markdown rendering untuk jawaban AI.
* **State:** `messages[]`, `isTyping`, `inputDraft`.
* **Backend Integration:** WebSocket atau SSE (Server-Sent Events) untuk efek *typing/streaming* AI.

### C. AI Action (Right Panel - Tab 2)
* **Tujuan:** Fitur one-click AI (Summarize, Simplify, Find Key Terms).
* **UI:** Grid button actions, diikuti oleh result text box.
* **State:** `actionResult`, `isLoadingAction`.
* **Future Scalability:** Custom prompt action (user bisa membuat shortcut AI-nya sendiri).

### D. Flashcard (Right Panel - Tab 3)
* **Tujuan:** Retensi memori jangka panjang.
* **UI:** Card UI dengan animasi flip. Tombol "Show Answer", lalu tombol rating "Hard, Good, Easy".
* **State:** `cards[]`, `currentCardIndex`, `flipState`.
* **Backend Integration:** Endpoint untuk generate flashcard via LLM, endpoint update SRS progress.

### E. Quiz (Right Panel - Tab 4)
* **Tujuan:** Evaluasi pemahaman komprehensif.
* **UI:** Form wizard (1 pertanyaan per layar) dengan timer.
* **State:** `questions[]`, `answers{}`, `timeRemaining`.
* **Future Scalability:** Adaptive quiz (pertanyaan makin susah jika user benar terus).

### F. Quiz Result (Right Panel - Tab 5)
* **Tujuan:** Menampilkan skor dan penjelasan area yang lemah.
* **UI:** Circular progress untuk skor, list salah/benar dengan penjelasan AI.
* **Backend Integration:** Endpoint fetch `quizId` beserta pembahasannya.

---

## 6. AI Context-Aware Flow

Bagaimana sistem membuat AI menjadi "pintar" pada dokumen user:

1. **Reading & Parsing:** Saat dokumen diunggah, backend mengekstrak raw text menggunakan PDF parser atau text extractor.
2. **Chunking:** Teks dibagi menjadi potongan (chunks) berukuran ~500-1000 token. Overlapping chunk (misal 50 token overlap) digunakan agar tidak kehilangan konteks antar paragraf.
3. **Vector DB (Embedding):** Setiap chunk diubah menjadi array of numbers (embedding) menggunakan model (e.g., OpenAI `text-embedding-3-small`) dan disimpan di Vector Database (e.g., Pinecone, Qdrant, atau pgvector). Metadata `workspaceId` dan `documentId` ditempelkan.
4. **Retrieval (RAG):** Saat user bertanya "Apa teori utama di halaman 5?", sistem mengubah pertanyaan menjadi vektor, mencari Top-K chunks yang paling mirip *hanya di dalam batasan `workspaceId` tersebut*.
5. **Prompt Injection:** Chunks yang relevan digabungkan menjadi konteks:
   ```text
   System: Anda adalah AI Tutor. Jawab pertanyaan user BERDASARKAN KONTEKS berikut. Jika jawaban tidak ada di konteks, bilang tidak tahu.
   Konteks: [Chunk 1], [Chunk 2]
   Pertanyaan: Apa teori utama...
   ```
6. **Workspace Boundary:** Filter metadata `workspace_id == current_workspace` pada query vector DB memastikan AI tidak membocorkan data dari workspace lain.
7. **Perbedaan Global vs Workspace Assistant:** Global assistant (di dashboard) hanya punya akses ke metadata workspace user, sedangkan Workspace Assistant punya RAG penuh ke isi dokumen di workspace tersebut.

---

## 7. Database Design

*Relational Schema Strategy (PostgreSQL)*

* **`workspaces`**
  - `id` (UUID, PK)
  - `user_id` (FK)
  - `title` (String)
  - `created_at`, `updated_at`
* **`documents`**
  - `id` (UUID, PK)
  - `workspace_id` (FK)
  - `filename`, `file_url`, `file_type`, `size_bytes`
  - `processing_status` (Enum: pending, processing, completed, failed)
* **`ai_conversations`**
  - `id` (UUID, PK)
  - `workspace_id` (FK)
  - `title`
* **`messages`**
  - `id` (UUID, PK)
  - `conversation_id` (FK)
  - `role` (Enum: user, assistant, system)
  - `content` (Text)
  - `tokens_used` (Int)
  - `created_at`
* **`summaries`**
  - `id` (UUID, PK)
  - `workspace_id` (FK)
  - `content` (Text - Markdown)
* **`flashcards`**
  - `id` (UUID, PK)
  - `workspace_id` (FK)
  - `front_text` (String)
  - `back_text` (Text)
  - `next_review_date` (Timestamp - untuk SRS)
* **`quizzes`**
  - `id` (UUID, PK)
  - `workspace_id` (FK)
  - `score` (Int)
  - `status` (Enum: draft, active, completed)
* **`history` (Audit Log)**
  - `id`, `user_id`, `workspace_id`, `action_type`, `metadata` (JSON)

---

## 8. Backend Endpoint Recommendation

*REST API structure (Enterprise-Ready & Scalable)*

**Workspaces & Documents:**
* `POST /api/v1/workspaces` - Create workspace & upload document.
* `GET /api/v1/workspaces` - List workspaces user.
* `GET /api/v1/workspaces/:workspaceId` - Get workspace detail & doc metadata.
* `DELETE /api/v1/workspaces/:workspaceId`

**AI Interactions:**
* `POST /api/v1/workspaces/:workspaceId/chat` - Mengirim pesan AI (Streaming response).
* `GET /api/v1/workspaces/:workspaceId/chat/history` - Load previous messages.

**Learning Artifacts:**
* `POST /api/v1/workspaces/:workspaceId/summary/generate`
* `GET /api/v1/workspaces/:workspaceId/summary`
* `POST /api/v1/workspaces/:workspaceId/flashcards/generate`
* `GET /api/v1/workspaces/:workspaceId/flashcards`
* `POST /api/v1/workspaces/:workspaceId/flashcards/:flashcardId/review` - Update SRS state.
* `POST /api/v1/workspaces/:workspaceId/quizzes/generate`
* `POST /api/v1/workspaces/:workspaceId/quizzes/:quizId/submit`

---

## 9. Frontend Architecture Recommendation

Struktur folder terisolasi di dalam `src/features/workspace`:

```text
src/
  features/
    workspace/
      components/
      hooks/
        useWorkspaceContext.js
        useChatStream.js
        useDocumentUpload.js
      services/
        workspaceApi.js
      store/
        workspaceStore.js (Zustand)
      pages/
        WorkspaceRoot.jsx
        WorkspaceDashboard.jsx
```

**Separation of Concerns:**
1. **Pages** hanya mengatur routing dan fetch data inisial.
2. **Layout** mengatur susunan grid/flex.
3. **Components** *dumb components* yang hanya menerima props.
4. **Hooks** tempat logic berjalan (RAG logic, API calls).
5. **Services** tempat Axios/Fetch definitions.

---

## 10. State Management Strategy

* **Workspace State (Zustand):** Untuk state global dalam fitur workspace (e.g., apakah sidebar sedang collapse, `activeDocumentId`, `isProcessingDoc`).
* **Active Tab (React Router):** State tab mana yang aktif diserahkan 100% pada URL (menggunakan `useParams` atau `<Outlet />`). Ini adalah praktik terbaik agar sistem *predictable*.
* **AI Loading State:** Variabel `isGeneratingResponse` disimpan di lokal komponen chat agar tidak me-render ulang seluruh workspace layout.
* **Upload Progress:** Di-manage oleh local state saat upload berjalan, menggunakan *Optimistic UI* (menampilkan bayangan dokumen di daftar sambil menunggu backend membalas).

---

## 11. Error Handling Strategy

1. **Upload Failed (Size Limit/Network):** Tangkap error di UI, sediakan tombol `Retry Upload` tanpa menghilangkan file dari antrean browser.
2. **AI Timeout/Rate Limit:** Jika LLM gagal membalas dalam 30s, tampilkan toast error "AI is taking too long to respond." dan berikan opsi "Regenerate".
3. **Parsing Error:** Jika PDF isinya hanya gambar (tanpa OCR backend), kembalikan status `failed_parsing` ke UI, sarankan user upload PDF yang memiliki teks.
4. **Unavailable/Deleted Workspace:** Tangkap 404/403 dari backend saat initial fetch di `/learning/workspace/:id`, redirect fallback ke `/learning` dengan pesan error.

---

## 12. Future Scalability

* **Collaborative Workspace:** Multiple users bisa berada di satu `workspaceId` dan chat dengan AI yang sama (memerlukan WebSocket Sync).
* **Realtime AI Streaming:** Menggunakan gRPC atau Server-Sent Events (SSE) agar jawaban chat keluar per kata secara instan (sudah standar industri saat ini).
* **Multi-Document Workspace:** Mengizinkan >1 dokumen dalam 1 workspace. RAG akan mencari di lintas dokumen (GraphRAG atau Hierarchical Retrieval).
* **AI Tutor Mode:** AI yang inisiatif menyapa duluan atau memberikan pop-quiz mendadak di tengah membaca.
* **Voice AI:** Tab khusus untuk "Interview/Voice Call" dengan AI tentang dokumen menggunakan WebRTC.

---

## 13. Recommended Development Order

Untuk project AI Learning Platform, urutan implementasi yang paling aman dan logis adalah:

1. **Phase 1: Foundation (CRUD & Viewer)**
   - Upload document (Backend parsing sederhana)
   - Create Workspace entry (DB)
   - Tampilkan dokumen di Frontend (PDF Viewer)
2. **Phase 2: Core Context (RAG Foundation)**
   - Integrasi Vector DB di backend (Chunking & Embedding)
   - Fitur AI Chat sederhana (1 tab)
3. **Phase 3: Learning Tools**
   - AI Summary Generation (karena paling mudah prompt-nya)
   - AI Flashcard Generation & UI dasar
4. **Phase 4: Advanced Testing**
   - AI Quiz Generation (membutuhkan struktur JSON output yang ketat dari LLM)
   - History & Assessment tracking
5. **Phase 5: Polish & Optimization**
   - Optimistic updates
   - Streaming text animation
   - Error handling & Timeout fallbacks

---
*End of Planning Document*
