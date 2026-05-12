# Coding Standards & Guidelines

Panduan ini mengatur standar penulisan kode untuk memastikan konsistensi, *clean code*, dan efisiensi dalam kolaborasi tim maupun *multi-agent AI development*.

## 1. Naming Conventions
*   **Folders:** `kebab-case` (contoh: `ai-assistant/`, `ui-components/`).
*   **Files (Non-Component):** `camelCase.js` atau `kebab-case.js` (contoh: `apiService.js`, `format-date.js`).
*   **Files (React Components):** `PascalCase.jsx` (contoh: `WelcomeCard.jsx`, `WorkspaceLayout.jsx`).
*   **Variables & Functions:** `camelCase` (contoh: `const isLoading = true`, `const fetchData = () => {}`).
*   **Constants:** `UPPER_SNAKE_CASE` (contoh: `const MAX_UPLOAD_SIZE = 5000000;`).

## 2. React & Component Rules
*   **Max Component Complexity:** Sebuah komponen React tidak boleh lebih dari **250-300 baris kode**. Jika melebihi, pecah menjadi *sub-components*.
*   **When to Split:** 
    *   Jika JSX *nested* lebih dari 4-5 level.
    *   Jika sebuah komponen menangani 2 domain logika yang berbeda.
    *   *Loops* berulang di dalam JSX (pisahkan *item loop* menjadi komponen sendiri).
*   **Hooks Rules:** Letakkan hooks (useState, useEffect, custom hooks) di bagian paling atas dari komponen. Jangan gunakan *nested hooks* atau di dalam iterasi.

## 3. Import Ordering
Pastikan import terstruktur agar mudah dibaca:
1.  React & Node modules (contoh: `import { useState } from 'react';`, `import { Link } from 'react-router-dom';`)
2.  Third-party libraries (contoh: `import axios from 'axios';`)
3.  Global stores & Contexts (contoh: `import useAuthStore from '@/store/useAuthStore';`)
4.  Local components (contoh: `import ChatBubble from './ChatBubble';`)
5.  Utils, Services, and Types (contoh: `import { formatDate } from '@/utils/dateUtils';`)
6.  Assets & Styles (contoh: `import icon from '@/assets/icon.svg';`)

## 4. Tailwind Usage Rules
*   **Utility-First:** Gunakan *class* Tailwind langsung pada elemen untuk *styling* unik.
*   **Component Extraction:** Jika kombinasi kelas Tailwind digunakan berulang kali (lebih dari 3 kali, seperti style untuk *Card* atau *Button*), pertimbangkan untuk mengekstraknya menggunakan `@apply` di CSS atau mengubahnya menjadi komponen React (contoh: `Button.jsx`).
*   **Responsive Rules:** Selalu desain *Mobile-First*. Gunakan *prefix* seperti `md:`, `lg:` secara bertahap.
    *   Contoh salah: `class="lg:w-1/2 w-full"`
    *   Contoh benar: `class="w-full md:w-1/2"`

## 5. State Management Rules (Zustand)
*   Pisahkan *store* berdasarkan ranah logika bisnis (*domain-driven slices*). Jangan menggabungkan semua state di satu file store.
*   Contoh pemisahan: `useAuthStore.js`, `useWorkspaceStore.js`, `useChatStore.js`.
*   Hindari menyimpan state yang redundan atau dapat dikomputasi (derived state).

## 6. API Service Rules
*   Jangan memanggil `fetch` atau `axios` secara barbar di dalam komponen.
*   Gunakan **Axios Instance** tersentralisasi yang sudah dilengkapi dengan *interceptors* (untuk injeksi JWT token otomatis dan *global error handling*).
*   Bungkus *endpoints* ke dalam object service. 
    *   *Contoh:* `WorkspaceService.getById(id)` bukan `axios.get('/api/workspaces/'+id)`.

## 7. UI States (Loading & Empty Pattern)
Setiap layar atau komponen yang mengambil data asinkron harus menerapkan 3 jenis *state*:
1.  **Loading State:** Tampilkan *Skeleton loader* (direkomendasikan) atau Spinner modern selama data diambil. Jangan biarkan layar kosong secara mendadak.
2.  **Empty State:** Jika data kosong (0 documents, 0 history), tampilkan UI kosong yang ramah dengan ilustrasi tipis dan ajakan tindakan (*Call-to-Action*), contoh: "Belum ada dokumen, [Upload Dokumen Sekarang]".
3.  **Error State:** Tampilkan pesan *error* di area terkait atau gunakan Toast Notification jika *error* bersifat fana/ sementara.

## 8. Modals & Popups Rules
*   Gunakan Global Modal Manager atau buat komponen modal menggunakan React Portals.
*   Pastikan perilaku *close-on-escape* (tekan tombol ESC untuk tutup) dan *click-outside-to-close* aktif untuk UX yang modern.

## 9. Clean Code Guidelines
*   **No Magic Numbers/Strings:** Jangan menulis string hardcode berulang-ulang, letakkan di `constants.js` atau `.env`.
*   **Single Responsibility Principle:** Fungsi utilitas (`utils/`) hanya boleh melakukan 1 tugas (misal format tanggal, konversi angka).
*   **Self-Documenting Code:** Beri nama variabel dan fungsi yang mendeskripsikan secara jelas fungsinya. Hindari penamaan seperti `data1`, `temp`, atau `handleIt()`.
