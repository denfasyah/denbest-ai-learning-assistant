# Task 03 - UI Integration (Sidebar & Chat Area)

**Tujuan:**
Menghubungkan mock/hardcoded UI yang ada di `ChatSidebar.jsx` dan `ChatArea.jsx` dengan data asli dari `assistantStore`.

## 1. Integrasi `ChatSidebar.jsx`

* File `frontend/src/features/assistant/components/ChatSidebar.jsx`
* Hapus data props dummy (seperti list conversation hardcoded jika dipassing dari Parent) - kita akan pass data asli dari Store di `AssistantPage` nanti, tapi Sidebar perlu direfactor struktur rendernya jika perlu.
* Format penanggalan (`time`) dari DB (Date ISO) perlu diformat menggunakan `date-fns` atau Native Intl (misal: "2 hours ago" / "12 Mei 2026").
* Menambahkan status `active` secara dinamis:
  `chat.id === activeConversationId` menentukan UI aktif/tidaknya item di list.

### Poin Refactor Sidebar:
- Prop `conversations` yang diterima akan berformat: `{ id, workspaceId, title, lastMessage, time }`.
- Pastikan logika mapping item membaca field-field tersebut secara tepat.
- Tombol "New Conversation" akan menggunakan `useNavigate()` untuk redirect ke `/learning` (karena chat baru membutuhkan konteks dokumen baru).

## 2. Integrasi `ChatArea.jsx`

* File `frontend/src/features/assistant/components/ChatArea.jsx`
* Prop `messages` yang diterima akan berformat dari backend `{ role: 'user' | 'assistant', content: 'text', text: 'text' }`. Perhatikan mapping `message.content` atau `message.text` pada rendering box chat.
* Saat ini UI chat input menggunakan `textarea`. Integrasikan dengan local state `const [inputValue, setInputValue] = useState('')`.
* Fungsi pengiriman pesan (`sendMessage` dari props atau context). Saat disubmit (Enter atau klik tombol send):
  ```javascript
  if(inputValue.trim() && !isSendingMessage) {
    onSendMessage(inputValue);
    setInputValue('');
  }
  ```
* Tambahkan Loading UI indikator:
  Jika `isSendingMessage` bernilai `true`, tampilkan bubble animasi loading kecil (seperti 3 titik mengetik) atau matikan tombol "Send" agar tidak terjadi double-submit.

## 3. Formatting Data Utility
Sebaiknya buat helper sederhana untuk mem-format `time` menjadi *relative time* ("2 hours ago", "Yesterday") di dalam `utils` atau langsung di komponen Sidebar agar tampilan `Clock3` menjadi bagus.

## 4. Acceptance Criteria
- [ ] `ChatSidebar.jsx` sanggup merender array object dari API secara dinamis (menggunakan field yang benar: title, lastMessage, time format).
- [ ] Tombol `New Conversation` di Sidebar mendirect (`navigate`) ke `/learning`.
- [ ] `ChatArea.jsx` merender array pesan dari API.
- [ ] Terdapat input state di `ChatArea.jsx` yang bisa mengetik pesan dan submit.
- [ ] Scroll chat otomatis ke bawah jika pesan baru masuk (sudah dihandle via `useRef` di boilerplate, pastikan tetap jalan).
- [ ] Loading indikator tampil saat membalas pesan.
