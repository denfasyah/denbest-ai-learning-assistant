# Issue: 05-ai-chat-context-aware

## Deskripsi Singkat
Fitur paling esensial (Inti dari Assistant). Mahasiswa tidak hanya membaca, tetapi bisa *bercakap-cakap* langsung (Tanya Jawab / Q&A) tentang isi PDF tersebut dengan model Gemini.

## Tujuan Teknis
- Backend:
  - Membuat Route `POST /api/chats/:documentId` dan Chat Mongoose Model.
  - Alur Logika (Data flow) Service:
    1. Query document berdasar ID untuk menarik seluruh string `extractedText`.
    2. Query batasan histori chat (maksimal 20 chat terakhir atau via paginasi) untuk me-retain ingatan bot tanpa *membengkakkan* dokumen respons (Role: user/model). Injeksi chat berlebih via limit dan paginasi yang tepat.
    3. Merangkai Array untuk Endpoint SDK Gemini `chat.sendMessage(...)` (System prompt menginstruksikan LLM untuk strictly menjawab bedasar context yang tertempel).
    4. Menyimpan output jawaban bot + user query terbaru ke Mongoose Database Schema History.
- Frontend:
  - Membuat UI Chat Bubble (Kanan-Kiri) khas messenger di panel AI UI Workspace.
  - Hook fetching message history.
  - Setup Auto scroll-to-bottom.

## Dependency
- 03-document-parsing (Butuh teks konteks).
- 01-auth-system (Sistem **WAJIB** mengecek autentikasi kepemilikan document `Document.userId === req.user.id` sebelum memberikan izin user membuka atau mengirim chat).
