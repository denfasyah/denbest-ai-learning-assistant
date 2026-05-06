# Issue: 04-ai-summary-gemini

## Deskripsi Singkat
Automation AI tool generator untuk langsung memberikan mahasiswa ringkasan executive/abstrak dari ratusan lembar PDF yang telah berhasil diekstraksi. Digunakan pada Landing page UI Workspace Document sisi sebelah AI Panel. 

## Tujuan Teknis
- Backend:
  - Integrasi dan inisialisasi Object Model Google Gemini SDK dengan API KEY env (`@google/genai` atau similar).
  - Prompt Engineering Service dengan teknik instruksi: *"Tolong sarikan gagasan paling sentral, poin penting bertipe bullet, dan kesimpulan dari materi akademik ini: [extractedText]... Output pure markdown tanpa opening statement"*.
  - Eksekusi fetch trigger bisa manual via Hit Endpoint `POST /api/documents/:id/summarize` atau ditempel callback saat sukses parsing `03-parsing`.
  - Simpan dan cache hash ke field `{ summary: String }` milik schema Document. 

## Dependency
- 03-document-parsing (Karena prompt butuh inject string text asli).
