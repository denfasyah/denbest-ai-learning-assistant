# Issue: 06-flashcard-generator

## Deskripsi Singkat
Tekan satu tombol di UI Panel Workspace, dan Gemini akan membaca materi panjang lalu otomatis menerjemahkannya jadi kumpulan kartu istilah cepat (Term & Definitions). 

## Tujuan Teknis
- Backend:
  - Membuat Endpoint `POST /api/documents/:id/flashcards`.
  - Service Layer: Gemini Prompt Engineering strict to JSON. *"Ekstrak istilah teknis dari Teks: [TEXT_DOC]. Output strict array JSON contoh: [{"term": "CPU", "definition": "Unit pemrosesan.."}]"*.
  - Parsing String balasan Gemini ke Native Javascript Array JSON agar tidak error.
  - Memasukkan collection response ke Schema Mongoose `Flashcard`.
- Frontend:
  - UI Card interaktif dengan animasi CSS `flip/rotate` saat cursor di-hover/di-klik. Pagination/Swipe navigation UX.

## Dependency
- 03-document-parsing.
