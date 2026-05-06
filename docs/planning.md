# Blueprint AI Learning Assistant (Context-Aware)

## 1. Arsitektur Sistem (High-Level)
Sistem ini menggunakan arsitektur 3-tier standar modern web development:
- **Client/Presentation Layer (Frontend):** Aplikasi Single Page Application (SPA) berbasis React. Bertugas mempresentasikan UI dan menangani interaksi user.
- **Application/API Layer (Backend):** REST API berbasis Node.js & Express. Bertindak sebagai jembatan antara frontend dengan database dan layanan eksternal.
- **Data & External Service Layer:** 
  - **Database:** MongoDB untuk menyimpan data operasional (User, Document, Chat history).
  - **AI Service:** Google Gemini API untuk memproses *Natural Language*, memberikan summary, dan menjawab pertanyaan berbasis konteks (context-aware).
  - **File Storage:** Local storage (disk) backend atau layanan Cloud (AWS S3/Cloudinary) untuk menyimpan file PDF materi. Untuk MVP, local storage cukup.

## 2. Struktur Folder 

### Backend (Node.js + Express)
Pendekatan *separation of concerns*.
```text
backend/
├── src/
│   ├── config/         # Konfigurasi env, database, dan Google Gemini
│   ├── controllers/    # Mengatur request & response HTTP
│   ├── middlewares/    # Custom middleware (Auth JWT, Upload Multer, Error Handler)
│   ├── models/         # Skema Mongoose/MongoDB (User, Document, Chat)
│   ├── routes/         # Definisi endpoint (auth, documents, chats)
│   ├── services/       # Business logic (Integrasi Gemini, Parsing PDF)
│   ├── utils/          # Helper (hash password, generate JWT)
│   ├── app.js          # Inisialisasi Express & routing
│   └── server.js       # Entry point untuk run server
├── uploads/            # Direktori penyimpanan PDF lokal (MVP)
├── .env
└── package.json
```

### Frontend (React)
```text
frontend/
├── src/
│   ├── assets/         # Gambar, icon, CSS global
│   ├── components/     # UI Component reusable (Button, Input, Navbar, PDFViewer, ChatBubble)
│   ├── context/        # React Context (AuthContext)
│   ├── hooks/          # Custom hooks (useAuth, useChat)
│   ├── pages/          # Halaman utama (Login, Register, Dashboard, Workspace)
│   ├── services/       # Pemanggilan API (axios/fetch config)
│   ├── App.jsx         # Root router
│   └── main.jsx
├── .env
└── package.json
```

## 3. Desain Database (MongoDB)

**User Schema (`users`)**
- `_id`: ObjectId
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `createdAt`: Date

**Document Schema (`documents`)**
- `_id`: ObjectId
- `userId`: ObjectId (Ref: User)
- `title`: String
- `fileName`: String (nama file di storage)
- `extractedText`: String (Teks hasil parse dari PDF)
- `summary`: String (Hasil summary AI)
- `createdAt`: Date

**Chat Schema (`chats`)**
- `_id`: ObjectId
- `documentId`: ObjectId (Ref: Document)
- `userId`: ObjectId (Ref: User)
- `messages`: Array of Objects
  - `role`: Enum ('user', 'model')
  - `content`: String
  - `timestamp`: Date
- `createdAt`: Date

*Catatan untuk Fitur Tambahan (Struktur Disiapkan)*:
- Bisa ditambahkan entitas `Course` dan menghubungkan `Document` ke `courseId`.

## 4. Alur Data (Flow)

### Upload PDF & Ekstraksi Teks
1. **Client:** User klik upload PDF. File dikirim via `multipart/form-data` dengan Bearer token.
2. **Backend (Middleware):** Autentikasi JWT & `multer` untuk save file ke lokal.
3. **Backend (Controller -> Service):** Baca file PDF, gunakan library seperti `pdf-parse` untuk ekstrak teks murni.
4. **Backend (DB):** Simpan metadata dokumen (termasuk path dan `extractedText`) ke database.
5. **Client:** Terima response sukses dan update list dashboard.

### AI Summary Dokumen
1. **Trigger:** Setelah ekstraksi teks berhasil (bisa otomatis setelah upload, atau via request manual dari client).
2. **Backend (Service):** Mengirim *prompt* ke Google Gemini API: *"Berikan ringkasan komprehensif dari materi berikut: [extractedText]"*.
3. **Backend (DB):** Simpan hasil dari Gemini ke field `summary` di dokumen.
4. **Client:** Menampilkan *summary* di Workspace panel.

### AI Chat Berbasis Dokumen (Context-Aware)
1. **Client:** User mengetik pertanyaan di panel AI.
2. **Backend (Controller):** Menerima `documentId`, `userId`, dan pesan user.
3. **Backend (Service):**
   - Ambil `extractedText` dari tabel Document.
   - Ambil *chat history* (jika ada) dari tabel Chat agar Gemini bisa mengingat tanya jawab sebelumnya.
   - Konstruksi prompt untuk Gemini. Contoh: *"Kamu adalah AI Learning Assistant. Jawab pertanyaan user berdasarkan teks materi kuliah ini... [isi materi]".*
4. **Backend (Service):** Kirim ke Gemini API.
5. **Backend (DB):** Push message 'user' dan balasan 'model' ke array `messages` di tabel Chat dokumen tersebut.
6. **Client:** Tampilkan balasan AI secara realtime/polling ke chat box.

## 5. Desain UI/UX Flow

### Dashboard Page
- **Header:** Logo aplikasi di kiri, Notifikasi & Profile (Logout) di kanan.
- **Main Content:**
  - Area drag-and-drop / tombol besar **"Upload PDF Materi"**.
  - **Recent Documents:** Grid/List view materi yang pernah diupload. Tiap item berisi judul, tanggal, dan tombol "Buka Workspace".

### Document Workspace Page (Pusat Interaksi AI)
- **Layout Split Screen:**
  - **Kiri (60% layar): PDF Viewer.** 
    - Menampilkan dokumen asli. Bisa scroll dan zoom. Untuk MVP cukup gunakan `<iframe src.../>` native HTML atau `react-pdf`.
  - **Kanan (40% layar): AI Panel.** Memiliki *Tab* atau *Accordion*:
    1. **Summary:** Tab default. Berisi ringkasan otomatis pembelajaran dokumen agar user punya gambaran cepat.
    2. **Chat/Q&A:** Area chat interaktif berbasis konteks. 
       - Di atas list chat, ada *Suggested Prompts* kecil (ex: "Jelaskan konsep penting", "Buat soal latihan dari materi ini").

## 6. Pembagian Responsibility (Backend Pattern)

- **Controllers:** Hanya bertugas memvalidasi input/request, mendelegasikan perintah kerja ke file Service, dan memformat HTTP Response JSON.
- **Services:** Area di mana "otak" (*core business logic*) berada. Melakukan integrasi eksternal (Google Gemini), mengatur ekstraksi library PDF, serta memanggil perintah manipulasi ke DB.
- **Routes:** Memetakan URL API ke layer Middlewares, lalu Controller mana yang akan dipanggil.
- **Middlewares:** Tugas pemotongan proses/repetitif. Misalnya keamanan (Mengeksekusi Validasi JWT Auth Token) serta mengatur logika storage upload `multer`.

## 7. Best Practice (MVP)

1. **Jaga Skalabilitas AI Context:** Gemini punya window token sangat besar. Namun mengirim history chat panjang + text PDF beresiko lambat di proses response. Untuk MVP dengan panjang teks rasional bisa di-*inject* secara penuh, jika kebutuhan mulai masif bisa mulai berpindah ke skema **RAG (Retrieval-Augmented Generation)**.
2. **Error Handling Terpusat:** Buat custom middleware Express di tingkat akhir routing yang menangkap semua error dengan pesan response standard `{ success: false, error: "pesan" }`.
3. **Keamanan Ekstra:** Karena aplikasi MVP pun berhak atas akses yang memadai, selalu gunakan Environment Variables `.env`. Serta ketika load file workspace PDF, pastikan dicek agar dokumen API hanya bisa dibuka oleh author yang membuat (*Document.userId == Token.userId*).
4. **Keringanan Frontend State:** Hindari *over-engineering* menggunakan Redux untuk MVP, gunakan custom *React Hooks* serta Context API untuk state global seperti Authentication (Token). State Chat cukup ditangani di component level Workspace.
