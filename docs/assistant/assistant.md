# Blueprint Global AI Assistant

## 1. Visi & Konsep
Assistant Page merupakan "Global Hub" di mana user dapat mengakses semua riwayat percakapannya dengan AI dari berbagai Workspace tanpa harus masuk ke masing-masing halaman Workspace secara terpisah. Ini memberikan kemudahan bagi user untuk meninjau kembali diskusi, ringkasan, atau penjelasan dari dokumen-dokumen yang pernah dipelajari secara cepat.

Karena arsitektur saat ini mengikat 1 `AiConversation` dengan 1 `Workspace` (dan 1 `Document`), maka list conversation di sidebar Assistant merepresentasikan list workspace yang memiliki chat history.

## 2. Struktur Folder & Modul
Modul Assistant di-isolate di dalam `frontend/src/features/assistant/`.

```text
frontend/src/
  features/
    assistant/
      components/
        ChatSidebar.jsx    # Sidebar untuk list conversations
        ChatArea.jsx       # Area utama untuk pesan
      services/
        assistantApi.js    # Fungsi axios ke endpoint /api/v1/assistant
      store/
        assistantStore.js  # Zustand state management
  pages/
    assistant/
      AssistantPage.jsx    # Root container
```

## 3. Integrasi Backend
Karena fitur ini bersifat global (mengambil data lintas workspace), kita akan membuat controller & routes baru di backend: `assistantController.js` dan `assistantRoutes.js` (dengan prefix `/api/v1/assistant`).

Endpoint utama yang dibutuhkan:
1. `GET /api/v1/assistant/conversations`
   Mengambil semua `AiConversation` milik user beserta detail `lastMessage`, diurutkan dari yang paling baru.

Untuk fetch pesan detail dan mengirim pesan baru, kita tetap **menggunakan endpoint yang sudah ada** di Workspace (`/api/v1/workspaces/:workspaceId/chat`), karena AI context-aware terikat dengan dokumen workspace tersebut.

## 4. UI/UX Flow
1. **Initial Load:** User membuka `/assistant`. Fetch data `conversations` dari backend.
2. **Sidebar:** Menampilkan list percakapan. Percakapan paling atas (terbaru) otomatis menjadi `activeContext` jika ada.
3. **Pilih Percakapan:** User mengklik salah satu percakapan di sidebar. Store akan mengambil riwayat pesan (menggunakan endpoint chat history dari workspace tersebut).
4. **Kirim Pesan:** User mengetik pesan. Store akan mengirim POST request ke endpoint chat workspace.
5. **New Conversation:** Karena chat butuh dokumen, tombol "New Conversation" akan mendirect user ke halaman `/learning` untuk mengunggah dokumen baru atau memilih workspace yang belum ada chatnya.

## 5. Rencana Eksekusi (Tasks)
Kita akan membagi pengerjaan ke dalam 4 task utama:
1. **Task 01 - Assistant Backend Flow:** Membuat Controller dan Route untuk fetch list global conversations.
2. **Task 02 - Assistant API & Store:** Membuat `assistantApi.js` dan Zustand `assistantStore.js` di frontend.
3. **Task 03 - UI Integration (Sidebar & Chat Area):** Menghubungkan komponen `ChatSidebar` dan `ChatArea` dengan store.
4. **Task 04 - Page Wiring & Polish:** Mengintegrasikan semuanya di `AssistantPage.jsx` dan menangani loading, empty state, dan mobile responsivity.
