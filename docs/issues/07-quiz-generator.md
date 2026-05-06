# Issue: 07-quiz-generator

## Deskripsi Singkat
Untuk mengetes kesiapan UTS/UAS, AI otomatis membuat simulasi Multiple Choice Questions murni difokuskan dari materi dokumen PDF spesifik. 

## Tujuan Teknis
- Backend:
  - Prompt Engineering Gemini: *"Bertindaklah sebagai Dosen penguji. Generate 10 soal pilihan ganda menantang berdasar teks ini. Format JSON strict: {"question": "", "options": ["A","B","C","D"], "correct_answer": ""}"*.
  - Pembuatan endpoint creation dan submit penilaian `POST /api/quizzes/submit`.
  - Mongoose Model Schema `Quiz`.
- Frontend:
  - UI interaktif Form Radio Buttons dengan visualisasi warna hijau (Benar) dan merah (Salah) setelah mode *submit / evaluasi*.

## Dependency
- 03-document-parsing.
