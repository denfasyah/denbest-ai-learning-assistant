# Task 05 - Assistant History System & Optimization

**Tujuan:**
Memperluas arsitektur Asisten Global untuk mendukung manajemen riwayat tingkat lanjut layaknya ChatGPT. Ini mencakup persistensi state, pencarian & penyaringan, paginasi (infinite scroll), manajemen status percakapan (pinned/archived), serta optimasi database menggunakan MongoDB Aggregation Pipeline untuk menghindari N+1 query.

## 1. Peningkatan Skema Database
Update model `AiConversation` (`backend/src/models/AiConversation.js`) untuk mendukung pengaturan status lanjutan:
- Tambahkan field `pinned` (Boolean, default: `false`).
- Tambahkan field `archived` (Boolean, default: `false`).

## 2. Optimasi Backend & Ekstensi API (`assistantController.js`)

Refactor fungsi `getConversations` menggunakan kueri agregat (Aggregation Pipeline) MongoDB untuk menangani penggabungan metadata secara efisien dalam satu *query*, menghindari kelemahan N+1 query.

### Endpoint: `GET /api/v1/assistant/conversations`
**Mendukung Query Params:** `search`, `page`, `limit`, `filter` (contoh: 'pinned', 'archived', 'active').

**Strategi Aggregation Pipeline:**
1. **`$match`**: Filter berdasarkan `userId`. Tambahkan `$regex` pada `title` jika `search` tidak kosong. Filter `pinned` / `archived` sesuai parameter `filter`.
2. **`$lookup` (Workspaces)**: Hubungkan `workspaceId` ke koleksi `workspaces` untuk menarik nama ruang kerja (`workspaceName`).
3. **`$lookup` (Documents)**: Ambil juga informasi dokumen dari koleksi `documents` berdasarkan `workspaceId` untuk `documentName`.
4. **`$lookup` (Messages)**: Gabungkan dengan koleksi `messages` (sort berdasarkan `createdAt` DESC). Gunakan trik `$slice` atau akumulator `$last` untuk mendapatkan satu `lastMessage` dan perhitungkan `messageCount` dengan `$size`.
5. **`$sort`, `$skip`, `$limit`**: Lakukan paginasi setelah matching.
6. **`$project`**: Bentuk format response akhir.

**Target Output Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "workspaceId": "...",
      "title": "...",
      "workspaceName": "...",
      "documentName": "...",
      "messageCount": 15,
      "lastMessage": "Isi text pesan terakhir...",
      "lastMessageRole": "assistant",
      "createdAt": "...",
      "updatedAt": "...",
      "pinned": true,
      "archived": false
    }
  ],
  "pagination": { "page": 1, "limit": 20, "hasMore": true }
}
```

### Tambahan Action API (`assistantRoutes.js`)
Buat handler controller baru untuk manipulasi percakapan dan daftarkan:
- `PATCH /api/v1/assistant/conversations/:id/pin` (Toggle sematkan)
- `PATCH /api/v1/assistant/conversations/:id/archive` (Toggle arsip)
- `DELETE /api/v1/assistant/conversations/:id` (Menghapus penuh percakapan beserta seluruh pesannya)

## 3. Peningkatan Frontend Store (`assistantStore.js`)

**A. Persistensi Riwayat (Zustand Persist Middleware)**
* Gunakan `persist` dari `zustand/middleware` untuk menyimpan setidaknya state `activeConversationId` ke `localStorage`.
* Dengan ini, percakapan terakhir yang terbuka akan dipulihkan otomatis saat halaman web dimuat ulang (refresh).

**B. Simpan Draf Pesan**
* Tambahkan state `drafts: {}` (bentuk objek *key-value* di mana *key* adalah `conversationId` dan *value* adalah teks input user).
* Ini mencegah user kehilangan ketikan pesan ketika mereka berganti percakapan di tengah jalan.

**C. Infinite Scroll & Paginasi State**
* Tambahkan state pendukung: `page`, `hasMore`, `searchQuery`, dan `activeFilter`.
* Fungsi `fetchConversations` sekarang menerima parameter page. Jika page > 1, lakukan "append" data ke array `conversations` yang sudah ada, alih-alih me-*replace*.

## 4. Peningkatan UX / UI Frontend

**A. Bagian Sidebar (Sections)**
Refaktor list di `ChatSidebar.jsx` agar memisahkan data menjadi grup secara logis:
1. **Pinned** (Disematkan - tampil di paling atas)
2. **Recent** (Terbaru - yang tidak di-pin & belum di-archive)
3. **Archived** (Akan tampil jika user memilih filter/tombol ke mode Arsip)

**B. Pencarian & Pemuatan Gulir Tak Terbatas (Infinite Scroll)**
* Integrasikan `Input` search dengan store (berikan *debounce* 300ms agar tidak spam API).
* Tambahkan komponen/logika `IntersectionObserver` di paling bawah list sidebar. Saat user men-scroll ke bawah dan `hasMore` bernilai true, panggil `fetchConversations(page + 1)`.

**C. Implementasi Aksi Percakapan**
* Fungsikan *dropdown* (titik tiga `MoreHorizontal`): Panggil endpoint Pin, Archive, Delete via Zustand action. Berikan *Optimistic UI Update* (contoh: status pin langsung berubah di UI sebelum *request* selesai).

**D. Varian Status Kosong (Empty States)**
Sesuaikan konten fallback / empty state:
* **Tidak Ada Percakapan:** "Belum ada percakapan AI. Mulai belajar sekarang."
* **Tidak Ada Hasil Pencarian:** "Pencarian '...' tidak ditemukan."
* **Arsip Kosong:** "Belum ada obrolan yang diarsipkan."

## 5. Kriteria Penerimaan (Acceptance Criteria)
- [ ] Database menggunakan satu query agregat efisien tanpa terjadi query N+1 di backend.
- [ ] API `GET /conversations` mendukung parameter `search`, `page`, `limit`, dan memunculkan metadata ekstra secara tepat.
- [ ] API aksi Pin, Archive, dan Delete berfungsi memodifikasi database.
- [ ] `activeConversationId` secara presisten dipulihkan saat user merefresh browser (via local storage).
- [ ] Draf input pengguna tersimpan ketika berganti *tab/chat*.
- [ ] Sidebar dapat memuat data lama seiring pengguliran (Infinite Scroll).
- [ ] Pencarian berfungsi secara real-time.
- [ ] Antarmuka membedakan bagian percakapan *Pinned*, *Recent*, dan *Archived*.
- [ ] Asisten berperilaku sangat responsif dan dapat diukur, menyamai pengalaman pengguna aplikasi sidebar global (seperti ChatGPT).
